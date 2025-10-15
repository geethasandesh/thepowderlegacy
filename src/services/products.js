import { productsData } from '../data/products'
import { loadProductsFromSupabase } from './supabase-cms'

export async function fetchProducts(filters = {}) {
  // filters: { category, size, search, limitCount }
  
  let products = []
  
  try {
    // Check localStorage cache first for performance
    const cachedProducts = localStorage.getItem('products_data')
    if (cachedProducts) {
      products = JSON.parse(cachedProducts)
      console.log('🔄 Using cached product data')
    } else {
      // Try to load from Supabase if not cached
      try {
        const supabaseProducts = await loadProductsFromSupabase()
        if (supabaseProducts && supabaseProducts.length > 0) {
          products = supabaseProducts
          console.log('🔄 Loaded product data from Supabase')
        } else {
          products = [...productsData]
          console.log('🔄 Using default product data (no data in Supabase)')
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase not available, using default data:', supabaseError.message)
        products = [...productsData]
      }
    }
  } catch (error) {
    console.error('❌ Error loading products, using default data:', error)
    products = [...productsData]
  }
  
  console.log('📦 Total products:', products.length)

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    products = products.filter(p => p.category === filters.category)
  }

  // Apply limit
  if (filters.limitCount) {
    products = products.slice(0, filters.limitCount)
  }

  // client search filter
  if (filters.search) {
    const key = String(filters.search).toLowerCase()
    products = products.filter(p =>
      p.name?.toLowerCase().includes(key) ||
      p.description?.toLowerCase().includes(key) ||
      p.ingredients?.toLowerCase().includes(key) ||
      p.category?.toLowerCase().includes(key)
    )
  }
  return products
}

export async function fetchProductById(id) {
  let products = []
  
  try {
    const cachedProducts = localStorage.getItem('products_data')
    if (cachedProducts) {
      products = JSON.parse(cachedProducts)
    } else {
      try {
        const supabaseProducts = await loadProductsFromSupabase()
        if (supabaseProducts && supabaseProducts.length > 0) {
          products = supabaseProducts
        } else {
          products = productsData
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase not available, using default data')
        products = productsData
      }
    }
  } catch (error) {
    console.error('❌ Error loading product, using default data:', error)
    products = productsData
  }
  
  console.log('🔄 Using product data for ID:', id)
  const product = products.find(p => p.id === parseInt(id) || p.id === String(id)) || null
  console.log('🔍 Found product:', product)
  return product
}

export async function fetchRelated(product, count = 4) {
  if (!product) return []
  const items = await fetchProducts({ category: product.category, limitCount: count + 1 })
  return items.filter(p => p.id !== product.id).slice(0, count)
}
