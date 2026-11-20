import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [newClassName, setNewClassName] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Data fetch karna jab page khule
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
      .order('created_at', { ascending: false })

    if (error) console.log(error)
    else setClasses(data)
    
    setLoading(false)
  }

  // Nayi class add karna
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
      fetchClasses() // List ko refresh karo
    }
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/dashboard')} className="text-primary mb-4 hover:underline">
        ← Back to Dashboard
      </button>
      
      <h1 className="text-2xl font-bold mb-6 text-dark">My Classes</h1>

      {/* Add Class Form */}
      <form onSubmit={addClass} className="mb-8 flex gap-2">
        <input 
          type="text" 
          placeholder="e.g. Class 8-A" 
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          className="border p-2 rounded w-full max-w-sm focus:outline-primary"
        />
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700">
          Add
        </button>
      </form>

      {/* Class List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded shadow border">
            <h3 className="font-bold text-lg text-primary">{cls.class_name}</h3>
            <button 
              onClick={() => navigate(`/dashboard/classes/${cls.id}`)}
              className="text-sm text-blue-600 hover:underline mt-2 block"
            >
              View Students →
            </button>
          </div>
        ))}
        {classes.length === 0 && <p className="text-gray-500">No classes added yet. Add your first class above!</p>}
      </div>
    </div>
  )
}
