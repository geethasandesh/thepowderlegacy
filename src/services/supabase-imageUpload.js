import { supabase, STORAGE_BUCKETS } from '../lib/supabase'

/**
 * Upload image to Supabase Storage
 * @param {File} file - Image file to upload
 * @param {string} bucket - Storage bucket name
 * @param {string} folder - Folder within bucket
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadImageToSupabase(file, bucket = STORAGE_BUCKETS.PRODUCTS, folder = '', onProgress = null) {
  try {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file')
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB. Please compress your image.')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 9)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}_${randomString}.${extension}`
    
    // Create file path
    const filePath = folder ? `${folder}/${filename}` : filename
    
    // Simulate progress since Supabase doesn't provide upload progress
    if (onProgress) {
      onProgress(20)
    }

    // Upload file to Supabase Storage
    const activeBucket = bucket || STORAGE_BUCKETS.PRODUCTS
    const { data, error } = await supabase.storage
      .from(activeBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    if (onProgress) {
      onProgress(80)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(activeBucket)
      .getPublicUrl(filePath)

    if (onProgress) {
      onProgress(100)
    }

    console.log('✅ Image uploaded to Supabase:', urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error('❌ Upload error:', error)
    throw error
  }
}

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - Full Supabase Storage URL
 * @param {string} bucket - Storage bucket name
 * @returns {Promise<boolean>} Success status
 */
export async function deleteImageFromSupabase(imageUrl, bucket = 'products') {
  try {
    // Check if it's a Supabase Storage URL
    if (!imageUrl.includes('supabase')) {
      console.log('Not a Supabase Storage URL, skipping deletion')
      return false
    }

    // Extract file path from URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/path/file.jpg
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/public/')
    if (pathParts.length < 2) {
      throw new Error('Invalid Supabase Storage URL')
    }

    const fullPath = pathParts[1]
    const filePath = fullPath.split('/').slice(1).join('/') // Remove bucket name

    // Delete from storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error

    console.log('✅ Image deleted from Supabase Storage')
    return true
  } catch (error) {
    console.error('❌ Delete error:', error)
    // Don't throw - deletion failure shouldn't block other operations
    return false
  }
}

/**
 * List files in a bucket folder
 * @param {string} bucket - Storage bucket name
 * @param {string} folder - Folder path
 * @returns {Promise<Array>} List of files
 */
export async function listImagesInFolder(bucket, folder = '') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('❌ Error listing images:', error)
    return []
  }
}

/**
 * Compress image before upload (client-side)
 * @param {File} file - Original image file
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<Blob>} Compressed image blob
 */
export async function compressImage(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (maxWidth / width) * height
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
  })
}

/**
 * Get file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get image dimensions
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
export async function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => reject(new Error('Failed to load image'))
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
  })
}

