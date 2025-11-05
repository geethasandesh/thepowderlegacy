import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ==================== CONTACTS ====================

export async function saveContactMessage(message) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: message.name,
        email: message.email,
        phone: message.phone,
        subject: message.subject,
        message: message.message,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    console.log('✅ Contact message saved to Supabase')
    return data
  } catch (error) {
    console.error('❌ Error saving contact message:', error)
    throw error
  }
}

// ==================== ORDERS ====================

export async function saveOrder(order) {
  try {
    // Sanitize order data for Supabase
    // Only include fields that exist in Supabase schema
    const sanitizedOrder = {
      order_id: String(order.orderId || ''),
      payment_id: String(order.paymentId || ''),
      payment_method: String(order.paymentMethod || ''),
      items: order.items || [],
      totals: order.totals || {},
      delivery_info: order.deliveryInfo || null,
      shipping_address: order.shippingAddress || null,
      user_id: order.userId || null,
      created_at: new Date().toISOString()
    }

    // Only add these fields if they exist (they might not be in the schema yet)
    // If Supabase table doesn't have these columns, they'll be ignored
    if (order.ecwidOrderId !== undefined) {
      sanitizedOrder.ecwid_order_id = order.ecwidOrderId
    }
    if (order.fulfillmentStatus !== undefined) {
      sanitizedOrder.fulfillment_status = order.fulfillmentStatus || 'AWAITING_PROCESSING'
    }

    console.log('💾 Saving order to Supabase:', sanitizedOrder.order_id)
    const { data, error } = await supabase
      .from('orders')
      .insert(sanitizedOrder)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error details:', error)
      // If error is about missing columns, try without them
      if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('does not exist')) {
        console.log('⚠️ Retrying without optional columns...')
        const { ecwid_order_id, fulfillment_status, ...basicOrder } = sanitizedOrder
        const { data: retryData, error: retryError } = await supabase
          .from('orders')
          .insert(basicOrder)
          .select()
          .single()
        
        if (retryError) throw retryError
        console.log('✅ Order saved to Supabase (without optional columns)')
        return retryData
      }
      throw error
    }

    console.log('✅ Order saved to Supabase successfully')
    return data
  } catch (error) {
    console.error('❌ Error saving order:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    throw error
  }
}

// ==================== USER CART ====================

export async function saveCartSnapshot(userId, items) {
  if (!userId) return null

  try {
    // Skip if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - cart will only save to localStorage')
      return null
    }

    const { data, error } = await supabase
      .from('user_carts')
      .upsert({
        user_id: userId,
        items: items,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('❌ Error saving cart:', error)
    return null
  }
}

export async function loadCartSnapshot(userId) {
  if (!userId) return null

  try {
    // Skip if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - using localStorage for cart')
      return []
    }

    const { data, error } = await supabase
      .from('user_carts')
      .select('items')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return data?.items || []
  } catch (error) {
    console.error('❌ Error loading cart:', error)
    return []
  }
}

// ==================== FAVORITES ====================

export async function saveFavorite(userId, productId) {
  if (!userId) return null

  try {
    // Skip if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - favorites only in localStorage')
      return null
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('❌ Error saving favorite:', error)
    return null
  }
}

export async function removeFavorite(userId, productId) {
  if (!userId) return null

  try {
    // Skip if Supabase not configured
    if (!isSupabaseConfigured()) {
      return true // Return success for localStorage-based favorites
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('❌ Error removing favorite:', error)
    return false
  }
}

export async function loadFavorites(userId) {
  if (!userId) return []

  try {
    // Skip if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - favorites only in localStorage')
      return []
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('product_id')
      .eq('user_id', userId)

    if (error) throw error

    return data?.map(f => f.product_id) || []
  } catch (error) {
    console.error('❌ Error loading favorites:', error)
    return []
  }
}

// ==================== GUEST ORDER LINKING ====================

export async function linkGuestOrdersToUser(userId, guestEmail) {
  if (!userId || !guestEmail) return { linked: 0, error: null }

  try {
    // Skip if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - cannot link guest orders')
      return { linked: 0, error: 'Supabase not configured' }
    }

    // Find all guest orders with the matching email
    const { data: guestOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id')
      .is('user_id', null)
      .contains('shipping_address', { email: guestEmail })

    if (fetchError) throw fetchError

    if (!guestOrders || guestOrders.length === 0) {
      return { linked: 0, error: null }
    }

    // Update all guest orders to link them to the user
    const orderIds = guestOrders.map(order => order.id)
    const { error: updateError } = await supabase
      .from('orders')
      .update({ user_id: userId })
      .in('id', orderIds)

    if (updateError) throw updateError

    console.log(`✅ Linked ${guestOrders.length} guest orders to user ${userId}`)
    return { linked: guestOrders.length, error: null }
  } catch (error) {
    console.error('❌ Error linking guest orders:', error)
    return { linked: 0, error: error.message }
  }
}

export async function getUserOrders(userId) {
  if (!userId) return []

  try {
    // Skip if Supabase not configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured')
      return []
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('❌ Error loading user orders:', error)
    return []
  }
}

