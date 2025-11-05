import React, { useState, useEffect } from 'react'
import { Check, Package, Gift } from 'lucide-react'
import { productsData } from '../../data/products'

function BundleSelector({ bundleProduct, onSelectionChange, onPriceChange }) {
  const [selectedProducts, setSelectedProducts] = useState([])
  const effectiveBasePrice = (typeof bundleProduct.basePrice === 'number'
    ? bundleProduct.basePrice
    : (bundleProduct?.sizes?.[0]?.price ?? 0))
  const [totalPrice, setTotalPrice] = useState(effectiveBasePrice)

  const bundleConfig = bundleProduct.bundleConfig || {}
  const minSelections = (bundleConfig.minSelections ?? 5)
  const maxSelections = (bundleConfig.maxSelections ?? 10)
  const defaultSize = bundleConfig.defaultSize || "50g"

  // Get available products for selection
  const selectableIds = (Array.isArray(bundleConfig.selectableProducts) && bundleConfig.selectableProducts.length > 0)
    ? bundleConfig.selectableProducts
    : productsData.filter(p => p.type !== 'bundle').map(p => p.id)
  let availableProducts = productsData.filter(p => selectableIds.includes(p.id))
  // Final fallback: if still empty, show all non-bundle products
  if (!availableProducts || availableProducts.length === 0) {
    availableProducts = productsData.filter(p => p.type !== 'bundle')
  }

  useEffect(() => {
    // Calculate total price
    let price = effectiveBasePrice
    
    selectedProducts.forEach(productId => {
      const product = productsData.find(p => p.id === productId)
      if (product) {
        const sizeVariant = product.sizes.find(s => s.size === defaultSize)
        if (sizeVariant) {
          price += sizeVariant.price
        }
      }
    })

    setTotalPrice(price)
    onPriceChange?.(price)
  }, [selectedProducts, effectiveBasePrice, defaultSize, onPriceChange])

  useEffect(() => {
    onSelectionChange?.(selectedProducts)
  }, [selectedProducts, onSelectionChange])

  const toggleProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        // Remove product
        return prev.filter(id => id !== productId)
      } else {
        // Add product if under max limit
        if (prev.length < maxSelections) {
          return [...prev, productId]
        }
        return prev
      }
    })
  }

  const isSelected = (productId) => selectedProducts.includes(productId)
  const canAddMore = selectedProducts.length < maxSelections
  const hasMinimum = selectedProducts.length >= minSelections

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Gift className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">Customize Your Diwali Hamper</h3>
            <p className="text-gray-700 mb-1 text-sm">
              Select at least <span className="font-semibold text-orange-600">{minSelections}</span> products to include in your hamper. Each product will be {defaultSize} size. Includes <span className="font-semibold text-orange-600">2 colorful diyas</span>.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-semibold ${hasMinimum ? 'text-green-600' : 'text-orange-600'}`}>
                {selectedProducts.length} selected (min {minSelections})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Included Items */}
      {bundleConfig.includedItems && bundleConfig.includedItems.length > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            Included in Your Hamper
          </h4>
          <ul className="space-y-2">
            {bundleConfig.includedItems.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold">{item.name}</span>
                  {item.description && (
                    <span className="text-sm text-gray-600"> - {item.description}</span>
                  )}
                </div>
              </li>
            ))}
            <li className="flex items-center gap-3 text-gray-700">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-semibold">Premium Gift Packaging</span>
                <span className="text-sm text-gray-600"> - Festive Diwali themed box</span>
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Product Selection */}
      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-base">
          {minSelections > 0 ? `Choose Your Products (Select ${minSelections}-${maxSelections})` : `Choose Your Products (Select up to ${maxSelections})`}
        </h4>
        <div className="max-h-[380px] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableProducts.length === 0 && (
            <div className="text-sm text-gray-600">No products available to choose. Please contact support.</div>
          )}
          {availableProducts.map(product => {
            const selected = isSelected(product.id)
            const sizeVariant = product.sizes.find(s => s.size === defaultSize) || { price: 0 }

            return (
              <div
                key={product.id}
                className={`relative border-2 rounded-lg p-3 transition-all cursor-pointer ${
                  selected
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                } ${!canAddMore && !selected ? 'opacity-50' : ''}`}
                onClick={() => toggleProduct(product.id)}
              >
                {/* Selected Badge */}
                {selected && (
                  <div className="absolute top-2 right-2 bg-orange-600 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 mb-0.5 truncate">
                      {product.name}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-semibold text-emerald-700">
                        {defaultSize}
                      </span>
                      {!canAddMore && !selected && (
                        <span className="text-[10px] text-orange-600 font-medium">
                          Max reached
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        </div>
      </div>

      {/* No pricing display for hamper selection per requirements */}
        {minSelections > 0 && selectedProducts.length < minSelections && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800 font-medium">
            Please select at least {minSelections} products before proceeding
          </p>
        </div>
      )}
    </div>
  )
}

export default BundleSelector

