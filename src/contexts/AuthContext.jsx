import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session with error handling
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (!error) {
          setCurrentUser(session?.user ?? null)
        }
      } catch (error) {
        console.warn('⚠️ Auth initialization failed (Supabase may not be configured):', error.message)
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ?? null)
      })

      return () => {
        try {
          subscription.unsubscribe()
        } catch (e) {
          console.warn('Failed to unsubscribe from auth changes')
        }
      }
    } catch (error) {
      console.warn('⚠️ Auth state change listener failed')
      return () => {}
    }
  }, [])

  const signup = async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    })

    if (error) throw error
    
    // Try to link any guest orders to this new user account
    try {
      const { linkGuestOrdersToUser } = await import('../services/supabase-db')
      await linkGuestOrdersToUser(data.user.id, email)
    } catch (err) {
      console.warn('Could not link guest orders:', err)
    }
    
    // Send welcome email (fire-and-forget, don't block signup)
    try {
      console.log('📧 Sending welcome email to:', email)
      
      // Determine the correct API URL based on environment
      const apiUrl = import.meta.env.DEV 
        ? '/api/send-lead-email'  // Development: use Vite proxy
        : 'http://localhost:3001/api/send-lead-email'  // Direct to API server
      
      console.log('📧 API URL:', apiUrl)
      
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailType: 'signup-welcome',
          leadData: {
            name: displayName || 'Customer',
            email: email,
            resetPasswordUrl: data.user?.email_confirmed_at ? null : undefined
          }
        })
      })
        .then(res => {
          console.log('📧 Email API response status:', res.status)
          if (res.ok) {
            return res.json()
          } else {
            return res.text().then(text => {
              console.error('❌ Email API error response:', text)
              throw new Error(`Email API returned ${res.status}`)
            })
          }
        })
        .then(result => {
          console.log('✅ Welcome email sent successfully:', result)
        })
        .catch(err => {
          console.error('❌ Could not send welcome email:', err)
        })
    } catch (err) {
      console.error('❌ Welcome email error:', err)
    }
    
    return data.user
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    
    // Try to link any guest orders to this user account
    try {
      const { linkGuestOrdersToUser } = await import('../services/supabase-db')
      await linkGuestOrdersToUser(data.user.id, email)
    } catch (err) {
      console.warn('Could not link guest orders:', err)
    }
    
    return data.user
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = { currentUser, signup, login, logout }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
