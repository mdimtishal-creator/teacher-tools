import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, KeyRound, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('email') // 'email' ya 'otp'
  const [message, setMessage] = useState({ type: '', text: '' })

  // Step 1: Email par OTP bhejo
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Agar naya user hai toh automatically account bana do
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'OTP code sent to your email!' })
      setStep('otp')
    }
    setLoading(false)
  }

  // Step 2: OTP verify karo aur login karo
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-surface-muted">
      {/* Left Branding Panel (same as before) */}
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
              {step === 'email' ? 'Welcome' : 'Enter OTP'}
            </h2>
            <p className="mt-2 text-text-muted">
              {step === 'email' 
                ? 'Enter your email to receive a login code.' 
                : `We sent a code to ${email}`}
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

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
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
              <Button type="submit" loading={loading} className="w-full py-3 text-base">
                Send Login Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">6-digit OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-text-subtle" />
                  </div>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg text-dark text-center tracking-widest text-xl font-bold placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    placeholder="123456"
                  />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full py-3 text-base">
                Verify & Sign In
              </Button>
              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(''); setMessage({ type: '', text: '' }); }}
                className="w-full flex items-center justify-center gap-2 text-sm text-text-muted hover:text-dark transition"
              >
                <ArrowLeft className="w-4 h-4" /> Change email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
