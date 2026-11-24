import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function DashboardHome() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check karo ki teacher login hai ya nahi
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Teacher Tools</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">{user?.email}</span>
          <button onClick={handleLogout} className="text-red-500 font-medium hover:bg-red-50 px-3 py-1 rounded transition">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <h2 className="text-3xl font-bold text-dark mb-2">Welcome Back!</h2>
        <p className="text-gray-600 mb-8">Manage your classes, students, and marksheets here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Classes */}
          <Link to="/dashboard/classes" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
            <h3 className="text-xl font-bold text-primary mb-2">My Classes</h3>
            <p className="text-gray-600">Add new classes and manage your students.</p>
          </Link>

          {/* Card 2: Exams & Marks (YE NAYA ADD HUA HAI) */}
          <Link to="/dashboard/exams" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
            <h3 className="text-xl font-bold text-green-600 mb-2">Exams & Marks</h3>
            <p className="text-gray-600">Enter subject-wise marks for your classes.</p>
          </Link>

          {/* Card 3: Report Cards */}
<Link to="/dashboard/report-cards" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
  <h3 className="text-xl font-bold text-purple-600 mb-2">Report Cards</h3>
  <p className="text-gray-600">View and print student marksheets.</p>
</Link>
          {/* Card 4: Settings */}
<Link to="/dashboard/settings" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
  <h3 className="text-xl font-bold text-orange-500 mb-2">School Settings</h3>
  <p className="text-gray-600">Set your school name, logo, and principal details.</p>
</Link>

          {/* Card 5 : Attendance (Coming Soon) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 opacity-60">
            <h3 className="text-xl font-bold text-gray-500 mb-2">Attendance</h3>
            <p className="text-gray-400">Coming soon...</p>
          </div>

        </div>
      </main>
    </div>
  )
}
