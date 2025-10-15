import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

// ==================== PRODUCTS ====================

export async function saveProductsToFirestore(products) {
  try {
    const productsRef = doc(db, 'cms', 'products')
    await setDoc(productsRef, {
      data: products,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    })
    
    // Also cache in localStorage for performance
    localStorage.setItem('products_data', JSON.stringify(products))
    localStorage.setItem('admin_products', JSON.stringify(products))
    
    console.log('✅ Products saved to Firestore')
    return { success: true }
  } catch (error) {
    console.error('❌ Error saving products to Firestore:', error)
    return { success: false, error: error.message }
  }
}

export async function loadProductsFromFirestore() {
  try {
    const productsRef = doc(db, 'cms', 'products')
    const docSnap = await getDoc(productsRef)
    
    if (docSnap.exists()) {
      const products = docSnap.data().data || []
      
      // Cache in localStorage
      localStorage.setItem('products_data', JSON.stringify(products))
      localStorage.setItem('admin_products', JSON.stringify(products))
      
      console.log('✅ Products loaded from Firestore:', products.length)
      return products
    } else {
      console.log('ℹ️ No products found in Firestore')
      return []
    }
  } catch (error) {
    console.error('❌ Error loading products from Firestore:', error)
    
    // Fallback to localStorage
    const cached = localStorage.getItem('products_data')
    return cached ? JSON.parse(cached) : []
  }
}

// ==================== HOME CONTENT ====================

export async function saveHomeContentToFirestore(content) {
  try {
    const contentRef = doc(db, 'cms', 'homeContent')
    await setDoc(contentRef, {
      data: content,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    })
    
    // Cache in localStorage
    localStorage.setItem('home_content', JSON.stringify(content))
    localStorage.setItem('admin_home_content', JSON.stringify(content))
    
    console.log('✅ Home content saved to Firestore')
    return { success: true }
  } catch (error) {
    console.error('❌ Error saving home content to Firestore:', error)
    return { success: false, error: error.message }
  }
}

export async function loadHomeContentFromFirestore() {
  try {
    const contentRef = doc(db, 'cms', 'homeContent')
    const docSnap = await getDoc(contentRef)
    
    if (docSnap.exists()) {
      const content = docSnap.data().data
      
      // Cache in localStorage
      localStorage.setItem('home_content', JSON.stringify(content))
      localStorage.setItem('admin_home_content', JSON.stringify(content))
      
      console.log('✅ Home content loaded from Firestore')
      return content
    } else {
      console.log('ℹ️ No home content found in Firestore')
      return null
    }
  } catch (error) {
    console.error('❌ Error loading home content from Firestore:', error)
    
    // Fallback to localStorage
    const cached = localStorage.getItem('home_content')
    return cached ? JSON.parse(cached) : null
  }
}

// ==================== HEADER CONTENT ====================

export async function saveHeaderContentToFirestore(content) {
  try {
    const contentRef = doc(db, 'cms', 'headerContent')
    await setDoc(contentRef, {
      data: content,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin'
    })
    
    // Cache in localStorage
    localStorage.setItem('header_content', JSON.stringify(content))
    localStorage.setItem('admin_header_content', JSON.stringify(content))
    
    console.log('✅ Header content saved to Firestore')
    return { success: true }
  } catch (error) {
    console.error('❌ Error saving header content to Firestore:', error)
    return { success: false, error: error.message }
  }
}

export async function loadHeaderContentFromFirestore() {
  try {
    const contentRef = doc(db, 'cms', 'headerContent')
    const docSnap = await getDoc(contentRef)
    
    if (docSnap.exists()) {
      const content = docSnap.data().data
      
      // Cache in localStorage
      localStorage.setItem('header_content', JSON.stringify(content))
      localStorage.setItem('admin_header_content', JSON.stringify(content))
      
      console.log('✅ Header content loaded from Firestore')
      return content
    } else {
      console.log('ℹ️ No header content found in Firestore')
      return null
    }
  } catch (error) {
    console.error('❌ Error loading header content from Firestore:', error)
    
    // Fallback to localStorage
    const cached = localStorage.getItem('header_content')
    return cached ? JSON.parse(cached) : null
  }
}

// ==================== INITIALIZE CMS ====================

export async function initializeCMS() {
  try {
    console.log('🔄 Initializing CMS from Firestore...')
    
    // Load all CMS content
    const products = await loadProductsFromFirestore()
    const homeContent = await loadHomeContentFromFirestore()
    const headerContent = await loadHeaderContentFromFirestore()
    
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
    const productsRef = doc(db, 'cms', 'products')
    const homeRef = doc(db, 'cms', 'homeContent')
    const headerRef = doc(db, 'cms', 'headerContent')
    
    const [productsSnap, homeSnap, headerSnap] = await Promise.all([
      getDoc(productsRef),
      getDoc(homeRef),
      getDoc(headerRef)
    ])
    
    return {
      products: {
        exists: productsSnap.exists(),
        lastUpdated: productsSnap.exists() ? productsSnap.data().lastUpdated : null
      },
      homeContent: {
        exists: homeSnap.exists(),
        lastUpdated: homeSnap.exists() ? homeSnap.data().lastUpdated : null
      },
      headerContent: {
        exists: headerSnap.exists(),
        lastUpdated: headerSnap.exists() ? headerSnap.data().lastUpdated : null
      }
    }
  } catch (error) {
    console.error('❌ Error checking CMS sync:', error)
    return null
  }
}

