import React, { useState, useEffect } from 'react'
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react'
import { saveHeaderContentToSupabase, loadHeaderContentFromSupabase } from '../../services/supabase-cms'

function HeaderContentManager() {
  const [headerContent, setHeaderContent] = useState({
    logo: '/logo.png',
    siteName: 'The Powder Legacy',
    navigation: [
      { name: 'Home', href: '/' },
      { 
        name: 'About Us', 
        href: '/about',
        submenu: []
      },
      { 
        name: 'Shop', 
        href: '/shop',
        submenu: [
          { name: 'Skin Care Products', href: '/shop/skin-care' },
          { name: 'Hair Care Products', href: '/shop/hair-care' },
          { name: 'Oral Care Products', href: '/shop/oral-care' },
          { name: 'All Products', href: '/shop' }
        ]
      },
      { name: 'Contact Us', href: '/contact' }
    ]
  })

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Load content from Supabase
    async function loadContent() {
      try {
        const supabaseContent = await loadHeaderContentFromSupabase()
        if (supabaseContent && typeof supabaseContent === 'object') {
          // Merge with default to ensure all fields exist
          setHeaderContent(prevContent => ({
            logo: supabaseContent.logo || prevContent.logo,
            siteName: supabaseContent.siteName || prevContent.siteName,
            navigation: supabaseContent.navigation || prevContent.navigation
          }))
        }
      } catch (error) {
        console.error('Failed to load header content:', error)
        // Keep default state if loading fails
      }
    }
    loadContent()
  }, [])

  const handleSave = async () => {
    // Save to Supabase
    const result = await saveHeaderContentToSupabase(headerContent)
    
    if (result.success) {
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
      alert('Header content saved to database successfully!')
    } else {
      alert('Error: Failed to save to database. ' + result.error)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default header content?')) {
      localStorage.removeItem('admin_header_content')
      localStorage.removeItem('header_content')
      window.location.reload()
    }
  }

  const updateNavItem = (index, field, value) => {
    const newNav = [...headerContent.navigation]
    newNav[index] = { ...newNav[index], [field]: value }
    setHeaderContent({ ...headerContent, navigation: newNav })
  }

  const addNavItem = () => {
    setHeaderContent({
      ...headerContent,
      navigation: [
        ...headerContent.navigation,
        { name: 'New Item', href: '/', submenu: [] }
      ]
    })
  }

  const removeNavItem = (index) => {
    const newNav = headerContent.navigation.filter((_, i) => i !== index)
    setHeaderContent({ ...headerContent, navigation: newNav })
  }

  const addSubmenuItem = (navIndex) => {
    const newNav = [...headerContent.navigation]
    if (!newNav[navIndex].submenu) {
      newNav[navIndex].submenu = []
    }
    newNav[navIndex].submenu.push({ name: 'New Submenu Item', href: '/' })
    setHeaderContent({ ...headerContent, navigation: newNav })
  }

  const updateSubmenuItem = (navIndex, subIndex, field, value) => {
    const newNav = [...headerContent.navigation]
    newNav[navIndex].submenu[subIndex] = {
      ...newNav[navIndex].submenu[subIndex],
      [field]: value
    }
    setHeaderContent({ ...headerContent, navigation: newNav })
  }

  const removeSubmenuItem = (navIndex, subIndex) => {
    const newNav = [...headerContent.navigation]
    newNav[navIndex].submenu = newNav[navIndex].submenu.filter((_, i) => i !== subIndex)
    setHeaderContent({ ...headerContent, navigation: newNav })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Header Content Management</h3>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RefreshCw size={20} />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSaved
                ? 'bg-green-600 text-white'
                : 'bg-emerald-800 text-white hover:bg-emerald-700'
            }`}
          >
            <Save size={20} />
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Logo & Site Name */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Logo & Branding</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <div className="flex gap-3 items-center">
              <input
                type="text"
                value={headerContent?.logo || ''}
                onChange={(e) => setHeaderContent({ ...headerContent, logo: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="/logo.png"
              />
              {headerContent?.logo && (
                <img 
                  src={headerContent.logo} 
                  alt="Logo preview" 
                  className="h-12 w-auto object-contain border rounded"
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter the path to your logo image</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              value={headerContent?.siteName || ''}
              onChange={(e) => setHeaderContent({ ...headerContent, siteName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="The Powder Legacy"
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold text-gray-900">Navigation Menu</h4>
          <button
            onClick={addNavItem}
            className="flex items-center gap-2 text-emerald-800 hover:text-emerald-600 text-sm"
          >
            <Plus size={18} />
            Add Menu Item
          </button>
        </div>

        <div className="space-y-4">
          {(headerContent.navigation || []).map((item, navIndex) => (
            <div key={navIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-3">
                {/* Main Nav Item */}
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Menu Item Name
                      </label>
                      <input
                        type="text"
                        value={item?.name || ''}
                        onChange={(e) => updateNavItem(navIndex, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Path
                      </label>
                      <input
                        type="text"
                        value={item?.href || ''}
                        onChange={(e) => updateNavItem(navIndex, 'href', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeNavItem(navIndex)}
                    className="text-red-600 hover:text-red-800 mt-8"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Submenu */}
                <div className="ml-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Submenu Items</label>
                    <button
                      onClick={() => addSubmenuItem(navIndex)}
                      className="text-emerald-800 hover:text-emerald-600 text-xs flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Submenu
                    </button>
                  </div>

                  {item.submenu && item.submenu.length > 0 && (
                    <div className="space-y-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <div key={subIndex} className="flex gap-2 items-center bg-white p-2 rounded border">
                          <input
                            type="text"
                            placeholder="Submenu name"
                            value={subItem?.name || ''}
                            onChange={(e) => updateSubmenuItem(navIndex, subIndex, 'name', e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                          />
                          <input
                            type="text"
                            placeholder="URL"
                            value={subItem?.href || ''}
                            onChange={(e) => updateSubmenuItem(navIndex, subIndex, 'href', e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            onClick={() => removeSubmenuItem(navIndex, subIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Header Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Additional Settings</h4>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Changes to the header will be reflected across all pages. 
              Make sure to test the navigation after saving changes.
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Available Features:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Search functionality (always enabled)</li>
              <li>User account icon</li>
              <li>Shopping cart with item count</li>
              <li>Favorites/wishlist icon</li>
              <li>Mobile responsive menu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            isSaved
              ? 'bg-green-600 text-white'
              : 'bg-emerald-800 text-white hover:bg-emerald-700'
          }`}
        >
          <Save size={20} />
          {isSaved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}

export default HeaderContentManager

