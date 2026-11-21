import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function DashboardHome() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user)
      else navigate('/login')
    })
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-secondary">
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Teacher Dashboard</h1>
        <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
      </nav>
      <main className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h2>
        <p className="text-gray-600">Aapka dashboard successfully load ho gaya hai!</p>
      </main>
    </div>
  )
}
