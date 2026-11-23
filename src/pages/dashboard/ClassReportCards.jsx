import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, useParams, Link } from 'react-router-dom'

export default function ClassReportCards() {
  const { id } = useParams() // Class ID
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').eq('class_id', id).order('roll_number', { ascending: true })
    if (data) setStudents(data)
    setLoading(false)
  }

  if (loading) return <div className="p-10 text-center">Loading students...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/report-cards')} className="text-gray-500 hover:text-dark font-medium">← Back</button>
        <h1 className="text-xl font-bold text-purple-600">Select Student</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600 w-20">Roll No</th>
                <th className="p-4 font-medium text-gray-600">Student Name</th>
                <th className="p-4 font-medium text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{student.roll_number || '-'}</td>
                  <td className="p-4 font-medium text-dark">{student.student_name}</td>
                  <td className="p-4 text-right">
                    <Link 
                      to={`/dashboard/student/${student.id}`} 
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-200 transition"
                    >
                      Generate Report Card
                    </Link>
                  </td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No students in this class.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
