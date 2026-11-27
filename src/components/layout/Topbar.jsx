
import { Menu } from 'lucide-react'

export default function Topbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 print:hidden">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-text-muted hover:bg-surface-hover lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-dark lg:hidden">
          Teacher Tools
        </h2>
      </div>

      <div className="flex items-center gap-4">
      </div>
    </header>
  )
}
