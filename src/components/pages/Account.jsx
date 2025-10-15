import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Account() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('profile') || '{}')
      if (p && (p.name || p.email || p.phone)) setProfile({ name: p.name || '', email: p.email || '', phone: p.phone || '' })
    } catch {}
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem('profile', JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // notify header/others
    window.dispatchEvent(new Event('profileUpdated'))
    // close the page
    setTimeout(() => {
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate('/')
      }
    }, 200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">My Account</h1>
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm ring-1 ring-emerald-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input name="name" value={profile.name} onChange={handleChange} placeholder="Your name" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input name="phone" value={profile.phone} onChange={handleChange} placeholder="98765 43210" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
          <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg">Save</button>
          {saved && <div className="text-emerald-700 text-center font-medium">Saved!</div>}
        </form>
      </div>
    </div>
  )
}

export default Account


