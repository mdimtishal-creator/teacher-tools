import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [newClassName, setNewClassName] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Page load hote hi purani classes fetch karo
  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
      return
    }

    // Database se classes lao
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
    } else {
      setClasses(data)
    }
    setLoading(false)
  }

  // Nayi class add karo
  const addClass = async (e) => {
    e.preventDefault()
    if (!newClassName) return

    const { data: { user } } = await supabase.auth.getUser()
    
    // Database me save karo
    const { error } = await supabase
      .from('classes')
      .insert([{ class_name: newClassName, teacher_id: user.id }])

    if (error) {
      alert(error.message)
    } else {
      setNewClassName('') // Input clear karo
      fetchClasses() // List refresh karo
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading classes...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-dark font-medium">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-primary">My Classes</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {/* Add Class Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-dark mb-4">Add New Class</h2>
          <form onSubmit={addClass} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="e.g. Class 8-A" 
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Add Class
            </button>
          </form>
        </div>

        {/* Classes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
  <Link to={`/dashboard/classes/${cls.id}`} key={cls.id} className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
    <h3 className="font-bold text-xl text-primary mb-2">{cls.class_name}</h3>
    <p className="text-sm text-gray-500">Click to view students →</p>
  </Link>
))}
          {classes.length === 0 && (
            <p className="text-gray-500 col-span-2 text-center py-10">No classes added yet. Add your first class above!</p>
          )}
        </div>
      </main>
    </div>
  )
}
