import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Account created! You can now log in.' })
        setIsSignUp(false) 
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        navigate('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-surface-muted">
      {/* Left Side - Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 items-center justify-center p-12">
        {/* Abstract Pattern Background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
        
        <div className="relative z-10 max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8 shadow-lg border border-white/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            The modern way to manage your school.
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed mb-12">
            Empowering Indian teachers with free, professional tools to save hours of manual work.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Report Cards', desc: 'A4 print-ready' },
              { label: 'Bulk Marks', desc: 'Fast entry' },
              { label: 'School Branding', desc: 'Logo & name' },
              { label: 'Free Forever', desc: 'No hidden fees' },
            ].map((f) => (
              <div key={f.label} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <p className="text-white font-semibold text-sm">{f.label}</p>
                <p className="text-primary-100 text-xs mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-dark tracking-tight">Teacher Tools</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-dark tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-text-muted">
              {isSignUp ? 'Start managing your school in seconds.' : 'Sign in to continue to your dashboard.'}
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium flex items-start gap-2 ${
              message.type === 'error' ? 'bg-danger-bg text-danger border border-red-100' : 'bg-success-bg text-success border border-green-100'
            }`}>
              <span className="shrink-0 mt-0.5">{message.type === 'error' ? '⚠' : '✓'}</span>
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-subtle" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg text-dark placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  placeholder="teacher@school.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-subtle" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg text-dark placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-base"
            >
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-sm text-text-muted">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage({ type: '', text: '' }) }}
              className="ml-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
