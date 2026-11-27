
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { MessageCircle, X, Maximize2 } from 'lucide-react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../hooks/useAuth'
import AIChatPanel from '../ai/AIChatPanel'

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-dark/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-64 h-full bg-white shadow-xl flex flex-col animate-slide-in">
            <Sidebar
              user={user}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-surface-muted">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Chat Window */}
      {showAI && (
        <div className="fixed z-[100] bottom-24 right-4 w-[calc(100vw-32px)] sm:w-[390px] h-[min(580px,75vh)] shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white">

          <div className="absolute top-3 right-3 z-10 flex gap-2">

            {/* Open Full Assistant */}
            <button
              onClick={() => {
                setShowAI(false)
                navigate('/dashboard/ai-assistant')
              }}
              className="bg-white text-slate-600 p-2 rounded-lg shadow"
              title="Open full assistant"
            >
              <Maximize2 size={17} />
            </button>

            {/* Close Chat */}
            <button
              onClick={() => setShowAI(false)}
              className="bg-white text-slate-600 p-2 rounded-lg shadow"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>

          <AIChatPanel compact />
        </div>
      )}

      {/* Floating AI Button */}
      <button
        onClick={() => setShowAI(prev => !prev)}
        className="fixed z-[99] bottom-5 right-5 flex items-center gap-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 shadow-xl transition"
      >
        {showAI ? <X size={20} /> : <MessageCircle size={20} />}

        <span className="text-sm font-semibold">
          Schoolsetup AI
        </span>
      </button>

    </div>
  )
}
