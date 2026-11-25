import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Building2, User, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

export default function Settings() {
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
    if (!user) return

    const { data } = await supabase
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
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark tracking-tight">School Settings</h1>
        <p className="text-text-muted mt-1">Manage your school's identity. These details will appear on report cards.</p>
      </div>

      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
          message.type === 'error' ? 'bg-danger-bg text-danger border border-red-100' : 'bg-success-bg text-success border border-green-100'
        }`}>
          {message.type === 'error' ? '⚠' : <CheckCircle2 className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form - 2 columns */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-dark flex items-center gap-2 border-b border-border pb-2">
                  <Building2 className="w-5 h-5 text-primary-600" /> School Identity
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">School Name</label>
                  <input
                    type="text"
                    name="school_name"
                    value={formData.school_name}
                    onChange={handleChange}
                    placeholder="e.g. Delhi Public School"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Principal Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-text-subtle" />
                    </div>
                    <input
                      type="text"
                      name="principal_name"
                      value={formData.principal_name}
                      onChange={handleChange}
                      placeholder="e.g. Mrs. Sharma"
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-dark flex items-center gap-2 border-b border-border pb-2">
                  <ImageIcon className="w-5 h-5 text-primary-600" /> Branding
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">School Logo URL</label>
                  <input
                    type="url"
                    name="school_logo_url"
                    value={formData.school_logo_url}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  />
                  <p className="text-xs text-text-muted mt-1.5">Paste a direct link to your image (PNG/JPG).</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <Button type="submit" loading={saving} className="min-w-[150px]">
                  Save Settings
                </Button>
              </div>

            </form>
          </Card>
        </div>

        {/* Live Preview - 1 column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Live Preview</h3>
            <div className="bg-white rounded-xl shadow-card border border-border p-6 text-center">
              {formData.school_logo_url ? (
                <img 
                  src={formData.school_logo_url} 
                  alt="Logo Preview" 
                  className="h-20 mx-auto object-contain mb-4"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/200x200/f1f5f9/94a3b8?text=Invalid+URL"
                  }}
                />
              ) : (
                <div className="w-20 h-20 mx-auto bg-surface-muted rounded-full flex items-center justify-center mb-4 border border-border border-dashed">
                  <ImageIcon className="w-8 h-8 text-text-subtle" />
                </div>
              )}
              <h4 className="font-bold text-dark text-lg">{formData.school_name || 'Your School Name'}</h4>
              <p className="text-sm text-text-muted mt-1">{formData.principal_name || 'Principal Name'}</p>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-text-subtle">This is how your header will look on report cards.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
