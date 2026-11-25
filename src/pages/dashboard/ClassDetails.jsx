import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, BookOpen, Users, ArrowRight, Trash2, ArrowLeft } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import StudentTable from '../../components/domain/StudentTable'

export default function ClassDetails() {
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [className, setClassName] = useState('Class Details')
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Active Tab
  const [activeTab, setActiveTab] = useState('students')

  // Add Student State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [newStudentName, setNewStudentName] = useState('')
  const [newRollNo, setNewRollNo] = useState('')
  const [savingStudent, setSavingStudent] = useState(false)

  // Add Subject State
  const [newSubject, setNewSubject] = useState('')
  const [savingSubject, setSavingSubject] = useState(false)

  // Delete State (Student/Subject)
  const [deleteTarget, setDeleteTarget] = useState(null) // { type: 'student' | 'subject', data: object }
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    
    // 1. Class Name fetch karo
    const { data: classData } = await supabase.from('classes').select('class_name').eq('id', id).single()
    if (classData) setClassName(classData.class_name)

    // 2. Students fetch karo
    const { data: sData } = await supabase.from('students').select('*').eq('class_id', id).order('roll_number', { ascending: true })
    if (sData) setStudents(sData)

    // 3. Subjects fetch karo
    const { data: subData } = await supabase.from('subjects').select('*').eq('class_id', id).order('subject_name', { ascending: true })
    if (subData) setSubjects(subData)
    
    setLoading(false)
  }

  // --- Add Student ---
  const handleAddStudent = async (e) => {
    e.preventDefault()
    if (!newStudentName) return
    
    setSavingStudent(true)
    const { error } = await supabase.from('students').insert([{ 
      class_id: id, 
      student_name: newStudentName, 
      roll_number: newRollNo 
    }])

    if (!error) {
      setNewStudentName('')
      setNewRollNo('')
      setIsAddStudentOpen(false)
      fetchData() 
    } else {
      alert(error.message)
    }
    setSavingStudent(false)
  }

  // --- Add Subject ---
  const handleAddSubject = async (e) => {
    e.preventDefault()
    if (!newSubject) return
    
    setSavingSubject(true)
    const { error } = await supabase.from('subjects').insert([{ class_id: id, subject_name: newSubject }])

    if (error) {
      if(error.code === '23505') alert("Subject already exists!")
      else alert(error.message)
    } else {
      setNewSubject('')
      fetchData()
    }
    setSavingSubject(false)
  }

  // --- Delete ---
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    if (deleteTarget.type === 'student') {
      await supabase.from('students').delete().eq('id', deleteTarget.data.id)
    } else if (deleteTarget.type === 'subject') {
      await supabase.from('subjects').delete().eq('id', deleteTarget.data.id)
    }

    await fetchData()
    setDeleting(false)
    setDeleteTarget(null)
  }

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div></div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/dashboard/classes')} 
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-dark mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark tracking-tight">{className}</h1>
            <p className="text-text-muted mt-1">Manage students and subjects for this class.</p>
          </div>
          
          <Button onClick={() => navigate(`/dashboard/classes/${id}/marks`)} className="shrink-0 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/30">
            <FileTextIcon />
            Enter Bulk Marks
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'students' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-dark'
          }`}
        >
          <Users className="w-4 h-4" /> Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'subjects' ? 'border-primary-600 text-primary-600' : 'border-transparent text-text-muted hover:text-dark'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Subjects ({subjects.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-dark">Student List</h2>
            <Button onClick={() => setIsAddStudentOpen(true)} size="sm">
              <Plus className="w-4 h-4" /> Add Student
            </Button>
          </div>
          <StudentTable 
            students={students} 
            onDelete={(student) => setDeleteTarget({ type: 'student', data: student })} 
          />
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-dark">Subject List</h2>
            <form onSubmit={handleAddSubject} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Mathematics"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 w-48"
                required
              />
              <Button type="submit" size="sm" loading={savingSubject}>
                Add
              </Button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-border shadow-card">
            {subjects.length === 0 ? (
              <p className="text-center text-text-muted py-4">No subjects added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {subjects.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2 bg-surface-muted border border-border px-4 py-2 rounded-full group">
                    <span className="font-semibold text-dark text-sm">{sub.subject_name}</span>
                    <button 
                      onClick={() => setDeleteTarget({ type: 'subject', data: sub })}
                      className="text-text-subtle hover:text-danger opacity-50 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm" onClick={() => setIsAddStudentOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <Input
                label="Student Name"
                placeholder="e.g. Rahul Sharma"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                required
                autoFocus
              />
              <Input
                label="Roll Number (Optional)"
                placeholder="e.g. 15"
                value={newRollNo}
                onChange={(e) => setNewRollNo(e.target.value)}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
                <Button type="submit" loading={savingStudent}>Save Student</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={deleteTarget?.type === 'student' ? `Delete ${deleteTarget.data.student_name}?` : `Delete Subject?`}
        message={deleteTarget?.type === 'student' ? "This student and their marks will be permanently deleted." : "Are you sure? All marks for this subject will be lost."}
        confirmText="Delete"
        loading={deleting}
      />

    </div>
  )
}

// Chhota sa icon component jo button mein use hua hai
function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  )
}
