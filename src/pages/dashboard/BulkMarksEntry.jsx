import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import MarksGrid from '../../components/domain/MarksGrid'

const EXAMS = ['Term 1', 'Term 2', 'Half Yearly', 'Term 3', 'Term 4', 'Final Exam']

export default function BulkMarksEntry() {
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [className, setClassName] = useState('Class')
  const [students, setStudents] = useState([])
  const [subjectsList, setSubjectsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fetchingMarks, setFetchingMarks] = useState(false)
  
  const [examName, setExamName] = useState('Term 1')
  const [subject, setSubject] = useState('')
  const [maxMarks, setMaxMarks] = useState('100')
  const [marksData, setMarksData] = useState({})
  
  // Unsaved changes track karne ke liye
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  // Jab bhi Exam ya Subject change ho, purane marks fetch karo
  useEffect(() => {
    if (subject && students.length > 0) {
      fetchExistingMarks()
    }
  }, [examName, subject, students])

  const fetchData = async () => {
    setLoading(true)
    
    // Class Name fetch karo
    const { data: classData } = await supabase.from('classes').select('class_name').eq('id', id).single()
    if (classData) setClassName(classData.class_name)

    // Students fetch karo
    const { data: sData } = await supabase.from('students').select('id, student_name, roll_number').eq('class_id', id).order('roll_number', { ascending: true })
    if (sData) setStudents(sData)

    // Subjects fetch karo
    const { data: subData } = await supabase.from('subjects').select('subject_name').eq('class_id', id).order('subject_name', { ascending: true })
    if (subData && subData.length > 0) {
      setSubjectsList(subData)
      setSubject(subData[0].subject_name)
    }
    setLoading(false)
  }

  const fetchExistingMarks = async () => {
    setFetchingMarks(true)
    setHasUnsavedChanges(false) // Reset on exam/subject change
    
    const studentIds = students.map(s => s.id)
    const { data, error } = await supabase
      .from('marks')
      .select('student_id, marks_obtained, max_marks')
      .eq('exam_name', examName)
      .eq('subject', subject)
      .in('student_id', studentIds)

    if (!error && data) {
      const newMarksData = {}
      data.forEach(m => {
        newMarksData[m.student_id] = m.marks_obtained
        if (m.max_marks) setMaxMarks(m.max_marks.toString()) 
      })
      setMarksData(newMarksData)
    } else {
      setMarksData({}) 
    }
    setFetchingMarks(false)
  }

  const handleMarksChange = (studentId, value) => {
    setMarksData(prev => ({ ...prev, [studentId]: value }))
    setHasUnsavedChanges(true)
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to leave?")) return
    }
    navigate(`/dashboard/classes/${id}`)
  }

  const saveAllMarks = async () => {
    if (!subject) { alert("Please select a subject!"); return }

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
      alert("No marks entered!"); setSaving(false); return
    }

    const { error } = await supabase.from('marks').upsert(rowsToInsert, { onConflict: 'student_id, exam_name, subject' })

    if (error) {
      alert("Error saving: " + error.message)
    } else {
      setHasUnsavedChanges(false)
      // Success toast ke bajaye simple alert, agle stage mein toast aayega
      alert("All marks saved successfully!") 
    }
    
    setSaving(false)
  }

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
  }

  // Kitne students ke marks bhare hain
  const enteredCount = Object.values(marksData).filter(v => v !== '').length

  return (
    <div className="pb-24">
      {/* Sticky Header & Controls */}
      <div className="bg-white border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleBack} className="p-2 rounded-lg text-text-muted hover:bg-surface-hover hover:text-dark transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-dark">Bulk Marks Entry</h1>
              <p className="text-sm text-text-muted">{className}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select 
              label="Exam"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              options={EXAMS}
            />
            <Select 
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              options={subjectsList.map(s => s.subject_name)}
              disabled={subjectsList.length === 0}
            />
            <Input 
              label="Max Marks"
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {subjectsList.length === 0 ? (
           <div className="bg-warning-bg text-warning p-4 rounded-xl flex items-start gap-3 border border-amber-200">
             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
             <div>
               <h3 className="font-bold">No subjects found</h3>
               <p className="text-sm mt-1">You need to add subjects to this class before entering marks.</p>
               <Button variant="secondary" size="sm" className="mt-3 bg-white" onClick={() => navigate(`/dashboard/classes/${id}`)}>
                 Go to Class Details
               </Button>
             </div>
           </div>
        ) : (
          <MarksGrid 
            students={students}
            marksData={marksData}
            maxMarks={maxMarks}
            onMarksChange={handleMarksChange}
            fetchingMarks={fetchingMarks}
          />
        )}
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-border p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="text-sm hidden sm:block">
            {hasUnsavedChanges ? (
              <span className="text-warning font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span> 
                Unsaved changes
              </span>
            ) : (
              <span className="text-text-muted">
                {enteredCount} of {students.length} students entered
              </span>
            )}
          </div>
          
          <Button 
            onClick={saveAllMarks} 
            disabled={saving || fetchingMarks || subjectsList.length === 0} 
            loading={saving}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {!saving && <Save className="w-4 h-4" />}
            Save Marks
          </Button>
        </div>
      </div>

    </div>
  )
}
