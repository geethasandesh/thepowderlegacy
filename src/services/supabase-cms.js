import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ==================== PRODUCTS ====================

export async function saveProductsToSupabase(products) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - saving to localStorage only')
      localStorage.setItem('products_data', JSON.stringify(products))
      localStorage.setItem('admin_products', JSON.stringify(products))
      return { success: true, localOnly: true }
    }

    const { data, error } = await supabase
      .from('cms_content')
      .upsert({
        id: 'products',
        content_type: 'products',
        data: products,
        last_updated: new Date().toISOString(),
        updated_by: 'admin'
      })

    if (error) throw error

    // Also cache in localStorage for performance
    localStorage.setItem('products_data', JSON.stringify(products))
    localStorage.setItem('admin_products', JSON.stringify(products))

    console.log('✅ Products saved to Supabase')
    return { success: true }
  } catch (error) {
    console.error('❌ Error saving products to Supabase:', error)
    
    // Fallback to localStorage
    localStorage.setItem('products_data', JSON.stringify(products))
    localStorage.setItem('admin_products', JSON.stringify(products))
    
    return { success: false, error: error.message, localOnly: true }
  }
}

export async function loadProductsFromSupabase() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - using localStorage/default data')
      const cached = localStorage.getItem('products_data')
      return cached ? JSON.parse(cached) : []
    }

    const { data, error } = await supabase
      .from('cms_content')
      .select('data')
      .eq('id', 'products')
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found

    if (data && data.data) {
      const products = data.data

      // Cache in localStorage
      localStorage.setItem('products_data', JSON.stringify(products))
      localStorage.setItem('admin_products', JSON.stringify(products))

      console.log('✅ Products loaded from Supabase:', products.length)
      return products
    } else {
      console.log('ℹ️ No products found in Supabase')
      return []
    }
  } catch (error) {
    console.error('❌ Error loading products from Supabase:', error)

    // Fallback to localStorage
    const cached = localStorage.getItem('products_data')
    return cached ? JSON.parse(cached) : []
  }
}

// ==================== HOME CONTENT ====================

export async function saveHomeContentToSupabase(content) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - saving to localStorage only')
      localStorage.setItem('home_content', JSON.stringify(content))
      localStorage.setItem('admin_home_content', JSON.stringify(content))
      return { success: true, localOnly: true }
    }

    const { data, error } = await supabase
      .from('cms_content')
      .upsert({
        id: 'home_content',
        content_type: 'home',
        data: content,
        last_updated: new Date().toISOString(),
        updated_by: 'admin'
      })

    if (error) throw error

    // Cache in localStorage
    localStorage.setItem('home_content', JSON.stringify(content))
    localStorage.setItem('admin_home_content', JSON.stringify(content))

    console.log('✅ Home content saved to Supabase')
    return { success: true }
  } catch (error) {
    console.error('❌ Error saving home content to Supabase:', error)
    
    // Fallback to localStorage
    localStorage.setItem('home_content', JSON.stringify(content))
    localStorage.setItem('admin_home_content', JSON.stringify(content))
    
    return { success: false, error: error.message, localOnly: true }
  }
}

export async function loadHomeContentFromSupabase() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - using localStorage only')
      const cached = localStorage.getItem('home_content')
      return cached ? JSON.parse(cached) : null
    }

    const { data, error } = await supabase
      .from('cms_content')
      .select('data')
      .eq('id', 'home_content')
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data && data.data) {
      const content = data.data

      // Cache in localStorage
      localStorage.setItem('home_content', JSON.stringify(content))
      localStorage.setItem('admin_home_content', JSON.stringify(content))

      console.log('✅ Home content loaded from Supabase')
      return content
    } else {
      console.log('ℹ️ No home content found in Supabase')
      return null
    }
  } catch (error) {
    console.error('❌ Error loading home content from Supabase:', error)

    // Fallback to localStorage
    const cached = localStorage.getItem('home_content')
    return cached ? JSON.parse(cached) : null
  }
}

// ==================== HEADER CONTENT ====================

export async function saveHeaderContentToSupabase(content) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - saving to localStorage only')
      localStorage.setItem('header_content', JSON.stringify(content))
      localStorage.setItem('admin_header_content', JSON.stringify(content))
      return { success: true, localOnly: true }
    }

    const { data, error } = await supabase
      .from('cms_content')
      .upsert({
        id: 'header_content',
        content_type: 'header',
        data: content,
        last_updated: new Date().toISOString(),
        updated_by: 'admin'
      })

    if (error) throw error

    // Cache in localStorage
    localStorage.setItem('header_content', JSON.stringify(content))
    localStorage.setItem('admin_header_content', JSON.stringify(content))

    console.log('✅ Header content saved to Supabase')
    return { success: true }
  } catch (error) {
    console.error('❌ Error saving header content to Supabase:', error)
    
    // Fallback to localStorage
    localStorage.setItem('header_content', JSON.stringify(content))
    localStorage.setItem('admin_header_content', JSON.stringify(content))
    
    return { success: false, error: error.message, localOnly: true }
  }
}

export async function loadHeaderContentFromSupabase() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - using localStorage only')
      const cached = localStorage.getItem('header_content')
      return cached ? JSON.parse(cached) : null
    }

    const { data, error } = await supabase
      .from('cms_content')
      .select('data')
      .eq('id', 'header_content')
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data && data.data) {
      const content = data.data

      // Cache in localStorage
      localStorage.setItem('header_content', JSON.stringify(content))
      localStorage.setItem('admin_header_content', JSON.stringify(content))

      console.log('✅ Header content loaded from Supabase')
      return content
    } else {
      console.log('ℹ️ No header content found in Supabase')
      return null
    }
  } catch (error) {
    console.error('❌ Error loading header content from Supabase:', error)

    // Fallback to localStorage
    const cached = localStorage.getItem('header_content')
    return cached ? JSON.parse(cached) : null
  }
}

// ==================== INITIALIZE CMS ====================

export async function initializeCMS() {
  try {
    console.log('🔄 Initializing CMS from Supabase...')

    // Load all CMS content
    const products = await loadProductsFromSupabase()
    const homeContent = await loadHomeContentFromSupabase()
    const headerContent = await loadHeaderContentFromSupabase()

    return {
      success: true,
      products,
      homeContent,
      headerContent
    }
  } catch (error) {
    console.error('❌ Error initializing CMS:', error)
    return { success: false, error: error.message }
  }
}

// ==================== SYNC CHECK ====================

export async function checkCMSSync() {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('id, content_type, last_updated')
      .in('id', ['products', 'home_content', 'header_content'])

    if (error) throw error

    const result = {
      products: { exists: false, lastUpdated: null },
      homeContent: { exists: false, lastUpdated: null },
      headerContent: { exists: false, lastUpdated: null }
    }

    data?.forEach(item => {
      if (item.id === 'products') {
        result.products = { exists: true, lastUpdated: item.last_updated }
      } else if (item.id === 'home_content') {
        result.homeContent = { exists: true, lastUpdated: item.last_updated }
      } else if (item.id === 'header_content') {
        result.headerContent = { exists: true, lastUpdated: item.last_updated }
      }
    })

    return result
  } catch (error) {
    console.error('❌ Error checking CMS sync:', error)
    return null
  }
}

