/**
 * Ecwid Integration Service
 * 
 * This service pushes orders from your custom frontend to Ecwid's backend
 * so you can track and manage orders through Ecwid's admin panel.
 */

const ECWID_STORE_ID = import.meta.env.VITE_ECWID_STORE_ID
const ECWID_SECRET_TOKEN = import.meta.env.VITE_ECWID_SECRET_TOKEN

/**
 * Push order to Ecwid
 * Creates an order in Ecwid so it appears in their admin dashboard
 * 
 * @param {Object} orderData - The order data from your checkout
 * @returns {Promise<Object>} Ecwid order response
 */
export async function pushOrderToEcwid(orderData) {
  try {
    if (!ECWID_STORE_ID || !ECWID_SECRET_TOKEN) {
      console.warn('⚠️ Ecwid credentials not configured. Skipping Ecwid sync.')
      return { success: false, error: 'Missing Ecwid credentials' }
    }

    console.log('📦 Pushing order to Ecwid:', orderData.orderId)

    // Transform your order data to Ecwid format
    const ecwidOrder = transformToEcwidFormat(orderData)

    // Push to Ecwid API
    const response = await fetch(
      `https://app.ecwid.com/api/v3/${ECWID_STORE_ID}/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ECWID_SECRET_TOKEN}`,
        },
        body: JSON.stringify(ecwidOrder)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Ecwid API error:', errorText)
      throw new Error(`Ecwid API returned ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    console.log('✅ Order synced to Ecwid successfully:', result)

    return {
      success: true,
      ecwidOrderId: result.id,
      orderNumber: result.orderNumber
    }

  } catch (error) {
    console.error('❌ Failed to push order to Ecwid:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Record failed payment attempt in Ecwid
 * Creates a "Failed" or "Incomplete" order so you can track failed payments
 * 
 * @param {Object} failedOrderData - The failed order data
 * @returns {Promise<Object>} Ecwid response
 */
export async function recordFailedPaymentInEcwid(failedOrderData) {
  try {
    if (!ECWID_STORE_ID || !ECWID_SECRET_TOKEN) {
      console.warn('⚠️ Ecwid credentials not configured. Skipping failed payment tracking.')
      return { success: false, error: 'Missing Ecwid credentials' }
    }

    console.log('⚠️ Recording failed payment in Ecwid:', failedOrderData.orderId)

    // Transform to Ecwid format with "INCOMPLETE" status
    const ecwidOrder = transformToEcwidFormat(failedOrderData)
    
    // Mark as incomplete/failed
    ecwidOrder.paymentStatus = 'INCOMPLETE'
    ecwidOrder.fulfillmentStatus = 'AWAITING_PROCESSING'
    
    // Add failure reason to internal notes
    if (failedOrderData.errorMessage) {
      ecwidOrder.privateAdminNotes = `⚠️ PAYMENT FAILED\nReason: ${failedOrderData.errorMessage}\nTime: ${new Date().toISOString()}`
    }

    const response = await fetch(
      `https://app.ecwid.com/api/v3/${ECWID_STORE_ID}/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ECWID_SECRET_TOKEN}`,
        },
        body: JSON.stringify(ecwidOrder)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Ecwid API error (failed payment):', errorText)
      throw new Error(`Ecwid API returned ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Failed payment recorded in Ecwid:', result)

    return {
      success: true,
      ecwidOrderId: result.id
    }

  } catch (error) {
    console.error('❌ Failed to record failed payment in Ecwid:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Update order status in Ecwid
 * Use this to update order status, tracking info, etc.
 * 
 * @param {number} ecwidOrderId - The Ecwid order ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>}
 */
export async function updateEcwidOrder(ecwidOrderId, updates) {
  try {
    if (!ECWID_STORE_ID || !ECWID_SECRET_TOKEN) {
      console.warn('⚠️ Ecwid credentials not configured.')
      return { success: false, error: 'Missing Ecwid credentials' }
    }

    const response = await fetch(
      `https://app.ecwid.com/api/v3/${ECWID_STORE_ID}/orders/${ecwidOrderId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ECWID_SECRET_TOKEN}`,
        },
        body: JSON.stringify(updates)
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update Ecwid order: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Ecwid order updated:', result)

    return { success: true, result }

  } catch (error) {
    console.error('❌ Failed to update Ecwid order:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Transform your order format to Ecwid's API format
 * 
 * @param {Object} orderData - Your order data
 * @returns {Object} Ecwid formatted order
 */
function transformToEcwidFormat(orderData) {
  const {
    orderId,
    paymentId,
    items = [],
    totals = {},
    shippingAddress = {},
    deliveryInfo = {},
    paymentMethod = 'razorpay',
    userId = null,
    couponCode = null,
    errorMessage = null
  } = orderData

  // Transform items to Ecwid format
  const ecwidItems = items.map((item, index) => ({
    price: parseFloat(item.price) || 0,
    productId: parseInt(item.id) || index + 1000, // Use item ID or generate one
    quantity: parseInt(item.quantity) || 1,
    name: item.name || 'Product',
    sku: item.sku || `SKU-${item.id}`,
    weight: item.weight || 0,
    // Add product options like size
    selectedOptions: item.size ? [
      {
        name: 'Size',
        value: item.size,
        type: 'CHOICE'
      }
    ] : []
  }))

  // Calculate totals
  const subtotal = parseFloat(totals.subtotal) || 0
  const shipping = parseFloat(totals.delivery) || 0
  const discount = parseFloat(totals.couponDiscount) || 0
  const total = parseFloat(totals.total) || (subtotal + shipping - discount)

  // Build Ecwid order object
  const ecwidOrder = {
    // Order identification
    externalTransactionId: orderId || `order_${Date.now()}`,
    
    // Payment info
    paymentMethod: paymentMethod === 'razorpay' ? 'Razorpay' : paymentMethod,
    paymentStatus: errorMessage ? 'INCOMPLETE' : 'PAID',
    paymentReference: paymentId || null,
    
    // Customer info
    email: shippingAddress.email || 'noemail@example.com',
    
    // Items
    items: ecwidItems,
    
    // Pricing
    subtotal: subtotal,
    total: total,
    
    // Shipping
    shippingOption: {
      shippingMethodName: deliveryInfo?.deliveryMethod || 'Standard Shipping',
      shippingRate: shipping
    },
    
    // Billing address
    billingPerson: {
      name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Customer',
      companyName: '',
      street: shippingAddress.address || '',
      city: shippingAddress.city || '',
      countryCode: 'IN',
      postalCode: shippingAddress.pincode || '',
      stateOrProvinceCode: shippingAddress.state || '',
      phone: shippingAddress.phone || ''
    },
    
    // Shipping address (same as billing for now)
    shippingPerson: {
      name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Customer',
      companyName: '',
      street: shippingAddress.address || '',
      city: shippingAddress.city || '',
      countryCode: 'IN',
      postalCode: shippingAddress.pincode || '',
      stateOrProvinceCode: shippingAddress.state || '',
      phone: shippingAddress.phone || ''
    },
    
    // Fulfillment status
    fulfillmentStatus: 'AWAITING_PROCESSING',
    
    // Additional info
    customerGroup: userId ? 'Registered' : 'Guest',
    
    // Custom fields / notes
    privateAdminNotes: buildAdminNotes(orderData),
    orderComments: shippingAddress.notes || '',
    
    // Discount info
    ...(couponCode ? {
      couponDiscount: discount,
      discountCoupon: {
        name: couponCode,
        code: couponCode
      }
    } : {})
  }

  return ecwidOrder
}

/**
 * Build admin notes for the order
 */
function buildAdminNotes(orderData) {
  const notes = []
  
  notes.push(`Source: Custom Website`)
  notes.push(`Order ID: ${orderData.orderId}`)
  
  if (orderData.paymentId) {
    notes.push(`Payment ID: ${orderData.paymentId}`)
  }
  
  if (orderData.userId) {
    notes.push(`User ID: ${orderData.userId}`)
  }
  
  if (orderData.couponCode) {
    notes.push(`Coupon Used: ${orderData.couponCode}`)
  }
  
  if (orderData.errorMessage) {
    notes.push(`\n⚠️ PAYMENT FAILED`)
    notes.push(`Error: ${orderData.errorMessage}`)
  }
  
  notes.push(`\nCreated: ${new Date().toISOString()}`)
  
  return notes.join('\n')
}

/**
 * Get order from Ecwid by external transaction ID (your order ID)
 * Useful for checking if order already exists
 */
export async function getEcwidOrderByExternalId(externalId) {
  try {
    if (!ECWID_STORE_ID || !ECWID_SECRET_TOKEN) {
      return { success: false, error: 'Missing Ecwid credentials' }
    }

    const response = await fetch(
      `https://app.ecwid.com/api/v3/${ECWID_STORE_ID}/orders?externalTransactionId=${externalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ECWID_SECRET_TOKEN}`,
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch Ecwid order: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.total > 0 && result.items && result.items.length > 0) {
      return { success: true, order: result.items[0] }
    }

    return { success: false, error: 'Order not found' }

  } catch (error) {
    console.error('❌ Failed to fetch Ecwid order:', error)
    return { success: false, error: error.message }
  }
}

