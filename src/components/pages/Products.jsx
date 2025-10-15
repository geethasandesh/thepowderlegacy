import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Filter, Grid, List, Star, ShoppingCart, Heart, Leaf } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { fetchProducts } from '../../services/products'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

function Products() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProductSizes, setSelectedProductSizes] = useState({})
  const [sortBy, setSortBy] = useState('admin-order')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]')
    } catch {
      return []
    }
  })

  const categories = [
    { value: 'all', label: 'All Products', icon: '🌿' },
    { value: 'skin-care', label: 'Skin Care', icon: '✨' },
    { value: 'hair-care', label: 'Hair Care', icon: '💆' },
    { value: 'oral-care', label: 'Oral Care', icon: '😊' }
  ]

  useEffect(() => {
    let cancelled = false
    async function load() {
      // Force refresh to get latest product order from admin
      const list = await fetchProducts({ forceRefresh: true })
      if (!cancelled) {
        setProducts(list)
        setFilteredProducts(list)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const q = query.get('q') || ''
    if (q) setSearchQuery(q)
  }, [query])

  useEffect(() => {
    let filtered = [...products]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchQuery) {
      const key = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(key) ||
        product.description?.toLowerCase().includes(key) ||
        product.ingredients?.toLowerCase().includes(key) ||
        product.category?.replace('-', ' ').toLowerCase().includes(key)
      )
    }

    // Only sort if not using admin-set order
    if (sortBy !== 'admin-order') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.sizes?.[0]?.price || 0) - (b.sizes?.[0]?.price || 0)
          case 'price-high':
            return (b.sizes?.[0]?.price || 0) - (a.sizes?.[0]?.price || 0)
          case 'rating':
            return (b.rating || 0) - (a.rating || 0)
          case 'reviews':
            return (b.reviews || 0) - (a.reviews || 0)
          case 'name':
            return (a.name || '').localeCompare(b.name || '')
          default:
            // Keep admin-set order
            return 0
        }
      })
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, sortBy, searchQuery, products])

  const getCategoryFromPath = () => {
    const path = location.pathname
    if (path.includes('skin-care')) return 'skin-care'
    if (path.includes('hair-care')) return 'hair-care'
    if (path.includes('oral-care')) return 'oral-care'
    return 'all'
  }

  useEffect(() => {
    const categoryFromPath = getCategoryFromPath()
    if (categoryFromPath !== 'all') setSelectedCategory(categoryFromPath)
  }, [location.pathname])

  const handleAddToCart = (product) => {
    const selectedSize = selectedProductSizes[product.id] || product.sizes?.[0]?.size
    const sizeObj = product.sizes?.find(size => size.size === selectedSize)
    if (sizeObj) addToCart(product, sizeObj, 1)
  }

  const handleSizeSelect = (productId, size) => {
    setSelectedProductSizes(prev => ({ ...prev, [productId]: size }))
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const exists = prev.includes(productId)
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  const currentCategory = categories.find(cat => cat.value === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10">
        {/* Category Pills - Compact Mobile Layout */}
        <div className="mb-3 sm:mb-6">
          {/* Mobile: Horizontal scrollable dots */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300
                  ${selectedCategory === category.value
                    ? 'bg-[#2d5f3f] text-white shadow-lg scale-110'
                    : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm border border-stone-200'
                  }
                `}
                title={category.label}
              >
                {category.icon}
              </button>
            ))}
          </div>
          
          {/* Desktop: Full category buttons */}
          <div className="hidden md:flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2
                  ${selectedCategory === category.value
                    ? 'bg-[#2d5f3f] text-white shadow-lg scale-105'
                    : 'bg-white text-stone-700 hover:bg-stone-100 shadow-md'
                  }
                `}
              >
                <span className="text-base sm:text-lg">{category.icon}</span>
                <span className="whitespace-nowrap">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-4 sm:mb-6">
          {/* Mobile: Single row with minimal elements */}
          <div className="flex md:hidden items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-2 py-1.5 bg-stone-100 rounded-md font-medium text-xs"
              >
                <Filter size={14} />
                Filter
              </button>
              <span className="text-xs text-stone-500">{filteredProducts.length}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#2d5f3f] text-white'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#2d5f3f] text-white'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Desktop: Full filter bar */}
          <div className="hidden md:flex flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-stone-600">
                <span className="font-medium text-sm lg:text-base">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm lg:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                  >
                    <option value="admin-order">🎁 Featured Order</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-stone-600 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#2d5f3f] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#2d5f3f] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="md:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-stone-200">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                  >
                    <option value="admin-order">🎁 Featured Order</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-stone-400 mb-4">
              <Leaf size={48} className="sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-stone-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="btn-primary text-sm sm:text-base"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4'
              : 'space-y-3'
          }>
          {filteredProducts.map((product) => {
              const selectedSize = selectedProductSizes[product.id] || product.sizes?.[0]?.size
              const sizeObj = product.sizes?.find(size => size.size === selectedSize) || product.sizes?.[0]

              if (viewMode === 'list') {
                // List View
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <Link to={`/shop/product/${product.id}`} className="sm:w-48 h-48 sm:h-auto flex-shrink-0 relative bg-gradient-to-br from-stone-50 to-stone-100">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Leaf size={48} />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <Link to={`/shop/product/${product.id}`}>
                            <h3 className="text-xl font-bold text-stone-900 mb-2 hover:text-[#2d5f3f] transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-stone-600 mb-4 line-clamp-2">{product.description}</p>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className={i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-current' : 'text-stone-300'} />
                              ))}
                            </div>
                            <span className="text-sm text-stone-500">({product.reviews || 0} reviews)</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {product.type !== 'bundle' && (
                            <div className="flex items-center gap-4">
                              <div className="text-3xl font-bold text-[#2d5f3f]">₹{sizeObj?.price || 0}</div>
                              <select
                                value={selectedSize}
                                onChange={(e) => handleSizeSelect(product.id, e.target.value)}
                                className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                              >
                                {product.sizes?.map(size => (
                                  <option key={size.size} value={size.size}>{size.size}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleFavorite(product.id)}
                              className={`p-3 rounded-lg transition-all hover:scale-110 ${
                                favorites.includes(product.id)
                                  ? 'bg-red-50 text-red-500'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              <Heart size={20} className={favorites.includes(product.id) ? 'fill-current' : ''} />
                            </button>
                            {product.type === 'bundle' ? (
                              <Link
                                to={`/bundle/${product.id}`}
                                className="btn-primary px-6 py-3 flex items-center gap-2"
                              >
                                <span className="text-lg">🎁</span>
                                Customize Hamper
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="btn-primary px-6 py-3 flex items-center gap-2"
                              >
                                <ShoppingCart size={18} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              // Grid View - Mobile Optimized (Zepto/Blinkit Style)
              return (
                <div key={product.id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col">
                  <Link to={product.type === 'bundle' ? `/bundle/${product.id}` : `/shop/product/${product.id}`} className="block relative">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Leaf size={20} />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(product.id)
                      }}
                      className={`absolute top-1 right-1 w-5 h-5 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-sm flex items-center justify-center transition-all ${
                        favorites.includes(product.id) ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <Heart size={10} className={favorites.includes(product.id) ? 'fill-current' : ''} />
                    </button>
                  </Link>

                  <div className="p-2 flex flex-col flex-1">
                    <Link to={product.type === 'bundle' ? `/bundle/${product.id}` : `/shop/product/${product.id}`} className="flex-1">
                      <h3 className="font-medium text-[3px] text-gray-900 mb-1 group-hover:text-[#2d5f3f] transition-colors line-clamp-1 leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={8} className={`${i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-[8px] text-gray-500">({product.reviews || 0})</span>
                    </div>

                    {product.type !== 'bundle' && (
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="text-[11px] font-bold text-[#2d5f3f]">₹{sizeObj?.price || 0}</div>
                        <select
                          value={selectedSize}
                          onChange={(e) => handleSizeSelect(product.id, e.target.value)}
                          className="text-[8px] border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#2d5f3f] bg-white min-w-0"
                        >
                          {product.sizes?.map(size => (
                            <option key={size.size} value={size.size}>{size.size}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {product.type === 'bundle' ? (
                      <Link
                        to={`/bundle/${product.id}`}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-1.5 px-2 rounded-md font-medium text-[10px] flex items-center justify-center gap-1 transition-all shadow-sm"
                      >
                        <span className="text-[10px]">🎁</span>
                        <span>Customize</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-[#2d5f3f] hover:bg-[#1e4029] text-white py-1.5 px-2 rounded-md font-medium text-[10px] flex items-center justify-center gap-1 transition-all shadow-sm"
                      >
                        <ShoppingCart size={10} />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              )
          })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
