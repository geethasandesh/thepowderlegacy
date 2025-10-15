import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Use environment variables for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU0MzI4MDAsImV4cCI6MTk2MDc0ODgwMH0.placeholder'

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const hasValidUrl = import.meta.env.VITE_SUPABASE_URL && 
                      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
  const hasValidKey = import.meta.env.VITE_SUPABASE_ANON_KEY && 
                      import.meta.env.VITE_SUPABASE_ANON_KEY.startsWith('eyJ')
  return hasValidUrl && hasValidKey
}

// Create Supabase client (will work even if not configured, but will fail on requests)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Log configuration status
if (!isSupabaseConfigured()) {
  console.warn('⚠️ Supabase not configured! Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file')
  console.warn('📖 See QUICK_ENV_SETUP.txt for setup instructions')
} else {
  console.log('✅ Supabase configured successfully')
}

// Export storage bucket names
export const STORAGE_BUCKETS = {
  PRODUCTS: import.meta.env.VITE_SUPABASE_BUCKET_PRODUCTS || 'products',
  HOME: import.meta.env.VITE_SUPABASE_BUCKET_HOME || 'home',
  HEADER: import.meta.env.VITE_SUPABASE_BUCKET_HEADER || 'header'
}

