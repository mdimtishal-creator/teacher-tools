import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [newClassName, setNewClassName] = useState('')
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

    // CHANGE 1: Ab data class_name ke hisaab se sort hoga (A to Z)
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('class_name', { ascending: true }) 

    if (error) {
      console.log(error)
    } else {
      setClasses(data)
    }
    setLoading(false)
  }

  const addClass = async (e) => {
    e.preventDefault()
    if (!newClassName) return
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('classes')
      .insert([{ class_name: newClassName, teacher_id: user.id }])

    if (error) {
      alert(error.message)
    } else {
      setNewClassName('') 
      fetchClasses() 
    }
  }

  // CHANGE 2: Class Delete Karne Ka Function
  const deleteClass = async (classId, className) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${className}"? All students in this class will also be deleted.`)
    if (!confirmDelete) return

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)

    if (error) {
      alert("Error: " + error.message)
    } else {
      fetchClasses() // Delete hone ke baad list refresh karo
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
        <div className="grid grid-cols-1 gap-4">
          {classes.map((cls) => (
            // CHANGE 3: Card ko Link se Div me badla taaki button click aur link click alag ho sake
            <div key={cls.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
              
              <Link to={`/dashboard/classes/${cls.id}`} className="flex-1 cursor-pointer hover:opacity-80">
                <h3 className="font-bold text-xl text-primary mb-1">{cls.class_name}</h3>
                <p className="text-sm text-gray-500">Click to view students →</p>
              </Link>

              <button 
                onClick={() => deleteClass(cls.id, cls.class_name)}
                className="text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium text-sm transition ml-4"
              >
                Delete
              </button>
            </div>
          ))}
          {classes.length === 0 && (
            <p className="text-gray-500 text-center py-10">No classes added yet. Add your first class above!</p>
          )}
        </div>
      </main>
    </div>
  )
}
