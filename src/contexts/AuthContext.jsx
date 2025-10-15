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
    return data.user
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
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
