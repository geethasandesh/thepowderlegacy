import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  Home, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Heading,
  Image
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'
import ProductsManager from '../admin/ProductsManager'
import HomeContentManager from '../admin/HomeContentManager'
import HeaderContentManager from '../admin/HeaderContentManager'
import HeroSlidesManager from '../admin/HeroSlidesManager'

function AdminDashboard() {
  const { adminLogout } = useAdmin()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Start closed on mobile

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminLogout()
      navigate('/admin')
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'hero', label: 'Hero Carousel', icon: <Image size={20} /> },
    { id: 'products', label: 'Products Manager', icon: <Package size={20} /> },
    { id: 'home', label: 'Home Content', icon: <Home size={20} /> },
    { id: 'header', label: 'Header Content', icon: <Heading size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`bg-emerald-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
      } overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-emerald-800">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-emerald-300">The Powder Legacy</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-emerald-800 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-emerald-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-0 lg:ml-20'
      }`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu size={20} />
                </button>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Logged in as: <span className="font-semibold">Admin</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Products</p>
                      <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Package className="text-emerald-800" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Categories</p>
                      <h3 className="text-2xl font-bold text-gray-900">5</h3>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <LayoutDashboard className="text-blue-800" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Content Sections</p>
                      <h3 className="text-2xl font-bold text-gray-900">5</h3>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Home className="text-purple-800" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-4 border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-left"
                  >
                    <Package className="text-emerald-800 mb-2" size={24} />
                    <h4 className="font-semibold text-gray-900">Manage Products</h4>
                    <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('home')}
                    className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                  >
                    <Home className="text-blue-800 mb-2" size={24} />
                    <h4 className="font-semibold text-gray-900">Edit Home Content</h4>
                    <p className="text-sm text-gray-600">Update homepage sections</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('header')}
                    className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left"
                  >
                    <Heading className="text-purple-800 mb-2" size={24} />
                    <h4 className="font-semibold text-gray-900">Header Settings</h4>
                    <p className="text-sm text-gray-600">Customize header content</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Settings className="text-gray-800 mb-2" size={24} />
                    <h4 className="font-semibold text-gray-900">Settings</h4>
                    <p className="text-sm text-gray-600">Configure site settings</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && <HeroSlidesManager />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'home' && <HomeContentManager />}
          {activeTab === 'header' && <HeaderContentManager />}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard

