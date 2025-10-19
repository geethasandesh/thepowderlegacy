import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const [guestProfile, setGuestProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user profile or guest profile
  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      try {
        if (currentUser) {
          // Load authenticated user profile
          const profile = {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.user_metadata?.display_name || currentUser.user_metadata?.name || '',
            phone: currentUser.user_metadata?.phone || '',
            isGuest: false
          }
          setUserProfile(profile)
          setGuestProfile(null)
        } else {
          // Load guest profile from localStorage
          const localProfile = JSON.parse(localStorage.getItem('profile') || '{}')
          if (localProfile && (localProfile.name || localProfile.email || localProfile.phone)) {
            setGuestProfile(localProfile)
            setUserProfile(null)
          } else {
            setGuestProfile(null)
            setUserProfile(null)
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [currentUser])

  const updateUserProfile = async (updates) => {
    try {
      if (currentUser) {
        // Update Supabase user metadata
        const { error } = await supabase.auth.updateUser({
          data: {
            display_name: updates.name,
            phone: updates.phone
          }
        })

        if (error) throw error

        setUserProfile(prev => ({ ...prev, ...updates }))
      } else {
        // Update guest profile in localStorage
        const updated = { ...guestProfile, ...updates }
        localStorage.setItem('profile', JSON.stringify(updated))
        setGuestProfile(updated)
        window.dispatchEvent(new Event('profileUpdated'))
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const getDisplayName = () => {
    if (userProfile) return userProfile.name
    if (guestProfile) return guestProfile.name
    return ''
  }

  const getEmail = () => {
    if (userProfile) return userProfile.email
    if (guestProfile) return guestProfile.email
    return ''
  }

  const getPhone = () => {
    if (userProfile) return userProfile.phone
    if (guestProfile) return guestProfile.phone
    return ''
  }

  const isLoggedIn = () => {
    return !!currentUser
  }

  const value = {
    userProfile,
    guestProfile,
    currentUser,
    loading,
    updateUserProfile,
    getDisplayName,
    getEmail,
    getPhone,
    isLoggedIn
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

