
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Users, BookOpen, FileText, Settings,
  GraduationCap, ArrowUpRight, Activity,
  CheckCircle2, Sparkles, Layers3,
  ClipboardCheck, ChevronRight, Zap,
  Target, School
} from 'lucide-react'

export default function DashboardHome() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ classes: 0, students: 0, subjects: 0, marks: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setUser(user)

        const { count: classesCount } = await supabase.from('classes').select('*', { count: 'exact', head: true })
        const { count: studentsCount } = await supabase.from('students').select('*', { count: 'exact', head: true })
        const { count: subjectsCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true })
        const { count: marksCount } = await supabase.from('marks').select('*', { count: 'exact', head: true })

        setStats({
          classes: classesCount || 0,
          students: studentsCount || 0,
          subjects: subjectsCount || 0,
          marks: marksCount || 0
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const userName = user?.email ? user.email.split('@')[0] : 'Teacher'
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1)

  const statCards = [
    { title: 'Total Classes', value: stats.classes, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', accent: 'bg-blue-500', note: 'Classes created' },
    { title: 'Total Students', value: stats.students, icon: GraduationCap, color: 'text-violet-600', bg: 'bg-violet-50', accent: 'bg-violet-500', note: 'Students enrolled' },
    { title: 'Total Subjects', value: stats.subjects, icon: BookOpen, color: 'text-cyan-600', bg: 'bg-cyan-50', accent: 'bg-cyan-500', note: 'Subjects managed' },
    { title: 'Marks Entered', value: stats.marks, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', accent: 'bg-orange-500', note: 'Records saved' },
  ]

  const quickActions = [
    { title: 'Manage Classes', desc: 'Organise classes and students', icon: Users, link: '/dashboard/classes', theme: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-200' },
    { title: 'Enter Marks', desc: 'Fast bulk marks entry', icon: ClipboardCheck, link: '/dashboard/exams', theme: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200' },
    { title: 'Report Cards', desc: 'Create and print student reports', icon: GraduationCap, link: '/dashboard/report-cards', theme: 'from-violet-600 to-purple-600', shadow: 'shadow-violet-200' },
    { title: 'School Settings', desc: 'Customise your school details', icon: Settings, link: '/dashboard/settings', theme: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-200' },
  ]

  const checklist = [
    { title: 'Create your first class', completed: stats.classes > 0, link: '/dashboard/classes' },
    { title: 'Add students to your class', completed: stats.students > 0, link: '/dashboard/classes' },
    { title: 'Manage subjects for your class', completed: stats.subjects > 0, link: '/dashboard/classes' },
    { title: 'Enter marks for your students', completed: stats.marks > 0, link: '/dashboard/exams' },
  ]

  const completedSteps = checklist.filter(item => item.completed).length
  const progress = (completedSteps / checklist.length) * 100

  return (
    <div className="min-h-full bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-7">

        {/* Premium Welcome Banner */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#101D3A] text-white shadow-xl shadow-blue-950/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#172C55] via-[#142344] to-[#10182F]" />
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border-[40px] border-blue-400/10" />
          <div className="absolute right-20 -bottom-36 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute right-[30%] top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 p-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between lg:p-11">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                YOUR SCHOOL WORKSPACE
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Welcome back,
                <span className="block mt-1 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {capitalizedName}!
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/75 sm:text-base">
                Everything your school needs, organised in one place.
                Manage classes, track student records and make your work easier.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/dashboard/classes" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#172C55] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50">
                  <School className="h-4 w-4" />
                  Manage School
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link to="/dashboard/report-cards" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  View Report Cards
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="hidden min-w-[190px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.07] p-7 text-center backdrop-blur-md sm:flex lg:mr-5">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-blue-500/30">
                <GraduationCap className="h-9 w-9 text-white" />
              </div>
              <p className="text-sm font-semibold text-white">Teacher Tools</p>
              <p className="mt-1 text-xs text-blue-200/70">Smart School Management</p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Workspace Active
              </div>
            </div>
          </div>
        </section>

        {/* Overview Heading */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              <Activity className="h-4 w-4" />
              Dashboard Overview
            </div>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900">Your School at a Glance</h2>
            <p className="mt-1 text-sm text-slate-500">A quick look at your school's records and activity.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-500 shadow-sm">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Live Overview
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
              <div className={`absolute left-0 top-0 h-1 w-full ${stat.accent} opacity-80`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
                  {loading ? (
                    <div className="mt-3 h-10 w-20 animate-pulse rounded-lg bg-slate-100" />
                  ) : (
                    <h3 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">{stat.value}</h3>
                  )}
                  <p className="mt-2 text-xs font-medium text-slate-400">{stat.note}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full w-2/3 rounded-full ${stat.accent} opacity-60`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                <Zap className="h-4 w-4" />
                Get Things Done
              </div>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900">Quick Actions</h2>
              <p className="mt-1 text-sm text-slate-500">Jump straight into your daily tasks.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl sm:p-5"
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${action.theme} text-white shadow-lg ${action.shadow} transition-transform duration-300 group-hover:scale-105`}>
                  <action.icon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 transition-colors group-hover:text-blue-700">{action.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{action.desc}</p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-blue-50 group-hover:text-blue-600">
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                <Target className="h-4 w-4" />
                Setup Progress
              </div>
              <h2 className="mt-1.5 text-xl font-extrabold text-slate-900">Getting Started</h2>
              <p className="mt-1 text-sm text-slate-500">Complete these steps to organise your school.</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `conic-gradient(#10b981 ${progress}%, #e2e8f0 0)` }}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-extrabold text-slate-800">
                  {Math.round(progress)}%
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{completedSteps} of 4 completed</p>
                <p className="text-xs text-slate-500">Your setup progress</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 p-4 sm:p-6">
            {checklist.map((item, idx) => (
              <ChecklistItem
                key={idx}
                title={item.title}
                completed={item.completed}
                link={item.link}
              />
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <div className="flex flex-col items-center justify-center gap-2 pb-2 text-center sm:flex-row">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Layers3 className="h-3.5 w-3.5" />
            Teacher Tools Workspace
          </div>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <p className="text-xs text-slate-400">Made to make school management simpler.</p>
        </div>

      </div>
    </div>
  )
}

function ChecklistItem({ title, completed, link }) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-slate-50 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          completed
            ? 'bg-emerald-100 text-emerald-600'
            : 'border-2 border-slate-200 bg-white text-slate-300'
        }`}>
          {completed
            ? <CheckCircle2 className="h-4 w-4" />
            : <span className="h-2 w-2 rounded-full bg-current" />
          }
        </div>
        <span className={`text-sm font-semibold ${
          completed ? 'text-slate-400 line-through' : 'text-slate-700'
        }`}>
          {title}
        </span>
      </div>
      {!completed && (
        <Link to={link} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700">
          Do this now
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}
