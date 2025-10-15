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

    const { data, error } = await supabase
      .from('orders')
      .insert(sanitizedOrder)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Order saved to Supabase')
    return data
  } catch (error) {
    console.error('❌ Error saving order:', error)
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

