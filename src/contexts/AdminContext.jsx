import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'Dixit@powderlegacy.com',
  password: 'Dixit@12'
}

export function AdminProvider({ children }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = localStorage.getItem('adminSession')
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        if (session.isAuthenticated && session.email === ADMIN_CREDENTIALS.email) {
          setIsAdminAuthenticated(true)
        }
      } catch (e) {
        localStorage.removeItem('adminSession')
      }
    }
    setIsLoading(false)
  }, [])

  const adminLogin = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdminAuthenticated(true)
      localStorage.setItem('adminSession', JSON.stringify({
        isAuthenticated: true,
        email: email,
        loginTime: new Date().toISOString()
      }))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const adminLogout = () => {
    setIsAdminAuthenticated(false)
    localStorage.removeItem('adminSession')
  }

  const value = {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    isLoading
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

