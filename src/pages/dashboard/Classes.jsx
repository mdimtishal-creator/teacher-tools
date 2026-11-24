import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, Users, BookOpen, Trash2, ArrowRight } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [newClassName, setNewClassName] = useState('')
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  
  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
      return
    }

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('class_name', { ascending: true }) 

    if (!error && data) {
      setClasses(data)
    }
    setLoading(false)
  }

  const handleAddClass = async (e) => {
    e.preventDefault()
    if (!newClassName) return
    
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('classes')
      .insert([{ class_name: newClassName, teacher_id: user.id }])

    if (error) {
      alert(error.message)
    } else {
      setNewClassName('') 
      setIsAddModalOpen(false)
      fetchClasses() 
    }
    setAdding(false)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', deleteTarget.id)

    if (!error) {
      fetchClasses()
    } else {
      alert("Error deleting class: " + error.message)
    }
    
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark tracking-tight">Classes</h1>
          <p className="text-text-muted mt-1">Manage your school classes and sections.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Class
        </Button>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border border-dashed">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-bold text-dark mb-2">No classes yet</h3>
          <p className="text-text-muted mb-6 max-w-sm mx-auto">You haven't created any classes. Add your first class to get started.</p>
          <Button onClick={() => setIsAddModalOpen(true)}>Create your first class</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <button 
                    onClick={() => setDeleteTarget(cls)}
                    className="text-text-subtle hover:text-danger hover:bg-danger-bg p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Class"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-dark mb-1">{cls.class_name}</h3>
                <p className="text-sm text-text-muted">Manage students & subjects</p>
              </div>
              
              <div className="border-t border-border p-4 bg-surface-muted rounded-b-xl flex justify-between items-center group-hover:bg-primary-50 transition-colors">
                <span className="text-sm font-semibold text-primary-700">View Details</span>
                <Link 
                  to={`/dashboard/classes/${cls.id}`} 
                  className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shadow-sm group-hover:border-primary-200"
                >
                  <ArrowRight className="w-4 h-4 text-primary-600" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Add New Class</h2>
            <form onSubmit={handleAddClass} className="space-y-4">
              <Input
                label="Class Name"
                placeholder="e.g. Class 8-A"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                required
                autoFocus
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={adding}>
                  Save Class
                </Button>
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
        title={`Delete ${deleteTarget?.class_name}?`}
        message="Are you sure you want to delete this class? All students and marks associated with this class might also be affected."
        confirmText="Delete Class"
        loading={deleting}
      />

    </div>
  )
}
