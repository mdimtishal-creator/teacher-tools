import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ClassDetails() {
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [newStudentName, setNewStudentName] = useState('')
  const [newRollNo, setNewRollNo] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Students lao
    const { data: sData } = await supabase.from('students').select('*').eq('class_id', id).order('roll_number', { ascending: true })
    if (sData) setStudents(sData)

    // Subjects lao
    const { data: subData } = await supabase.from('subjects').select('*').eq('class_id', id).order('subject_name', { ascending: true })
    if (subData) setSubjects(subData)
    
    setLoading(false)
  }

  // --- Student Functions ---
  const addStudent = async (e) => {
    e.preventDefault()
    if (!newStudentName) return
    const { error } = await supabase.from('students').insert([{ class_id: id, student_name: newStudentName, roll_number: newRollNo }])
    if (!error) {
      setNewStudentName('')
      setNewRollNo('')
      fetchData() 
    }
  }

  const deleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Delete ${studentName}?`)) return
    await supabase.from('students').delete().eq('id', studentId)
    fetchData()
  }

  // --- Subject Functions ---
  const addSubject = async (e) => {
    e.preventDefault()
    if (!newSubject) return
    const { error } = await supabase.from('subjects').insert([{ class_id: id, subject_name: newSubject }])
    if (error) {
      if(error.code === '23505') alert("Subject already exists!")
      else alert(error.message)
    } else {
      setNewSubject('')
      fetchData()
    }
  }

  const deleteSubject = async (subjectId) => {
    if (!window.confirm(`Delete this subject? All marks for this subject will be lost.`)) return
    await supabase.from('subjects').delete().eq('id', subjectId)
    fetchData()
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/classes')} className="text-gray-500 hover:text-dark font-medium">← Back</button>
        <h1 className="text-xl font-bold text-primary">Class Details</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        
        {/* Marks Entry Shortcut */}
        <button onClick={() => navigate(`/dashboard/classes/${id}/marks`)} className="w-full bg-blue-50 text-primary border border-blue-200 p-4 rounded-xl font-bold mb-8 hover:bg-blue-100 transition flex justify-between items-center">
          <span>📝 Enter Subject Marks (Bulk Entry)</span>
          <span>→</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Add Student Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-dark mb-4">Add New Student</h2>
            <form onSubmit={addStudent} className="flex flex-col gap-3">
              <input type="text" placeholder="Student Name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="border p-2 rounded focus:ring-primary outline-none" required />
              <input type="text" placeholder="Roll No (Optional)" value={newRollNo} onChange={(e) => setNewRollNo(e.target.value)} className="border p-2 rounded focus:ring-primary outline-none" />
              <button type="submit" className="bg-primary text-white py-2 rounded font-medium hover:bg-blue-700">Add Student</button>
            </form>
          </div>

          {/* Add Subject Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-dark mb-4">Manage Subjects</h2>
            <form onSubmit={addSubject} className="flex gap-2 mb-4">
              <input type="text" placeholder="e.g. Maths" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="border p-2 rounded w-full focus:ring-primary outline-none" required />
              <button type="submit" className="bg-gray-800 text-white px-4 rounded font-medium hover:bg-gray-900">Add</button>
            </form>
            <div className="flex flex-wrap gap-2">
              {subjects.map(sub => (
                <span key={sub.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {sub.subject_name}
                  <button onClick={() => deleteSubject(sub.id)} className="text-red-500 font-bold hover:text-red-700">×</button>
                </span>
              ))}
              {subjects.length === 0 && <p className="text-sm text-gray-500">No subjects added yet.</p>}
            </div>
          </div>
        </div>

        {/* Students List Table */}
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
                  <td className="p-4 font-medium text-dark">
                    <Link to={`/dashboard/student/${student.id}`} className="text-primary hover:underline">{student.student_name}</Link>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteStudent(student.id, student.student_name)} className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No students added yet.</td></tr>}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}
