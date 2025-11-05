import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!formData.email) nextErrors.email = 'Email is required'
    if (!formData.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await login(formData.email, formData.password)
      
      // Handle redirects after login
      const redirect = searchParams.get('redirect')
      if (redirect === 'checkout') {
        navigate('/checkout/address')
      } else if (redirect) {
        navigate(`/${redirect}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      // Handle specific error messages
      let errorMessage = err?.message || 'Login failed'
      
      if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address. Check your inbox for a verification link.'
      } else if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.'
      }
      
      setErrors({ email: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.email && !errors.password && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{errors.email}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email && errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Mail size={18} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            {errors.email && errors.password && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-green-800 hover:text-green-600 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <Lock size={18} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-800 text-white py-2.5 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-green-800 hover:text-green-600 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
