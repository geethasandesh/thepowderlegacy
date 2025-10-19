import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, User, ShoppingCart, Heart, ChevronDown, Leaf, Shield, Award, LogOut, Package } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../contexts/UserContext'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showShopDropdown, setShowShopDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { getCartItemsCount } = useCart()
  const { currentUser, logout } = useAuth()
  const { getDisplayName } = useUser()
  const [profileName, setProfileName] = useState('')

  useEffect(() => {
    setProfileName(getDisplayName())
  }, [getDisplayName, currentUser])

  useEffect(() => {
    const load = () => {
      setProfileName(getDisplayName())
    }
    window.addEventListener('profileUpdated', load)
    return () => window.removeEventListener('profileUpdated', load)
  }, [getDisplayName])

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserDropdown(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigation = [
    { name: 'Home', href: '/home' },
    { 
      name: 'Shop', 
      href: '/shop', 
      hasDropdown: true,
      submenu: [
        { name: 'All Products', href: '/shop', icon: '🌿' },
        { name: 'Skin Care', href: '/shop/skin-care', icon: '✨' },
        { name: 'Hair Care', href: '/shop/hair-care', icon: '💆' },
        { name: 'Oral Care', href: '/shop/oral-care', icon: '😊' }
      ] 
    },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <>
      {/* Top Bar - Trust Indicators */}
      <div className="bg-[#2d5f3f] text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Leaf size={14} />
                <span>100% Natural Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} />
                <span>Chemical-Free & Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} />
                <span>Traditional Ayurvedic Formulas</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:+917337334653" className="hover:text-[#d4a574] transition-colors">
                📞 +91-7337334653
              </a>
              <a href="mailto:contact@thepowderlegacy.in" className="hover:text-[#d4a574] transition-colors">
                ✉️ contact@thepowderlegacy.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <img 
                  src="/logo.png" 
                  alt="The Powder Legacy" 
                  className="h-14 w-14 object-contain transition-transform group-hover:scale-105" 
                />
                <div className="hidden sm:block">
                  <div className="text-2xl font-bold text-[#2d5f3f] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                    The Powder Legacy
                  </div>
                  <div className="text-xs text-[#8b9d83] font-medium tracking-wide">
                    Timeless Natural Care
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <div 
                  key={item.name} 
                  className="relative group"
                  onMouseEnter={() => item.hasDropdown && setShowShopDropdown(true)}
                  onMouseLeave={() => item.hasDropdown && setShowShopDropdown(false)}
                >
                  <Link 
                    to={item.href} 
                    className={`
                      flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${location.pathname === item.href 
                        ? 'text-[#2d5f3f] bg-[#f5f5f4]' 
                        : 'text-stone-700 hover:text-[#2d5f3f] hover:bg-[#fafaf9]'
                      }
                    `}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.submenu && showShopDropdown && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden">
                      <div className="py-2">
                        {item.submenu.map((subItem) => (
                          <Link 
                            key={subItem.name} 
                            to={subItem.href} 
                            className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-[#f5f5f4] hover:text-[#2d5f3f] transition-colors"
                          >
                            <span className="text-lg">{subItem.icon}</span>
                            <span className="font-medium">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Favorites */}
              <Link 
                to="/favorites" 
                className="p-2.5 text-stone-700 hover:text-[#2d5f3f] hover:bg-[#f5f5f4] rounded-lg transition-all hidden sm:flex"
                aria-label="Favorites"
              >
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2.5 text-stone-700 hover:text-[#2d5f3f] hover:bg-[#f5f5f4] rounded-lg transition-all"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#d4a574] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-md">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              {/* User Menu - Logged In */}
              {currentUser ? (
                <div 
                  className="relative hidden lg:block"
                  onMouseEnter={() => setShowUserDropdown(true)}
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <button 
                    className="flex items-center gap-2 p-2.5 text-stone-700 hover:text-[#2d5f3f] hover:bg-[#f5f5f4] rounded-lg transition-all"
                    aria-label="Account"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {profileName ? profileName.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase() : <User size={16} />}
                      </span>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <p className="text-sm font-semibold text-slate-900 truncate">{profileName || 'User'}</p>
                        <p className="text-xs text-slate-600 truncate">{currentUser.email}</p>
                      </div>
                      <div className="py-2">
                        <Link 
                          to="/account" 
                          className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-[#f5f5f4] hover:text-[#2d5f3f] transition-colors"
                        >
                          <User size={16} />
                          <span className="font-medium">My Account</span>
                        </Link>
                        <Link 
                          to="/orders" 
                          className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-[#f5f5f4] hover:text-[#2d5f3f] transition-colors"
                        >
                          <Package size={16} />
                          <span className="font-medium">My Orders</span>
                        </Link>
                        <Link 
                          to="/favorites" 
                          className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-[#f5f5f4] hover:text-[#2d5f3f] transition-colors"
                        >
                          <Heart size={16} />
                          <span className="font-medium">Favorites</span>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* User Menu - Not Logged In */
                <div className="hidden lg:flex items-center gap-2 ml-2">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-sm font-semibold text-[#2d5f3f] hover:bg-[#f5f5f4] rounded-lg transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 text-sm font-semibold bg-[#2d5f3f] text-white hover:bg-[#234d32] rounded-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Account Button */}
              <Link 
                to="/account" 
                className="lg:hidden relative p-2.5 text-stone-700 hover:text-[#2d5f3f] hover:bg-[#f5f5f4] rounded-lg transition-all"
                aria-label="Account"
              >
                <User size={20} />
                {profileName && (
                  <span className="absolute -bottom-0.5 -right-0.5 bg-[#2d5f3f] text-white text-[9px] leading-none rounded-full px-1.5 py-0.5 font-semibold">
                    {profileName.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="lg:hidden p-2.5 text-stone-700 hover:text-[#2d5f3f] hover:bg-[#f5f5f4] rounded-lg transition-all ml-2"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-stone-200">
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link 
                      to={item.href} 
                      className={`
                        block px-4 py-3 text-base font-medium rounded-lg transition-colors
                        ${location.pathname === item.href 
                          ? 'text-[#2d5f3f] bg-[#f5f5f4]' 
                          : 'text-stone-700 hover:text-[#2d5f3f] hover:bg-[#fafaf9]'
                        }
                      `}
                      onClick={() => !item.submenu && setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.submenu && (
                      <div className="pl-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link 
                            key={subItem.name} 
                            to={subItem.href} 
                            className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-[#2d5f3f] hover:bg-[#fafaf9] rounded-lg transition-colors" 
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span>{subItem.icon}</span>
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Contact Info */}
                <div className="pt-4 mt-4 border-t border-stone-200">
                  <a href="tel:+917337334653" className="block px-4 py-2 text-sm text-stone-600 hover:text-[#2d5f3f]">
                    📞 +91-7337334653
                  </a>
                  <a href="mailto:contact@thepowderlegacy.in" className="block px-4 py-2 text-sm text-stone-600 hover:text-[#2d5f3f]">
                    ✉️ contact@thepowderlegacy.in
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header
