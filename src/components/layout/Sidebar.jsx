import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Settings, BookOpen, LogOut, GraduationCap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Sidebar({ user, onClose }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Classes', path: '/dashboard/classes', icon: Users },
    { name: 'Exams & Marks', path: '/dashboard/exams', icon: BookOpen },
    { name: 'Report Cards', path: '/dashboard/report-cards', icon: FileText },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-dark tracking-tight">Teacher Tools</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-text-muted hover:bg-surface-hover hover:text-dark'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase">
            {user?.email?.charAt(0) || 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-danger hover:bg-danger-bg transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
