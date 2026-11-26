
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Plus, Users, BookOpen, Trash2, ArrowRight,
  Search, GraduationCap, Layers3, Sparkles,
  School, X, ArrowUpRight
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [newClassName, setNewClassName] = useState('')
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredClasses = classes.filter(cls =>
    cls.class_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const themes = [
    { bg: 'from-blue-600 to-indigo-700', soft: 'bg-blue-50', text: 'text-blue-600', border: 'group-hover:border-blue-200' },
    { bg: 'from-violet-600 to-purple-700', soft: 'bg-violet-50', text: 'text-violet-600', border: 'group-hover:border-violet-200' },
    { bg: 'from-emerald-500 to-teal-700', soft: 'bg-emerald-50', text: 'text-emerald-600', border: 'group-hover:border-emerald-200' },
    { bg: 'from-orange-500 to-amber-600', soft: 'bg-orange-50', text: 'text-orange-600', border: 'group-hover:border-orange-200' },
    { bg: 'from-pink-500 to-rose-600', soft: 'bg-pink-50', text: 'text-pink-600', border: 'group-hover:border-pink-200' },
    { bg: 'from-cyan-500 to-blue-600', soft: 'bg-cyan-50', text: 'text-cyan-600', border: 'group-hover:border-cyan-200' },
  ]

  return (
    <div className="min-h-full bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Premium Header */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#111E3C] p-6 text-white shadow-xl shadow-blue-950/10 sm:p-9">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1D3768] via-[#14264A] to-[#101A32]" />
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-28 right-28 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wider text-blue-100">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                ACADEMIC MANAGEMENT
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Manage Your
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Classes
                </span>
              </h1>
              <p className="mt-3 text-sm leading-6 text-blue-100/75 sm:text-base">
                Organise your classrooms, manage students and keep every academic record in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <School className="h-6 w-6 text-cyan-200" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold">{classes.length}</p>
                  <p className="text-xs text-blue-100/70">Total Classes</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#172C55] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <Plus className="h-5 w-5" />
                Add New Class
              </button>
            </div>
          </div>
        </section>

        {/* Section Heading and Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              <Layers3 className="h-4 w-4" />
              Your Academic Structure
            </div>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900">
              All Classes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a class to manage its students and subjects.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search classes..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-52 animate-pulse rounded-2xl border border-slate-100 bg-white">
                <div className="h-24 rounded-t-2xl bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="overflow-hidden rounded-[28px] border border-dashed border-slate-300 bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-xl font-extrabold text-slate-900">Your classrooms start here</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              You haven't created any classes yet. Create your first class to start organising students and subjects.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Create First Class
            </button>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <Search className="mx-auto h-9 w-9 text-slate-300" />
            <h3 className="mt-3 font-bold text-slate-800">No matching classes</h3>
            <p className="mt-1 text-sm text-slate-500">Try another class name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredClasses.map((cls, index) => {
              const theme = themes[index % themes.length]
              return (
                <div
                  key={cls.id}
                  className={`group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.border}`}
                >
                  <div className={`relative overflow-hidden bg-gradient-to-br ${theme.bg} p-5`}>
                    <div className="absolute -right-7 -top-10 h-32 w-32 rounded-full border-[18px] border-white/10" />
                    <div className="relative flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur">
                        <BookOpen className="h-7 w-7 text-white" />
                      </div>
                      <button
                        onClick={() => setDeleteTarget(cls)}
                        className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-white/80 opacity-100 transition hover:bg-red-500 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                        title="Delete Class"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative mt-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                        CLASSROOM
                      </p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                        {cls.class_name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.soft} ${theme.text}`}>
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Manage students & subjects</span>
                    </div>

                    <Link
                      to={`/dashboard/classes/${cls.id}`}
                      className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition group-hover:border-blue-100 group-hover:bg-blue-50"
                    >
                      <span className="text-sm font-bold text-slate-700 transition group-hover:text-blue-700">
                        Open Class
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm transition group-hover:translate-x-1">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom Summary */}
        {!loading && classes.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Academic Overview</p>
                <p className="text-xs text-slate-500">
                  Showing {filteredClasses.length} of {classes.length} classes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Your class records are ready
            </div>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => !adding && setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1D3768] to-[#101A32] p-6 text-white">
              <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[18px] border-white/10" />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-extrabold">Add New Class</h2>
                  <p className="mt-1 text-sm text-blue-100/75">Create a classroom in your school.</p>
                </div>
                <button
                  type="button"
                  onClick={() => !adding && setIsAddModalOpen(false)}
                  className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddClass} className="space-y-5 p-6">
              <Input
                label="Class Name"
                placeholder="e.g. Class 8-A"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                required
                autoFocus
              />
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={adding}>
                  <Plus className="h-4 w-4" />
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
