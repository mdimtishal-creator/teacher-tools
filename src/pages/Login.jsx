import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, KeyRound, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  
  // 'signin' | 'signup' | 'verify_otp' | 'forgot' | 'reset'
  const [view, setView] = useState('signin') 
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')

  // 1. SIGN IN
  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage({ type: 'error', text: error.message })
    else navigate('/dashboard')
    
    setLoading(false)
  }

  // 2. SIGN UP (Account banega, phir OTP verification hoga)
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { shouldCreateUser: true }
    })
    
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      // Account ban gaya, ab OTP bhejte hain verification ke liye
      await supabase.auth.signInWithOtp({ email })
      setMessage({ type: 'success', text: 'Verification code sent to your email.' })
      setView('verify_otp')
    }
    setLoading(false)
  }

  // 3. VERIFY OTP (Sign up ke baad)
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })
    
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
    
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      // User verify ho gaya aur login bhi ho gaya
      navigate('/dashboard')
    }
    setLoading(false)
  }

  // 4. FORGOT PASSWORD (Email par reset code/link bhejna)
  const handleForgot = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })
    
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password reset link sent to your email.' })
      setView('reset')
    }
    setLoading(false)
  }

  // 5. RESET PASSWORD (Naya password set karna)
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })
    
    // Isme OTP code aur naya password dono lagta hai (Secure tarika)
    const { error } = await supabase.auth.verifyOtp({ 
      email, 
      token: otp, 
      type: 'recovery' 
    }).then(async ({ error }) => {
      if (error) return { error }
      // Agar OTP sahi hai, toh password update karo
      return await supabase.auth.updateUser({ password })
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password updated! You can now sign in.' })
      setView('signin')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-surface-muted">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8 shadow-lg border border-white/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">The modern way to manage your school.</h1>
          <p className="text-primary-100 text-lg leading-relaxed mb-12">Empowering Indian teachers with free, professional tools to save hours of manual work.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-dark tracking-tight">Teacher Tools</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-dark tracking-tight">
              {view === 'signin' && 'Welcome back'}
              {view === 'signup' && 'Create your account'}
              {view === 'verify_otp' && 'Verify your email'}
              {view === 'forgot' && 'Forgot password?'}
              {view === 'reset' && 'Reset password'}
            </h2>
            <p className="mt-2 text-text-muted">
              {view === 'signin' && 'Sign in to continue to your dashboard.'}
              {view === 'signup' && 'Start managing your school in seconds.'}
              {view === 'verify_otp' && `We sent a code to ${email}`}
              {view === 'forgot' && 'Enter your email to receive a reset code.'}
              {view === 'reset' && 'Enter the code and your new password.'}
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium flex items-start gap-2 ${
              message.type === 'error' ? 'bg-danger-bg text-danger border border-red-100' : 'bg-success-bg text-success border border-green-100'
            }`}>
              <span>{message.type === 'error' ? '⚠' : '✓'}</span>
              {message.text}
            </div>
          )}

          {/* SIGN IN FORM */}
          {view === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-text-subtle" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="teacher@school.com" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-dark">Password</label>
                  <button type="button" onClick={() => setView('forgot')} className="text-sm font-semibold text-primary-600 hover:text-primary-700">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-subtle" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="••••••••" />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full py-3 text-base">Sign in</Button>
              <p className="text-center text-sm text-text-muted">
                Don't have an account? <button type="button" onClick={() => { setView('signup'); setMessage({type:'', text:''}) }} className="font-semibold text-primary-600 hover:text-primary-700">Sign up</button>
              </p>
            </form>
          )}

          {/* SIGN UP FORM */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-text-subtle" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="teacher@school.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-subtle" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Create a password" />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full py-3 text-base">Create account</Button>
              <p className="text-center text-sm text-text-muted">
                Already have an account? <button type="button" onClick={() => { setView('signin'); setMessage({type:'', text:''}) }} className="font-semibold text-primary-600 hover:text-primary-700">Sign in</button>
              </p>
            </form>
          )}

          {/* VERIFY OTP FORM */}
          {view === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">6-digit Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-text-subtle" />
                  <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg text-center tracking-widest text-xl font-bold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="123456" />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full py-3 text-base">Verify Email</Button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-text-subtle" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="teacher@school.com" />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full py-3 text-base">Send Reset Code</Button>
              <button type="button" onClick={() => setView('signin')} className="w-full text-center text-sm font-medium text-text-muted hover:text-dark flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>
            </form>
          )}

          {/* RESET PASSWORD FORM */}
          {view === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">6-digit Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-text-subtle" />
                  <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg text-center tracking-widest text-xl font-bold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="123456" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-subtle" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="New password" />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full py-3 text-base">Update Password</Button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
