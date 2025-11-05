import dotenv from 'dotenv'
dotenv.config()

const ECWID_STORE_ID = process.env.VITE_ECWID_STORE_ID || process.env.ECWID_STORE_ID
const ECWID_SECRET_TOKEN = process.env.VITE_ECWID_SECRET_TOKEN || process.env.ECWID_SECRET_TOKEN

/**
 * Sync orders from Ecwid to Supabase
 * Fetches orders from Ecwid and updates/creates them in Supabase
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!ECWID_STORE_ID || !ECWID_SECRET_TOKEN) {
      return res.status(500).json({
        success: false,
        error: 'Ecwid credentials not configured'
      })
    }

    console.log('🔄 SERVER: Syncing orders from Ecwid...')
    
    // Fetch orders from Ecwid API
    // Support pagination and date filtering
    const { limit = 100, offset = 0, createdFromDate } = req.body || {}
    const cleanedToken = ECWID_SECRET_TOKEN.trim()
    
    // Build API URL with query parameters
    let apiUrl = `https://app.ecwid.com/api/v3/${ECWID_STORE_ID}/orders?limit=${limit}&offset=${offset}`
    
    // Add date filter if provided (sync orders from last 30 days by default)
    if (!createdFromDate) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      apiUrl += `&createdFromDate=${thirtyDaysAgo.toISOString()}`
    } else {
      apiUrl += `&createdFromDate=${createdFromDate}`
    }
    
    console.log('🌐 SERVER: Fetching orders from Ecwid:', apiUrl)
    
    let response
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanedToken}`,
        }
      })
      
      console.log('📡 SERVER: Ecwid orders API response:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ SERVER: Failed to fetch orders from Ecwid:', errorText)
        
        // Try to parse error if it's JSON
        let errorDetails = errorText
        try {
          const errorJson = JSON.parse(errorText)
          errorDetails = errorJson.errorMessage || errorJson.errorCode || errorText
        } catch {}
        
        return res.status(response.status).json({
          success: false,
          error: `Failed to fetch orders from Ecwid: ${errorDetails}`,
          statusCode: response.status,
          suggestion: response.status === 403 ? 'Check if app has read_orders scope enabled in Ecwid' : null
        })
      }
    } catch (err) {
      console.error('❌ SERVER: Exception fetching orders:', err.message)
      return res.status(500).json({
        success: false,
        error: `Failed to connect to Ecwid API: ${err.message}`
      })
    }

    const ecwidData = await response.json()
    const ecwidOrders = ecwidData.items || []
    const total = ecwidData.total || ecwidOrders.length
    
    console.log(`✅ SERVER: Fetched ${ecwidOrders.length} orders from Ecwid (total: ${total})`)
    
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Supabase credentials not configured'
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Sync each order to Supabase
    let synced = 0
    let updated = 0
    let created = 0
    
    for (const ecwidOrder of ecwidOrders) {
      try {
        // Map Ecwid order to our format
        const orderData = {
          order_id: ecwidOrder.orderNumber?.toString() || ecwidOrder.id?.toString() || `ecwid_${ecwidOrder.id}`,
          ecwid_order_id: ecwidOrder.id?.toString(),
          payment_id: ecwidOrder.paymentReference || null,
          payment_method: ecwidOrder.paymentMethod || 'unknown',
          items: ecwidOrder.items?.map(item => ({
            id: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            sku: item.sku
          })) || [],
          totals: {
            subtotal: ecwidOrder.subtotal || 0,
            total: ecwidOrder.total || 0,
            delivery: ecwidOrder.shippingOption?.shippingRate || 0
          },
          shipping_address: {
            firstName: ecwidOrder.shippingPerson?.name?.split(' ')[0] || '',
            lastName: ecwidOrder.shippingPerson?.name?.split(' ').slice(1).join(' ') || '',
            email: ecwidOrder.email || '',
            phone: ecwidOrder.shippingPerson?.phone || '',
            address: ecwidOrder.shippingPerson?.street || '',
            city: ecwidOrder.shippingPerson?.city || '',
            state: ecwidOrder.shippingPerson?.stateOrProvinceCode || '',
            pincode: ecwidOrder.shippingPerson?.postalCode || '',
            country: ecwidOrder.shippingPerson?.countryCode || 'IN'
          },
          fulfillment_status: mapEcwidStatusToOurStatus(ecwidOrder.fulfillmentStatus),
          created_at: ecwidOrder.createDate || new Date().toISOString()
        }
        
        // Check if order exists in Supabase
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('order_id')
          .eq('order_id', orderData.order_id)
          .single()
        
        if (existingOrder) {
          // Update existing order
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              ecwid_order_id: orderData.ecwid_order_id,
              fulfillment_status: orderData.fulfillment_status,
              totals: orderData.totals,
              shipping_address: orderData.shipping_address,
              items: orderData.items
            })
            .eq('order_id', orderData.order_id)
          
          if (updateError) {
            console.error(`❌ Failed to update order ${orderData.order_id}:`, updateError)
          } else {
            updated++
            synced++
          }
        } else {
          // Create new order
          const { error: insertError } = await supabase
            .from('orders')
            .insert(orderData)
          
          if (insertError) {
            console.error(`❌ Failed to create order ${orderData.order_id}:`, insertError)
          } else {
            created++
            synced++
          }
        }
      } catch (orderError) {
        console.error(`❌ Error syncing order ${ecwidOrder.id}:`, orderError.message)
      }
    }
    
    console.log(`✅ SERVER: Sync complete - ${synced} orders synced (${created} created, ${updated} updated)`)
    
    return res.status(200).json({
      success: true,
      synced,
      created,
      updated,
      total: ecwidOrders.length,
      message: `Successfully synced ${synced} orders from Ecwid`
    })
    
  } catch (error) {
    console.error('❌ SERVER: Failed to sync orders from Ecwid:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to sync orders from Ecwid'
    })
  }
}

/**
 * Map Ecwid fulfillment status to our status format
 */
function mapEcwidStatusToOurStatus(ecwidStatus) {
  const statusMap = {
    'AWAITING_PROCESSING': 'AWAITING_PROCESSING',
    'PROCESSING': 'PACKED',
    'SHIPPED': 'SHIPPED',
    'DELIVERED': 'DELIVERED',
    'WILL_NOT_DELIVER': 'CANCELLED',
    'RETURNED': 'RETURNED'
  }
  
  return statusMap[ecwidStatus] || 'AWAITING_PROCESSING'
}

