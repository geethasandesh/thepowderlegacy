import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Default slides as fallback
export const defaultSlides = [
  {
    id: 'default-1',
    image: '/top.jpg',
    title: 'Timeless Beauty,',
    titleAccent: 'Naturally Yours',
    description: 'Experience the authentic power of traditional Ayurvedic powders. Handcrafted with pure, natural ingredients.',
    ctaPrimary: 'Explore Products',
    ctaPrimaryLink: '/shop',
    ctaSecondary: 'Our Story',
    ctaSecondaryLink: '/about',
    order: 0,
    isActive: true
  }
]

/**
 * Fetch all hero slides from Supabase
 */
export async function fetchHeroSlides() {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured, using default hero slides')
      return defaultSlides
    }

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })

    if (error) throw error

    // If no slides in database, return default
    if (!data || data.length === 0) {
      console.log('📸 No hero slides in database, using defaults')
      return defaultSlides
    }

    // Map database fields to component format
    const slides = data.map(slide => ({
      id: slide.id,
      image: slide.image_url,
      title: slide.title,
      titleAccent: slide.title_accent,
      description: slide.description,
      ctaPrimary: slide.cta_primary_text,
      ctaPrimaryLink: slide.cta_primary_link,
      ctaSecondary: slide.cta_secondary_text,
      ctaSecondaryLink: slide.cta_secondary_link,
      order: slide.order,
      isActive: slide.is_active
    }))

    console.log('✅ Loaded hero slides from Supabase:', slides.length)
    return slides
  } catch (error) {
    console.error('❌ Error fetching hero slides:', error)
    return defaultSlides
  }
}

/**
 * Fetch all hero slides (including inactive) for admin
 */
export async function fetchAllHeroSlides() {
  try {
    if (!isSupabaseConfigured()) {
      return defaultSlides
    }

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order', { ascending: true })

    if (error) throw error

    if (!data || data.length === 0) {
      return defaultSlides
    }

    const slides = data.map(slide => ({
      id: slide.id,
      image: slide.image_url,
      title: slide.title,
      titleAccent: slide.title_accent,
      description: slide.description,
      ctaPrimary: slide.cta_primary_text,
      ctaPrimaryLink: slide.cta_primary_link,
      ctaSecondary: slide.cta_secondary_text,
      ctaSecondaryLink: slide.cta_secondary_link,
      order: slide.order,
      isActive: slide.is_active
    }))

    return slides
  } catch (error) {
    console.error('❌ Error fetching all hero slides:', error)
    return defaultSlides
  }
}

/**
 * Add a new hero slide
 */
export async function addHeroSlide(slideData) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('hero_slides')
      .insert({
        image_url: slideData.image,
        title: slideData.title,
        title_accent: slideData.titleAccent,
        description: slideData.description,
        cta_primary_text: slideData.ctaPrimary,
        cta_primary_link: slideData.ctaPrimaryLink,
        cta_secondary_text: slideData.ctaSecondary,
        cta_secondary_link: slideData.ctaSecondaryLink,
        order: slideData.order || 0,
        is_active: slideData.isActive !== false
      })
      .select()
      .single()

    if (error) throw error

    console.log('✅ Hero slide added successfully')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error adding hero slide:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update an existing hero slide
 */
export async function updateHeroSlide(id, slideData) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('hero_slides')
      .update({
        image_url: slideData.image,
        title: slideData.title,
        title_accent: slideData.titleAccent,
        description: slideData.description,
        cta_primary_text: slideData.ctaPrimary,
        cta_primary_link: slideData.ctaPrimaryLink,
        cta_secondary_text: slideData.ctaSecondary,
        cta_secondary_link: slideData.ctaSecondaryLink,
        order: slideData.order,
        is_active: slideData.isActive
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Hero slide updated successfully')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error updating hero slide:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a hero slide
 */
export async function deleteHeroSlide(id) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id)

    if (error) throw error

    console.log('✅ Hero slide deleted successfully')
    return { success: true }
  } catch (error) {
    console.error('❌ Error deleting hero slide:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Toggle slide active status
 */
export async function toggleSlideActive(id, isActive) {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('hero_slides')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Hero slide status toggled')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error toggling slide status:', error)
    return { success: false, error: error.message }
  }
}

