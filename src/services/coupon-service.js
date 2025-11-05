import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ==================== COUPON MANAGEMENT ====================

export async function createCoupon(couponData) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('coupons')
      .insert({
        code: couponData.code.toUpperCase(),
        discount_type: couponData.discountType, // 'percentage' or 'fixed'
        discount_value: Number(couponData.discountValue),
        start_date: couponData.startDate,
        end_date: couponData.endDate,
        is_active: couponData.isActive ?? true,
        usage_type: couponData.usageType, // 'first_time_only', 'one_time_per_user', 'unlimited'
        max_uses: couponData.maxUses || null,
        current_uses: 0,
        min_order_amount: couponData.minOrderAmount || 0,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error
    return { data: data?.[0] || null, error: null }
  } catch (error) {
    console.error('Error creating coupon:', error)
    return { data: null, error: error.message }
  }
}

export async function updateCoupon(couponId, updates) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    if (updates.code) {
      updateData.code = updates.code.toUpperCase()
    }

    const { data, error } = await supabase
      .from('coupons')
      .update(updateData)
      .eq('id', couponId)
      .select()

    if (error) throw error
    return { data: data?.[0] || null, error: null }
  } catch (error) {
    console.error('Error updating coupon:', error)
    return { data: null, error: error.message }
  }
}

export async function deleteCoupon(couponId) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', couponId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return { error: error.message }
  }
}

export async function getAllCoupons() {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return { data: [], error: error.message }
  }
}

export async function toggleCouponStatus(couponId, isActive) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('coupons')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', couponId)
      .select()

    if (error) throw error
    return { data: data?.[0] || null, error: null }
  } catch (error) {
    console.error('Error toggling coupon status:', error)
    return { data: null, error: error.message }
  }
}

// ==================== COUPON VALIDATION ====================

export async function validateCoupon(code, userId = null, userEmail = null, cartTotal = 0) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    // Fetch coupon by code
    const { data: coupon, error: fetchError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (fetchError || !coupon) {
      return { valid: false, error: 'Invalid coupon code', coupon: null }
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return { valid: false, error: 'This coupon is not active', coupon: null }
    }

    // Check validity dates
    const now = new Date()
    const startDate = new Date(coupon.start_date)
    const endDate = new Date(coupon.end_date)

    if (now < startDate) {
      return { valid: false, error: 'This coupon is not yet valid', coupon: null }
    }

    if (now > endDate) {
      return { valid: false, error: 'This coupon has expired', coupon: null }
    }

    // Check minimum order amount
    if (coupon.min_order_amount && cartTotal < coupon.min_order_amount) {
      return { 
        valid: false, 
        error: `Minimum order amount of ₹${coupon.min_order_amount} required`, 
        coupon: null 
      }
    }

    // Check max uses
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return { valid: false, error: 'This coupon has reached its usage limit', coupon: null }
    }

    // Check usage restrictions
    if (coupon.usage_type === 'first_time_only') {
      // Check if user has any previous orders
      const hasPreviousOrders = await checkUserHasPreviousOrders(userId, userEmail)
      if (hasPreviousOrders) {
        return { valid: false, error: 'This coupon is only for first-time customers', coupon: null }
      }
    }

    if (coupon.usage_type === 'one_time_per_user') {
      // Check if user has already used this coupon
      const hasUsedCoupon = await checkUserHasUsedCoupon(coupon.id, userId, userEmail)
      if (hasUsedCoupon) {
        return { valid: false, error: 'You have already used this coupon', coupon: null }
      }
    }

    return { valid: true, error: null, coupon }
  } catch (error) {
    console.error('Error validating coupon:', error)
    return { valid: false, error: error.message, coupon: null }
  }
}

async function checkUserHasPreviousOrders(userId, userEmail) {
  try {
    let query = supabase.from('orders').select('id', { count: 'exact', head: true })

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (userEmail) {
      query = query.contains('shipping_address', { email: userEmail })
    } else {
      return false
    }

    const { count, error } = await query

    if (error) throw error
    return count > 0
  } catch (error) {
    console.error('Error checking previous orders:', error)
    return false
  }
}

async function checkUserHasUsedCoupon(couponId, userId, userEmail) {
  try {
    let query = supabase.from('coupon_usage').select('id', { count: 'exact', head: true }).eq('coupon_id', couponId)

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (userEmail) {
      query = query.eq('user_email', userEmail)
    } else {
      return false
    }

    const { count, error } = await query

    if (error) throw error
    return count > 0
  } catch (error) {
    console.error('Error checking coupon usage:', error)
    return false
  }
}

// ==================== COUPON USAGE TRACKING ====================

export async function recordCouponUsage(couponId, userId, userEmail, orderId, discountApplied) {
  try {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase not configured' }
    }

    // Record usage
    const { error: usageError } = await supabase
      .from('coupon_usage')
      .insert({
        coupon_id: couponId,
        user_id: userId || null,
        user_email: userEmail || null,
        order_id: orderId,
        discount_applied: discountApplied,
        used_at: new Date().toISOString()
      })

    if (usageError) throw usageError

    // Increment current uses
    const { error: updateError } = await supabase.rpc('increment_coupon_usage', { coupon_id: couponId })

    if (updateError) {
      // Fallback: manual increment
      const { data: coupon } = await supabase.from('coupons').select('current_uses').eq('id', couponId).single()
      if (coupon) {
        await supabase.from('coupons').update({ current_uses: (coupon.current_uses || 0) + 1 }).eq('id', couponId)
      }
    }

    return { error: null }
  } catch (error) {
    console.error('Error recording coupon usage:', error)
    return { error: error.message }
  }
}

export async function getCouponUsageList(couponId) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase
      .from('coupon_usage')
      .select('*')
      .eq('coupon_id', couponId)
      .order('used_at', { ascending: false })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching coupon usage:', error)
    return { data: [], error: error.message }
  }
}

// ==================== DISCOUNT CALCULATION ====================

export function calculateDiscount(coupon, cartTotal) {
  if (!coupon) return 0

  if (coupon.discount_type === 'percentage') {
    const discount = (cartTotal * coupon.discount_value) / 100
    return Math.min(discount, cartTotal) // Don't exceed cart total
  } else {
    // Fixed amount
    return Math.min(coupon.discount_value, cartTotal) // Don't exceed cart total
  }
}

