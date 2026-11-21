import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const navigate = useNavigate()

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
        setIsSignUp(false) // Wapas login pe bhej do
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
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      {/* Top Left Logo/Home Button */}
      <div className="absolute top-6 left-6">
        <button onClick={() => navigate('/')} className="text-primary font-bold text-xl hover:opacity-80">
          ← Teacher Tools
        </button>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-sm">
            {isSignUp ? 'Join to manage your classes easily.' : 'Log in to access your dashboard.'}
          </p>
        </div>
        
        {/* Error/Success Message */}
        {message.text && (
          <div className={`p-3 rounded mb-4 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="teacher@school.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 shadow-md"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setMessage({type:'', text:''}) }} 
              className="ml-1 text-primary font-semibold hover:underline"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
