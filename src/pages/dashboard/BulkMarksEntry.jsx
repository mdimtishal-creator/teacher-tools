import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function BulkMarksEntry() {
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [students, setStudents] = useState([])
  const [subjectsList, setSubjectsList] = useState([]) // Naya state subjects ke liye
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [examName, setExamName] = useState('Term 1')
  const [subject, setSubject] = useState('') // Selected subject
  const [maxMarks, setMaxMarks] = useState('100')
  const [marksData, setMarksData] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Students lao
    const { data: sData } = await supabase.from('students').select('id, student_name, roll_number').eq('class_id', id).order('roll_number', { ascending: true })
    if (sData) setStudents(sData)

    // Subjects lao
    const { data: subData } = await supabase.from('subjects').select('subject_name').eq('class_id', id).order('subject_name', { ascending: true })
    if (subData && subData.length > 0) {
      setSubjectsList(subData)
      setSubject(subData[0].subject_name) // Pehla subject default select karo
    }
    
    setLoading(false)
  }

  const handleMarksChange = (studentId, value) => {
    setMarksData(prev => ({ ...prev, [studentId]: value }))
  }

  const saveAllMarks = async () => {
    if (!subject) {
      alert("Please select a subject!")
      return
    }

    setSaving(true)
    
    const rowsToInsert = students
      .filter(s => marksData[s.id] !== undefined && marksData[s.id] !== '')
      .map(s => ({
        student_id: s.id,
        exam_name: examName,
        subject: subject,
        marks_obtained: Number(marksData[s.id]),
        max_marks: Number(maxMarks)
      }))

    if (rowsToInsert.length === 0) {
      alert("No marks entered!")
      setSaving(false)
      return
    }

    const { error } = await supabase.from('marks').upsert(rowsToInsert, { onConflict: 'student_id, exam_name, subject' })

    if (error) alert("Error saving: " + error.message)
    else {
      alert("All marks saved successfully!")
      setMarksData({}) 
    }
    setSaving(false)
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(`/dashboard/classes/${id}`)} className="text-gray-500 hover:text-dark font-medium">← Back</button>
        <h1 className="text-xl font-bold text-primary">Bulk Marks Entry</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
            <select value={examName} onChange={(e) => setExamName(e.target.value)} className="w-full border p-2 rounded focus:ring-primary outline-none">
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Half Yearly</option>
              <option>Term 3</option>
  <option>Term 4</option>
  <option>Final Exam</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            {/* Yahan Dropdown aayega */}
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border p-2 rounded focus:ring-primary outline-none">
              {subjectsList.length === 0 && <option value="">No subjects added</option>}
              {subjectsList.map(sub => (
                <option key={sub.subject_name} value={sub.subject_name}>{sub.subject_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
            <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} className="w-full border p-2 rounded focus:ring-primary outline-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600 w-20">Roll No</th>
                <th className="p-4 font-medium text-gray-600">Student Name</th>
                <th className="p-4 font-medium text-gray-600 w-32">Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{student.roll_number || '-'}</td>
                  <td className="p-4 font-medium text-dark">{student.student_name}</td>
                  <td className="p-2">
                    <input 
                      type="number"
                      placeholder={`/${maxMarks}`}
                      value={marksData[student.id] || ''}
                      onChange={(e) => handleMarksChange(student.id, e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded text-center focus:ring-2 focus:ring-primary outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center shadow-lg">
          <button onClick={saveAllMarks} disabled={saving} className="bg-primary text-white px-10 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-md w-full max-w-md disabled:opacity-50">
            {saving ? 'Saving Data...' : 'Save All Marks'}
          </button>
        </div>

      </main>
    </div>
  )
}
