import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function ExamsHome() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
      return
    }

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('class_name', { ascending: true })

    if (error) console.log(error)
    else setClasses(data)
    
    setLoading(false)
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading classes...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-dark font-medium">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-primary">Exams & Marks Entry</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 border border-blue-100">
          <p className="text-sm font-medium">Select a class below to enter subject-wise marks for your students.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <Link to={`/dashboard/classes/${cls.id}/marks`} key={cls.id} className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="font-bold text-xl text-primary mb-2">{cls.class_name}</h3>
              <p className="text-sm text-gray-500">Click to enter marks →</p>
            </Link>
          ))}
          {classes.length === 0 && (
            <p className="text-gray-500 col-span-2 text-center py-10">No classes found. Please add a class first.</p>
          )}
        </div>
      </main>
    </div>
  )
}
