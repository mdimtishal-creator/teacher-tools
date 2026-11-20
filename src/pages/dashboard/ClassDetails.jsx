import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useParams, useNavigate } from 'react-router-dom'

export default function ClassDetails() {
  const { id } = useParams() // URL se class ki ID nikalna
  const [students, setStudents] = useState([])
  const [newStudentName, setNewStudentName] = useState('')
  const [newRollNumber, setNewRollNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudents()
  }, [id])

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
      .insert([{ 
        student_name: newStudentName, 
        roll_number: newRollNumber,
        class_id: id 
      }])

    if (error) {
      alert(error.message)
    } else {
      setNewStudentName('')
      setNewRollNumber('')
      fetchStudents() 
    }
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/dashboard/classes')} className="text-primary mb-4 hover:underline">
        ← Back to Classes
      </button>
      
      <h1 className="text-2xl font-bold mb-6 text-dark">Manage Students</h1>

      <form onSubmit={addStudent} className="mb-8 flex flex-col md:flex-row gap-2">
        <input 
          type="text" placeholder="Student Name" value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          className="border p-2 rounded w-full focus:outline-primary" required
        />
        <input 
          type="text" placeholder="Roll No. (Optional)" value={newRollNumber}
          onChange={(e) => setNewRollNumber(e.target.value)}
          className="border p-2 rounded w-full md:w-32 focus:outline-primary"
        />
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700">
          Add Student
        </button>
      </form>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Roll No</th>
              <th className="p-4 font-semibold text-gray-600">Student Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">{student.roll_number || '-'}</td>
                <td className="p-4 font-medium">{student.student_name}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="2" className="p-4 text-center text-gray-500">No students added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
