import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
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
        setMessage({ type: 'success', text: 'Login successful! Dashboard coming next...' })
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          
          <div>
            <h2 className="text-center text-3xl font-extrabold text-dark">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {isSignUp ? 'Join to manage your school easily' : 'Sign in to your teacher account'}
            </p>
          </div>

          {message.text && (
            <div className={`p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="teacher@school.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage({ type: '', text: '' }) }}
              className="text-sm font-medium text-primary hover:text-blue-800"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Teacher Tools</h1>
          <p className="text-xl text-blue-100 max-w-md mx-auto leading-relaxed">
            Empowering Indian teachers with free, professional tools to save hours of manual work.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 text-blue-200">
            <span className="px-4 py-2 border border-blue-400 rounded-full text-sm bg-blue-800/50">Report Cards</span>
            <span className="px-4 py-2 border border-blue-400 rounded-full text-sm bg-blue-800/50">Attendance</span>
            <span className="px-4 py-2 border border-blue-400 rounded-full text-sm bg-blue-800/50">Free Templates</span>
          </div>
        </div>
      </div>
    </div>
  )
}
