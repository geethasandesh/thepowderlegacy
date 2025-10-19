import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, Phone, MapPin, Leaf, Heart, Award, ShieldCheck } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-[#2d5f3f] via-[#1e4029] to-[#2d5f3f] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 group">
              <img 
                src="/logo.png" 
                alt="The Powder Legacy" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain brightness-0 invert transition-transform group-hover:scale-105" 
              />
              <div>
                <div className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  The Powder Legacy
              </div>
                <div className="text-[10px] sm:text-xs text-[#d4a574] font-medium">
                  Timeless Natural Care
                </div>
              </div>
            </Link>
            <p className="text-stone-200 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              Handcrafted with love, rooted in tradition. We bring you the finest natural powders made from pure, chemical-free ingredients.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs">
                <Leaf size={12} className="sm:w-3.5 sm:h-3.5 text-[#d4a574] flex-shrink-0" />
                <span>100% Natural</span>
            </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs">
                <ShieldCheck size={12} className="sm:w-3.5 sm:h-3.5 text-[#d4a574] flex-shrink-0" />
                <span>Safe & Pure</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              <a 
                href="https://www.facebook.com/thepowderlegacystore" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 bg-white/10 hover:bg-[#d4a574] rounded-lg transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a 
                href="https://www.instagram.com/thepowderlegacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 bg-white/10 hover:bg-[#d4a574] rounded-lg transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a 
                href="mailto:contact@thepowderlegacy.in"
                className="p-2 sm:p-2.5 bg-white/10 hover:bg-[#d4a574] rounded-lg transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#d4a574' }}>
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link to="/" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#d4a574' }}>
              Categories
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link to="/shop/skin-care" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Skin Care Powders
                </Link>
              </li>
              <li>
                <Link to="/shop/hair-care" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Hair Care Powders
                </Link>
              </li>
              <li>
                <Link to="/shop/oral-care" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Oral Care Products
                </Link>
              </li>
            </ul>
            
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 mt-5 sm:mt-6" style={{ fontFamily: 'Playfair Display, serif', color: '#d4a574' }}>
              Policies
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link to="/privacy" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-stone-200 hover:text-[#d4a574] transition-colors text-xs sm:text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#d4a574] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
                  Shipping Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#d4a574' }}>
              Get In Touch
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3 group">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg group-hover:bg-[#d4a574] transition-colors flex-shrink-0">
                  <Mail size={14} className="sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-stone-300 mb-0.5 sm:mb-1">Email Us</div>
                  <a 
                    href="mailto:contact@thepowderlegacy.in" 
                    className="text-white hover:text-[#d4a574] transition-colors text-xs sm:text-sm font-medium break-all"
                  >
                    contact@thepowderlegacy.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 group">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg group-hover:bg-[#d4a574] transition-colors flex-shrink-0">
                  <Phone size={14} className="sm:w-4 sm:h-4" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-stone-300 mb-0.5 sm:mb-1">Call Us</div>
                  <a 
                    href="tel:+917337334653" 
                    className="text-white hover:text-[#d4a574] transition-colors text-xs sm:text-sm font-medium"
                  >
                    +91-7337334653
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 group">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg group-hover:bg-[#d4a574] transition-colors flex-shrink-0">
                  <MapPin size={14} className="sm:w-4 sm:h-4 mt-0.5" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-stone-300 mb-0.5 sm:mb-1">Visit Us</div>
                  <address className="text-white text-xs sm:text-sm not-italic leading-relaxed">
                    G5, C-Block Emerald Heights,<br />
                    Annojiguda, Ghatkesar,<br />
                    Medchal – 500088,<br />
                    Telangana, India
                  </address>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-stone-300 text-center md:text-left">
              © {currentYear} The Powder Legacy. All rights reserved. Made with{' '}
              <Heart size={12} className="sm:w-3.5 sm:h-3.5 inline text-[#d4a574]" /> in India
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-stone-300">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Award size={12} className="sm:w-3.5 sm:h-3.5 text-[#d4a574] flex-shrink-0" />
                <span>Certified Natural</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Leaf size={12} className="sm:w-3.5 sm:h-3.5 text-[#d4a574] flex-shrink-0" />
                <span>Eco-Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
