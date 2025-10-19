import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Leaf, Shield, Heart, ShoppingCart, Award, CheckCircle, Users, TrendingUp, Clock } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { fetchProducts } from '../../services/products'
import { fetchHeroSlides } from '../../services/heroSlides'
import HeroCarousel from '../HeroCarousel'

function Home() {
  const { addToCart } = useCart()
  const [selectedSizes, setSelectedSizes] = useState({})
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]') } catch { return [] }
  })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [heroSlides, setHeroSlides] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const list = await fetchProducts({})
      const top = [...list].filter(p => p.type !== 'bundle').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8)
      if (!cancelled) setFeaturedProducts(top)
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadSlides() {
      const slides = await fetchHeroSlides()
      if (!cancelled) setHeroSlides(slides)
    }
    loadSlides()
    return () => { cancelled = true }
  }, [])

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id] || product.sizes[0].size
    const sizeObj = product.sizes.find(size => size.size === selectedSize)
    addToCart(product, sizeObj, 1)
  }

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const exists = prev.includes(productId)
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true)
      setNewsletterEmail('')
      setTimeout(() => setNewsletterSuccess(false), 3000)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* Features Section - Professional Layout */}
      <section className="py-12 sm:py-14 lg:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Why Choose Us
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto px-4">
              Experience the perfect blend of ancient wisdom and modern quality standards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { 
                icon: <Leaf size={32} />, 
                title: "100% Natural", 
                description: "Pure ingredients, zero chemicals, completely safe for daily use",
                color: "bg-emerald-50 text-emerald-700"
              },
              { 
                icon: <Shield size={32} />, 
                title: "Family Safe", 
                description: "Dermatologically tested, suitable for all skin types and ages",
                color: "bg-blue-50 text-blue-700"
              },
              { 
                icon: <Award size={32} />, 
                title: "Traditional Wisdom", 
                description: "Time-tested Ayurvedic formulas passed through generations",
                color: "bg-amber-50 text-amber-700"
              },
              { 
                icon: <CheckCircle size={32} />, 
                title: "Quality Assured", 
                description: "Handcrafted in small batches for premium quality control",
                color: "bg-purple-50 text-purple-700"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-100 group text-center sm:text-left"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Visual Grid */}
      <section className="py-12 sm:py-14 lg:py-18 bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-900 mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-stone-600">
              Discover our range of natural wellness products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: "Skin Care", href: "/shop/skin-care", image: "/face.jpg", desc: "Natural bath powders & face care" },
              { name: "Hair Care", href: "/shop/hair-care", image: "/hair.jpg", desc: "Strengthen & nourish your hair" },
              { name: "Oral Care", href: "/shop/oral-care", image: "/18965903.jpg", desc: "Traditional tooth powders" }
            ].map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={category.href} className="group block">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
                      <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{category.name}</h3>
                      <p className="text-sm sm:text-base text-white/90 mb-3 sm:mb-4">{category.desc}</p>
                      <span className="inline-flex items-center gap-2 text-[#d4a574] text-sm sm:text-base font-semibold group-hover:gap-4 transition-all">
                        Explore Collection <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Enhanced Grid */}
      <section className="py-12 sm:py-14 lg:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 lg:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-900 mb-2 sm:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Bestsellers
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-stone-600">
                Loved by thousands of customers across India
              </p>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-[#2d5f3f] font-semibold hover:gap-4 transition-all text-sm lg:text-base whitespace-nowrap">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product, idx) => {
              const selectedSize = selectedSizes[product.id] || product.sizes[0]?.size
              const sizeObj = product.sizes?.find(size => size.size === selectedSize) || product.sizes?.[0]

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100"
                >
                  <Link to={`/shop/product/${product.id}`} className="block relative">
                    <div className="aspect-square bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <Leaf size={32} className="sm:w-12 sm:h-12" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleFavorite(product.id) }}
                      className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${favorites.includes(product.id) ? 'text-red-500' : 'text-stone-600'}`}
                    >
                      <Heart size={16} className={`sm:w-[18px] sm:h-[18px] ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </Link>

                  <div className="p-3 sm:p-4 lg:p-5">
                    <Link to={`/shop/product/${product.id}`}>
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg text-stone-900 mb-1 sm:mb-2 group-hover:text-[#2d5f3f] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={`sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-current' : 'text-stone-300'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs text-stone-500">({product.reviews || 0})</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2d5f3f]">₹{sizeObj?.price || 0}</div>
                      <select 
                        value={selectedSize}
                        onChange={(e) => handleSizeSelect(product.id, e.target.value)}
                        className="text-xs sm:text-sm border border-stone-300 rounded-lg px-1.5 py-1 sm:px-2 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f] w-full sm:w-auto"
                      >
                        {product.sizes?.map(size => (
                          <option key={size.size} value={size.size}>{size.size}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full btn-primary py-2 sm:py-2.5 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link to="/shop" className="btn-outline inline-flex items-center gap-2">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-12 sm:py-14 lg:py-18 bg-[#2d5f3f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              What Our Customers Say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80">
              Join thousands of happy customers experiencing natural care
            </p>
          </div>

          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { 
                name: "Priya ", 
                location: "Hyderabad, Telangana",
                avatar: "P",
                customerImage: "/reviews/r1.jpg", // Correct path for images in public/reviews folder
                rating: 5, 
                comment: "The Sassy Sunnipindi transformed my skin! Completely natural and so effective. I've recommended it to all my friends." 
              },
              { 
                name: "Rajesh Kumar", 
                location: "Tirupati, Andhra Pradesh",
                avatar: "RK",
                customerImage: "/reviews/r2.jpg", // Correct path for images in public/reviews folder
                rating: 5, 
                comment: "Anti Hairfall powder is a game-changer. Natural ingredients, visible results. My hair feels stronger and healthier than ever!" 
              },
              { 
                name: "Sunita Reddy", 
                location: "Bangalore, Karnataka",
                avatar: "SR",
                customerImage: "/reviews/r4.jpg", // Correct path for images in public/reviews folder
                rating: 5, 
                comment: "Authentic quality and traditional recipes. Love that they're chemical-free and safe for my entire family. Highly recommended!" 
              },
              
              
              
              { 
                name: "Ramya", 
                location: "Hyderabad,Telangana",
                avatar: "R",
                customerImage: "/reviews/r3.jpg", // Correct path for images in public/reviews folder
                rating: 5, 
                comment: "Highly recommended!" 
              }
             ].map((testimonial, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 hover:bg-white/15 transition-all flex-shrink-0 w-80 sm:w-96"
               >
                {/* Customer Image Placeholder */}
                <div className="relative mb-4 sm:mb-6">
                  <div className="aspect-[4/3] bg-white/20 rounded-lg overflow-hidden">
                    <img 
                      src={testimonial.customerImage} 
                      alt={`${testimonial.name} testimonial`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextElementSibling.style.display = 'flex'
                      }}
                    />
                    {/* Fallback placeholder when image fails to load */}
                    <div className="w-full h-full bg-gradient-to-br from-[#d4a574]/30 to-[#d4a574]/10 flex items-center justify-center text-white/60" style={{display: 'none'}}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">📸</div>
                        <div className="text-sm font-medium">Customer Photo</div>
                        <div className="text-xs text-white/50">Upload image here</div>
                      </div>
                    </div>
                  </div>
                  {/* Star Rating overlay */}
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-[#d4a574] fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#d4a574] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-white/70">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - CTA Section */}
      <section className="py-12 sm:py-14 lg:py-18 bg-gradient-to-br from-[#d4a574] to-[#b8824d] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Get 10% Off Your First Order
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 px-4">
            Subscribe to our newsletter for exclusive offers, wellness tips, and new product launches
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
              />
              <button type="submit" className="bg-[#2d5f3f] hover:bg-[#1e4029] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg whitespace-nowrap">
                Subscribe
              </button>
            </div>
              {newsletterSuccess && (
                <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-white flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                <span>Thank you for subscribing!</span>
                </motion.div>
              )}
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-12 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { icon: <Users size={32} />, value: "10,000+", label: "Happy Customers" },
              { icon: <Award size={32} />, value: "100%", label: "Natural Products" },
              { icon: <TrendingUp size={32} />, value: "4.8/5", label: "Customer Rating" },
              { icon: <Clock size={32} />, value: "24/7", label: "Customer Support" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-[#2d5f3f] flex justify-center mb-2 sm:mb-3">
                  {React.cloneElement(stat.icon, { size: 24, className: 'sm:w-8 sm:h-8' })}
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-1 sm:mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-stone-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
