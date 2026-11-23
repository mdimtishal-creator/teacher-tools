import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ClassDetails() {
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [students, setStudents] = useState([])
  const [newStudentName, setNewStudentName] = useState('')
  const [newRollNo, setNewRollNo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_id', id)
      .order('roll_number', { ascending: true })

    if (error) console.log(error)
    else setStudents(data)
    
    setLoading(false)
  }

  const addStudent = async (e) => {
    e.preventDefault()
    if (!newStudentName) return

    const { error } = await supabase
      .from('students')
      .insert([{ class_id: id, student_name: newStudentName, roll_number: newRollNo }])

    if (error) {
      alert(error.message)
    } else {
      setNewStudentName('')
      setNewRollNo('')
      fetchStudents() 
    }
  }

  // NAYA FUNCTION: Student Delete Karne Ke Liye
  const deleteStudent = async (studentId, studentName) => {
    // Pehle confirm karo taaki galti se delete na ho
    const confirmDelete = window.confirm(`Are you sure you want to delete ${studentName}?`)
    if (!confirmDelete) return

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId)

    if (error) {
      alert("Error deleting: " + error.message)
    } else {
      fetchStudents() // Delete hone ke baad list refresh karo
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
              Add
            </button>
          </form>
        </div>

        {/* Students List Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600">Roll No</th>
                <th className="p-4 font-medium text-gray-600">Student Name</th>
                <th className="p-4 font-medium text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{student.roll_number || '-'}</td>
                  <td className="p-4 font-medium text-dark">{student.student_name}</td>
                  
                  {/* Delete Button */}
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => deleteStudent(student.id, student.student_name)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm bg-red-50 px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    No students added yet.
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
