import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsData } from '../../data/products'

function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('favorites') || '[]')
      setFavoriteIds(ids)
      const items = productsData.filter(p => ids.includes(p.id))
      setFavorites(items)
    } catch {}
  }, [])

  const removeFavorite = (id) => {
    const next = favoriteIds.filter(fid => fid !== id)
    localStorage.setItem('favorites', JSON.stringify(next))
    setFavoriteIds(next)
    setFavorites(productsData.filter(p => next.includes(p.id)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-slate-600">No items in favorites yet.</p>
            <Link to="/shop" className="mt-4 inline-block text-emerald-700 font-semibold">Browse products →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(product => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-emerald-100 hover:shadow-lg transition-shadow">
                <Link to={`/shop/product/${product.id}`} className="block aspect-square bg-emerald-50 overflow-hidden">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/shop/product/${product.id}`} className="font-semibold text-slate-900 hover:text-emerald-700">
                    {product.name}
                  </Link>
                  <div className="mt-3 flex items-center gap-3">
                    <Link to={`/shop/product/${product.id}`} className="flex-1 text-center border-2 border-gray-300 rounded-full py-2 hover:border-emerald-600 hover:text-emerald-700 font-semibold">View</Link>
                    <button onClick={() => removeFavorite(product.id)} className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">Remove</button>
                  </div>
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


