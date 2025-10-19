import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, X } from 'lucide-react'
import { productsData } from '../../data/products'
import { useFavorites } from '../../contexts/FavoritesContext'

function Favorites() {
  const { favoriteIds, removeFavorite, loading } = useFavorites()
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const items = productsData.filter(p => favoriteIds.includes(p.id))
    setFavorites(items)
  }, [favoriteIds])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600">Loading favorites...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-sm text-gray-600 mt-1">
              {favorites.length > 0 
                ? `${favorites.length} item${favorites.length !== 1 ? 's' : ''}`
                : 'No items saved'
              }
            </p>
          </div>
          {favorites.length > 0 && (
            <Link 
              to="/shop" 
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Browse More
            </Link>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-sm text-gray-600 mb-4">Save products you love!</p>
            <Link 
              to="/shop" 
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map(product => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                <Link to={`/shop/product/${product.id}`} className="block relative">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {product.images?.[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeFavorite(product.id)
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    aria-label="Remove"
                  >
                    <X size={14} className="text-red-500" />
                  </button>
                </Link>
                <div className="p-3">
                  <Link to={`/shop/product/${product.id}`}>
                    <h3 className="font-medium text-sm text-gray-900 hover:text-emerald-600 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.category?.replace('-', ' ')}</p>
                    <span className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                      View Details →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites


