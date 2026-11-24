import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    school_name: '',
    school_logo_url: '',
    principal_name: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return navigate('/login')

    const { data, error } = await supabase
      .from('school_settings')
      .select('*')
      .eq('teacher_id', user.id)
      .single()

    if (data) {
      setFormData({
        school_name: data.school_name || '',
        school_logo_url: data.school_logo_url || '',
        principal_name: data.principal_name || ''
      })
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    const { data: { user } } = await supabase.auth.getUser()

    // Upsert ka matlab: Agar pehle se data hai to Update karo, warna Naya Insert karo
    const { error } = await supabase
      .from('school_settings')
      .upsert({
        teacher_id: user.id,
        school_name: formData.school_name,
        school_logo_url: formData.school_logo_url,
        principal_name: formData.principal_name
      }, { onConflict: 'teacher_id' })

    if (error) {
      setMessage({ type: 'error', text: 'Error saving: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'School details saved successfully!' })
    }
    setSaving(false)
  }

  if (loading) return <div className="p-10 text-center">Loading settings...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-dark font-medium">← Back</button>
        <h1 className="text-xl font-bold text-primary">School Settings</h1>
      </nav>

      <main className="max-w-2xl mx-auto p-6 mt-6">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-dark mb-6">Setup Your School Identity</h2>
          <p className="text-gray-600 mb-6 text-sm">Ye details aapke Report Cards par automatic print hongi.</p>

          {message.text && (
            <div className={`p-3 rounded text-sm mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input
                type="text"
                name="school_name"
                value={formData.school_name}
                onChange={handleChange}
                placeholder="e.g. Delhi Public School"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
              <input
                type="text"
                name="principal_name"
                value={formData.principal_name}
                onChange={handleChange}
                placeholder="e.g. Mrs. Sharma"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Logo URL (Optional)</label>
              <input
                type="url"
                name="school_logo_url"
                value={formData.school_logo_url}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Abhi ke liye image ka link paste karein. Baad mein upload feature add karenge.</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
