import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Award, Users } from 'lucide-react'

function HeroCarousel({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Default slide if no slides provided
  const defaultSlides = [
    {
      id: 'default-1',
      image: '/top.jpg',
      title: 'Timeless Beauty,',
      titleAccent: 'Naturally Yours',
      description: 'Experience the authentic power of traditional Ayurvedic powders. Handcrafted with pure, natural ingredients.',
      ctaPrimary: 'Explore Products',
      ctaPrimaryLink: '/shop',
      ctaSecondary: 'Our Story',
      ctaSecondaryLink: '/about'
    }
  ]

  const activeSlides = slides.length > 0 ? slides : defaultSlides

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || activeSlides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 6000) // Change slide every 6 seconds (smoother pacing)

    return () => clearInterval(interval)
  }, [isAutoPlaying, activeSlides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false) // Pause auto-play when user manually navigates
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
    setIsAutoPlaying(false)
  }

  const currentSlideData = activeSlides[currentSlide]

  return (
    <section className="relative h-[calc(100vh-72px)] min-h-[400px] sm:min-h-[500px] max-h-[600px] sm:max-h-[700px] overflow-hidden -mt-1">
      {/* Background Images with Sliding Animation */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={currentSlide}>
          <motion.div
            key={currentSlide}
            custom={currentSlide}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              type: 'tween',
              ease: [0.45, 0, 0.15, 1], // Custom cubic-bezier for ultra-smooth motion
              duration: 1.2
            }}
            className="absolute inset-0"
          >
            <img 
              src={currentSlideData.image} 
              alt={currentSlideData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ 
              type: 'tween',
              ease: [0.45, 0, 0.15, 1], // Matching smooth cubic-bezier
              duration: 1,
              delay: 0.15
            }}
            className="w-full max-w-3xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border border-white/30">
              <Sparkles size={14} className="sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">100% Natural & Chemical-Free</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {currentSlideData.title}
              <span className="block text-[#d4a574]">{currentSlideData.titleAccent}</span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              {currentSlideData.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link 
                to={currentSlideData.ctaPrimaryLink || '/shop'} 
                className="bg-[#2d5f3f] hover:bg-[#1e4029] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                {currentSlideData.ctaPrimary || 'Explore Products'}
                <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              </Link>
              <Link 
                to={currentSlideData.ctaSecondaryLink || '/about'} 
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#2d5f3f] px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                {currentSlideData.ctaSecondary || 'Our Story'}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 flex-shrink-0">
                  <Award className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base lg:text-lg">Premium Quality</div>
                  <div className="text-xs sm:text-sm text-white/80">Certified Natural</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 flex-shrink-0">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base lg:text-lg">10,000+</div>
                  <div className="text-xs sm:text-sm text-white/80">Happy Customers</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Only show if multiple slides */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/30 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/30 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators - Only show if multiple slides */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-6 sm:w-8 bg-white' 
                  : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator - Hidden when multiple slides */}
      {activeSlides.length === 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce hidden md:block">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </section>
  )
}

export default HeroCarousel

