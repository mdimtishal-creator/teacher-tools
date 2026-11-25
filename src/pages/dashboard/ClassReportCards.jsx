import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, FileText } from 'lucide-react'

export default function ClassReportCards() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [id])

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').eq('class_id', id).order('roll_number', { ascending: true })
    if (data) setStudents(data)
    setLoading(false)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/dashboard/report-cards')} 
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-dark mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Report Cards
        </button>
        <h1 className="text-2xl font-bold text-dark tracking-tight">Select Student</h1>
        <p className="text-text-muted mt-1">Choose a student to generate their report card.</p>
      </div>

      {loading ? (
        <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-muted border-b border-border">
                  <th className="p-4 font-semibold text-text-muted text-sm w-24">Roll No</th>
                  <th className="p-4 font-semibold text-text-muted text-sm">Student Name</th>
                  <th className="p-4 font-semibold text-text-muted text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="p-4 text-text-muted font-medium">
                      {student.roll_number || '-'}
                    </td>
                    <td className="p-4 font-bold text-dark">
                      {student.student_name}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/dashboard/student/${student.id}`} 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-bold hover:bg-purple-100 transition"
                      >
                        <FileText className="w-4 h-4" />
                        Generate Report Card
                      </Link>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-12 text-center text-text-muted">
                      No students found in this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
