import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function StudentMarks() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  
  const [student, setStudent] = useState(null)
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // 1. Student ki detail lao
    const { data: sData } = await supabase.from('students').select('*').eq('id', studentId).single()
    if (sData) setStudent(sData)

    // 2. Student ke saare marks lao
    const { data: mData } = await supabase.from('marks').select('*').eq('student_id', studentId).order('exam_name', { ascending: true }).order('subject', { ascending: true })
    if (mData) setMarks(mData)
    
    setLoading(false)
  }

  // Grade nikalne ka function
  const getGrade = (percent) => {
    if (percent >= 90) return 'A+'
    if (percent >= 80) return 'A'
    if (percent >= 70) return 'B'
    if (percent >= 60) return 'C'
    if (percent >= 50) return 'D'
    return 'F'
  }

  if (loading) return <div className="p-10 text-center">Loading Marksheet...</div>
  if (!student) return <div className="p-10 text-center">Student not found</div>

  // Calculate Totals
  const totalObtained = marks.reduce((sum, item) => sum + item.marks_obtained, 0)
  const totalMax = marks.reduce((sum, item) => sum + item.max_marks, 0)
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Navbar (Print me nahi dikhega) */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-dark font-medium">
          ← Back
        </button>
        <button 
          onClick={() => window.print()} 
          className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
        >
          🖨️ Print / Save PDF
        </button>
      </nav>

      <main className="max-w-3xl mx-auto p-4 md:p-6 mt-6">
        {/* Report Card Paper */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
            <h1 className="text-3xl font-extrabold text-dark uppercase tracking-wide">Student Report Card</h1>
            <p className="text-gray-500 text-sm mt-1">Generated via Teacher Tools</p>
          </div>

          {/* Student Info */}
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 bg-gray-50 p-4 rounded-lg print:bg-white print:p-0">
            <div>
              <p className="text-lg"><span className="font-bold text-gray-700">Name:</span> <span className="font-semibold text-primary">{student.student_name}</span></p>
              <p className="text-md mt-1"><span className="font-bold text-gray-700">Roll No:</span> {student.roll_number || 'N/A'}</p>
            </div>
            <div className="md:text-right">
              <p className="text-md"><span className="font-bold text-gray-700">Date:</span> {new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white print:bg-gray-200 print:text-black">
                  <th className="p-3 border border-gray-300 font-semibold">Exam</th>
                  <th className="p-3 border border-gray-300 font-semibold">Subject</th>
                  <th className="p-3 border border-gray-300 font-semibold text-right">Max Marks</th>
                  <th className="p-3 border border-gray-300 font-semibold text-right">Obtained</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="p-3 border border-gray-200 text-sm">{m.exam_name}</td>
                    <td className="p-3 border border-gray-200 font-medium text-dark">{m.subject}</td>
                    <td className="p-3 border border-gray-200 text-right text-gray-600">{m.max_marks}</td>
                    <td className="p-3 border border-gray-200 text-right font-bold text-primary">{m.marks_obtained}</td>
                  </tr>
                ))}
                {marks.length === 0 && (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500">No marks entered for this student yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Result Summary */}
          {marks.length > 0 && (
            <div className="mt-8 flex justify-end">
              <div className="border-2 border-primary rounded-xl p-6 w-full md:w-72 bg-blue-50 print:bg-white">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 font-medium">Total Marks:</span>
                  <span className="font-bold text-dark">{totalObtained} / {totalMax}</span>
                </div>
                <div className="flex justify-between mb-2 border-b border-gray-300 pb-2">
                  <span className="text-gray-600 font-medium">Percentage:</span>
                  <span className="font-bold text-primary">{percentage}%</span>
                </div>
                <div className="flex justify-between mt-2 items-center">
                  <span className="text-gray-600 font-bold uppercase">Grade:</span>
                  <span className="font-extrabold text-2xl text-dark bg-white px-3 py-1 rounded shadow-sm print:shadow-none print:border">{getGrade(percentage)}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
