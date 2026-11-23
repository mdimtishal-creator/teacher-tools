import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ClassDetails() {
  const { id } = useParams() // URL se class ID mili
  const navigate = useNavigate()
  
  const [students, setStudents] = useState([])
  const [newStudentName, setNewStudentName] = useState('')
  const [newRollNo, setNewRollNo] = useState('')
  const [loading, setLoading] = useState(true)

  // Page load hote hi students fetch karo
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_id', id) // Sirf is class ke students
      .order('roll_number', { ascending: true })

    if (error) {
      console.log(error)
    } else {
      setStudents(data)
    }
    setLoading(false)
  }

  // Naya student add karo
  const addStudent = async (e) => {
    e.preventDefault()
    if (!newStudentName) return

    const { error } = await supabase
      .from('students')
      .insert([{ 
        class_id: id, 
        student_name: newStudentName,
        roll_number: newRollNo 
      }])

    if (error) {
      alert(error.message)
    } else {
      setNewStudentName('')
      setNewRollNo('')
      fetchStudents() // List refresh karo
    }
  }

  if (loading) return <div className="p-10 text-center">Loading students...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/classes')} className="text-gray-500 hover:text-dark font-medium">
          ← Back to Classes
        </button>
        <h1 className="text-xl font-bold text-primary">Class Details</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        
        {/* Add Student Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-dark mb-4">Add New Student</h2>
          <form onSubmit={addStudent} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Student Name" 
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input 
              type="text" 
              placeholder="Roll No (Optional)" 
              value={newRollNo}
              onChange={(e) => setNewRollNo(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Add Student
            </button>
          </form>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600">Roll No</th>
                <th className="p-4 font-medium text-gray-600">Student Name</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{student.roll_number || '-'}</td>
                  <td className="p-4 font-medium text-dark">{student.student_name}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="2" className="p-8 text-center text-gray-500">
                    No students added yet. Add your first student above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}
