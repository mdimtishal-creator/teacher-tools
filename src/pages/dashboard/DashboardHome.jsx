import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  Users, BookOpen, FileText, Settings, 
  GraduationCap, ArrowRight, Activity, CheckCircle2 
} from 'lucide-react'
import InstallAppButton from '../../components/InstallAppButton' // 👈 Ye nayi line add hui hai

export default function DashboardHome() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ classes: 0, students: 0, subjects: 0, marks: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. User fetch karo
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setUser(user)

        // 2. Stats fetch karo
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

  // User ke email se naam nikaalna (e.g., "rahul@gmail.com" -> "Rahul")
  const userName = user?.email ? user.email.split('@')[0] : 'Teacher'
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1)

  const statCards = [
    { title: 'Total Classes', value: stats.classes, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Students', value: stats.students, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Subjects', value: stats.subjects, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Marks Entered', value: stats.marks, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  const quickActions = [
    { title: 'Manage Classes', desc: 'Add or view your classes', icon: Users, link: '/dashboard/classes', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'Enter Marks', desc: 'Bulk marks entry for students', icon: FileText, link: '/dashboard/exams', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { title: 'Report Cards', desc: 'Generate & print student reports', icon: GraduationCap, link: '/dashboard/report-cards', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { title: 'School Settings', desc: 'Update school name & logo', icon: Settings, link: '/dashboard/settings', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Install App Button - Ye sirf tab dikhega jab install ho sakta ho */}
      <InstallAppButton /> 

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-10 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {capitalizedName}! 👋</h1>
          <p className="text-primary-100 text-lg max-w-xl">
            Here is a quick overview of your school's activity. Manage classes, students, and marks all in one place.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-lg font-bold text-dark mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-card border border-border shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">{stat.title}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                ) : (
                  <h3 className="text-3xl font-extrabold text-dark">{stat.value}</h3>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, idx) => (
            <Link 
              key={idx} 
              to={action.link}
              className={`flex items-center p-6 rounded-xl border ${action.color} hover:shadow-md transition-all group`}
            >
              <div className="p-3 bg-white rounded-lg shadow-sm mr-5">
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{action.title}</h3>
                <p className="text-sm opacity-80 mt-0.5">{action.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started Checklist */}
      <div className="bg-white rounded-card border border-border p-6 md:p-8 shadow-card">
        <h2 className="text-lg font-bold text-dark mb-6">Getting Started</h2>
        <div className="space-y-4">
          <ChecklistItem 
            title="Create your first class" 
            completed={stats.classes > 0} 
            link="/dashboard/classes"
          />
          <ChecklistItem 
            title="Add students to your class" 
            completed={stats.students > 0} 
            link="/dashboard/classes"
          />
          <ChecklistItem 
            title="Manage subjects for your class" 
            completed={stats.subjects > 0} 
            link="/dashboard/classes"
          />
          <ChecklistItem 
            title="Enter marks for your students" 
            completed={stats.marks > 0} 
            link="/dashboard/exams"
          />
        </div>
      </div>

    </div>
  )
}

function ChecklistItem({ title, completed, link }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          completed ? 'bg-success text-white' : 'bg-gray-100 text-gray-400'
        }`}>
          {completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
        </div>
        <span className={`text-sm font-medium ${completed ? 'text-text-muted line-through' : 'text-dark'}`}>
          {title}
        </span>
      </div>
      {!completed && (
        <Link to={link} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Do this now →
        </Link>
      )}
    </div>
  )
}
