import React, { useState, useEffect } from 'react'
import { Mail, UserPlus, Trash2, Send, Users, X, Plus, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function EmailMarketingManager() {
  const [emailList, setEmailList] = useState([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [subject, setSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState(null)

  useEffect(() => {
    fetchEmailList()
  }, [])

  const fetchEmailList = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('email_marketing_list')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmailList(data || [])
      console.log('✅ Email marketing list loaded:', data?.length || 0, 'subscribers')
    } catch (error) {
      console.error('Error fetching email list:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    try {
      // Check if email already exists
      const exists = emailList.some(item => item.email.toLowerCase() === newEmail.toLowerCase())
      if (exists) {
        alert('This email is already in the marketing list')
        return
      }

      const { data, error } = await supabase
        .from('email_marketing_list')
        .insert({
          email: newEmail.toLowerCase(),
          name: newName || newEmail.split('@')[0],
          source: 'Manual',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      console.log('✅ Email added to marketing list:', newEmail)
      setEmailList([data, ...emailList])
      setNewEmail('')
      setNewName('')
    } catch (error) {
      console.error('Error adding email:', error)
      alert('Failed to add email to list')
    }
  }

  const removeEmail = async (id, email) => {
    if (!confirm(`Remove ${email} from marketing list?`)) return

    try {
      const { error } = await supabase
        .from('email_marketing_list')
        .delete()
        .eq('id', id)

      if (error) throw error

      console.log('✅ Email removed from marketing list:', email)
      setEmailList(emailList.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error removing email:', error)
      alert('Failed to remove email')
    }
  }

  const sendBulkEmail = async () => {
    if (!subject || !emailBody) {
      alert('Please enter both subject and message')
      return
    }

    if (emailList.length === 0) {
      alert('No emails in the marketing list')
      return
    }

    if (!confirm(`Send this email to ${emailList.length} subscribers?`)) {
      return
    }

    setSending(true)
    setSendStatus(null)

    try {
      console.log(`📧 Sending bulk email to ${emailList.length} subscribers...`)

      const response = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: emailList,
          subject: subject,
          message: emailBody
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to send emails')
      }

      const result = await response.json()
      console.log('✅ Bulk email sent successfully:', result)

      setSendStatus({
        type: 'success',
        message: `Successfully sent email to ${result.successCount || emailList.length} subscribers!`
      })

      // Clear form
      setSubject('')
      setEmailBody('')

      // Auto-clear status after 5 seconds
      setTimeout(() => setSendStatus(null), 5000)

    } catch (error) {
      console.error('❌ Failed to send bulk email:', error)
      setSendStatus({
        type: 'error',
        message: `Failed to send emails: ${error.message}`
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-gray-700" />
            </div>
          </div>
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Subscribers</h4>
          <p className="text-2xl font-semibold text-gray-900">{emailList.length}</p>
          <p className="text-xs text-gray-500 mt-1">Email marketing list</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Mail size={20} className="text-gray-700" />
            </div>
          </div>
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Ready to Send</h4>
          <p className="text-2xl font-semibold text-gray-900">{emailList.length}</p>
          <p className="text-xs text-gray-500 mt-1">Active subscribers</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Send size={20} className="text-gray-700" />
            </div>
          </div>
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Bulk Email</h4>
          <p className="text-2xl font-semibold text-gray-900">Ready</p>
          <p className="text-xs text-gray-500 mt-1">Compose below</p>
        </div>
      </div>

      {/* Add Email Manually */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">➕ Add Subscriber Manually</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="email"
            placeholder="Email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={addEmail}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add to List
          </button>
        </div>
      </div>

      {/* Compose Bulk Email */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">✉️ Compose Bulk Email</h3>
        
        {sendStatus && (
          <div className={`mb-4 p-4 rounded-lg border ${
            sendStatus.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="text-sm font-medium">{sendStatus.message}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Message</label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Write your message here... (HTML supported)"
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Use {`{name}`} to personalize with subscriber's name. Example: "Hi {`{name}`}, check out our new products!"
            </p>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Send to {emailList.length} subscribers</p>
              <p className="text-xs text-gray-600">This email will be sent to everyone in your marketing list</p>
            </div>
            <button
              onClick={sendBulkEmail}
              disabled={sending || !subject || !emailBody || emailList.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send size={18} className={sending ? 'animate-spin' : ''} />
              {sending ? 'Sending to All...' : 'Send to All'}
            </button>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">📋 Email Marketing List ({emailList.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600 text-sm">Loading email list...</div>
        ) : emailList.length === 0 ? (
          <div className="p-8 text-center">
            <Mail size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-sm mb-2">No subscribers yet</p>
            <p className="text-gray-500 text-xs">Add emails manually above or from the Leads page</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Added Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {emailList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{item.name || 'Unknown'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 text-sm">{item.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {item.source || 'Manual'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeEmail(item.id, item.email)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailMarketingManager

