
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, KeyRound, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()

  // Views: 'signin' | 'signup' | 'verify_otp' | 'forgot' | 'reset'
  const [view, setView] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // 1. SIGN UP
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Account created! Check your email for the verification code.' })
      setView('verify_otp')
    }
    setLoading(false)
  }

  // 2. VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup'
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  // 3. SIGN IN
  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  // 4. FORGOT PASSWORD
  const handleForgot = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password reset code sent to your email.' })
      setView('reset')
    }
    setLoading(false)
  }

  // 5. RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage({ type: '', text: '' })

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'recovery'
    })

    if (verifyError) {
      setMessage({ type: 'error', text: verifyError.message })
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })

    if (updateError) {
      setMessage({ type: 'error', text: updateError.message })
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully! Please sign in.' })
      setView('signin')
      setPassword('')
    }
    setLoading(false)
  }

  const fieldClass = "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
  const labelClass = "block text-sm font-semibold text-slate-700 mb-2"

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* LEFT BRANDING PANEL */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 items-center justify-center p-12">

        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}
        />

        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 max-w-lg w-full">

          <div className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center shadow-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Teacher Tools</h2>
              <p className="text-blue-200 text-xs tracking-widest uppercase mt-1">Smart School Management</p>
            </div>
          </div>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-blue-100 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Designed for modern educators
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-6">
              Teaching made
              <span className="block text-blue-300">simpler.</span>
            </h1>

            <p className="text-blue-100/80 text-lg leading-relaxed max-w-md">
              Spend less time on paperwork and more time doing what matters most — teaching.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Professional student report cards',
              'Quick and easy bulk marks entry',
              'Organised class and student records'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-blue-50">
                <div className="w-6 h-6 rounded-full bg-emerald-400/15 border border-emerald-300/30 flex items-center justify-center text-emerald-300 text-sm">
                  ✓
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-6 border-t border-white/15">
            <p className="text-blue-200/60 text-xs">
              A smarter workspace for teachers and schools.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[440px]">

          {/* MOBILE BRAND */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-9">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Tools</h1>
              <p className="text-xs text-slate-500">Smart School Management</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/60 p-6 sm:p-9">

            {/* FORM HEADING */}
            <div className="mb-8">
              <div className="hidden lg:flex w-12 h-12 rounded-xl bg-blue-50 items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6 text-blue-700" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {view === 'signin' && 'Welcome back'}
                {view === 'signup' && 'Create account'}
                {view === 'verify_otp' && 'Verify your email'}
                {view === 'forgot' && 'Forgot password?'}
                {view === 'reset' && 'Set new password'}
              </h2>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {view === 'signin' && 'Sign in to continue to your dashboard.'}
                {view === 'signup' && 'Create your account and get started.'}
                {view === 'verify_otp' && `We sent a code to ${email}`}
                {view === 'forgot' && 'Enter your email to receive a reset code.'}
                {view === 'reset' && 'Enter the code and your new password.'}
              </p>
            </div>

            {/* MESSAGE */}
            {message.text && (
              <div className={`mb-6 px-4 py-3.5 rounded-xl text-sm font-medium flex items-start gap-2 ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                <span className="font-bold">{message.type === 'error' ? '⚠' : '✓'}</span>
                <span>{message.text}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {view === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-5">

                <div>
                  <label className={labelClass}>Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={fieldClass}
                      placeholder="teacher@school.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setMessage({type:'', text:''}) }}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={fieldClass}
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full py-3.5 text-base rounded-xl shadow-lg shadow-blue-600/20">
                  Sign in
                </Button>

                <p className="text-center text-sm text-slate-500 pt-2">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('signup'); setMessage({type:'', text:''}) }}
                    className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Create account
                  </button>
                </p>
              </form>
            )}

            {/* SIGN UP FORM */}
            {view === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-5">

                <div>
                  <label className={labelClass}>Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={fieldClass}
                      placeholder="teacher@school.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={fieldClass}
                      placeholder="Create a strong password"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full py-3.5 text-base rounded-xl shadow-lg shadow-blue-600/20">
                  Create account
                </Button>

                <p className="text-center text-sm text-slate-500 pt-2">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('signin'); setMessage({type:'', text:''}) }}
                    className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}

            {/* VERIFY OTP FORM */}
            {view === 'verify_otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className={labelClass}>Verification code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={8}
                      className={`${fieldClass} text-center tracking-[0.3em] text-xl font-bold`}
                      placeholder="12345678"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full py-3.5 text-base rounded-xl">
                  Verify email
                </Button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {view === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className={labelClass}>Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={fieldClass}
                      placeholder="teacher@school.com"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full py-3.5 text-base rounded-xl">
                  Send reset code
                </Button>

                <button
                  type="button"
                  onClick={() => { setView('signin'); setMessage({type:'', text:''}) }}
                  className="w-full text-center text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors flex items-center justify-center gap-2 py-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </button>
              </form>
            )}

            {/* RESET PASSWORD FORM */}
            {view === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-5">

                <div>
                  <label className={labelClass}>Verification code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={8}
                      className={`${fieldClass} text-center tracking-[0.3em] text-xl font-bold`}
                      placeholder="12345678"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>New password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={fieldClass}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full py-3.5 text-base rounded-xl">
                  Update password
                </Button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Teacher Tools · Smart School Management
          </p>

        </div>
      </div>
    </div>
  )
}
