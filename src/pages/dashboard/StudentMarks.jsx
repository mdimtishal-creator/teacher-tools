import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Printer } from 'lucide-react'
import Button from '../../components/ui/Button'
import ReportCardDocument from '../../components/domain/ReportCardDocument'

export default function StudentMarks() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  
  const [student, setStudent] = useState(null)
  const [marks, setMarks] = useState([])
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [studentId])

  const fetchData = async () => {
    setLoading(true)
    
    // 1. Student fetch karo
    const { data: sData, error: sError } = await supabase
      .from('students')
      .select('*, classes(class_name)')
      .eq('id', studentId)
      .single()
      
    if (sData) {
      setStudent({
        ...sData,
        class_name: sData.classes?.class_name || ''
      })
    }

    // 2. Marks fetch karo
    const { data: mData } = await supabase
      .from('marks')
      .select('*')
      .eq('student_id', studentId)
    if (mData) setMarks(mData)

    // 3. School Settings fetch karo
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: settingsData } = await supabase
        .from('school_settings')
        .select('*')
        .eq('teacher_id', user.id)
        .single()
      
      if (settingsData) setSchoolInfo(settingsData)
    }
    
    setLoading(false)
  }

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
  }
  if (!student) {
    return <div className="p-10 text-center text-text-muted">Student not found</div>
  }

  // --- Calculations (BILKUL SAME AS BEFORE) ---
  const uniqueSubjects = [...new Set(marks.map(m => m.subject))]
  const examsList = ['Term 1', 'Term 2', 'Half Yearly', 'Term 3', 'Term 4', 'Final Exam']
  
  const gridData = uniqueSubjects.map(sub => {
    const subMarks = {}
    examsList.forEach(exam => {
      const record = marks.find(m => m.subject === sub && m.exam_name === exam)
      if (record) subMarks[exam] = record
    })
    return { subject: sub, marks: subMarks }
  })

  const calculateColumnTotal = (examName) => {
    let obt = 0, max = 0
    gridData.forEach(row => {
      if (row.marks[examName]) {
        obt += Number(row.marks[examName].marks_obtained)
        max += Number(row.marks[examName].max_marks)
      }
    })
    return { obt, max, percent: max > 0 ? ((obt/max)*100).toFixed(1) : 0 }
  }

  const t1 = calculateColumnTotal('Term 1')
  const t2 = calculateColumnTotal('Term 2')
  const hy = calculateColumnTotal('Half Yearly')
  const t3 = calculateColumnTotal('Term 3')
  const t4 = calculateColumnTotal('Term 4')
  const final = calculateColumnTotal('Final Exam')

  const group1Total = { obt: t1.obt + t2.obt + hy.obt, max: t1.max + t2.max + hy.max }
  const group1Percent = group1Total.max > 0 ? ((group1Total.obt / group1Total.max) * 100).toFixed(2) : 0

  const group2Total = { obt: t3.obt + t4.obt + final.obt, max: t3.max + t4.max + final.max }
  const group2Percent = group2Total.max > 0 ? ((group2Total.obt / group2Total.max) * 100).toFixed(2) : 0

  const overallTotal = { obt: group1Total.obt + group2Total.obt, max: group1Total.max + group2Total.max }
  const overallPercent = overallTotal.max > 0 ? ((overallTotal.obt / overallTotal.max) * 100).toFixed(2) : 0

  const getGrade = (percent) => {
    if (percent >= 90) return 'A+'
    if (percent >= 80) return 'A'
    if (percent >= 70) return 'B'
    if (percent >= 60) return 'C'
    if (percent >= 50) return 'D'
    return 'F'
  }
  // ------------------------------------------

  const totals = {
    t1, t2, hy, t3, t4, final, 
    group1Total, group1Percent, 
    group2Total, group2Percent, 
    overallTotal, overallPercent
  }

  return (
    <div className="pb-20 print:pb-0">
      
      {/* Screen Header & Actions (Print mein nahi dikhega) */}
      <div className="bg-white border-b border-border sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-dark transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <Button onClick={() => window.print()} className="bg-dark hover:bg-gray-800">
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Main Document Area */}
      <div className="max-w-[210mm] mx-auto mt-6 print:mt-0 print:max-w-none">
        <ReportCardDocument 
          student={student} 
          schoolInfo={schoolInfo} 
          marks={marks} 
          gridData={gridData} 
          totals={totals} 
          getGrade={getGrade} 
        />
      </div>

    </div>
  )
}
