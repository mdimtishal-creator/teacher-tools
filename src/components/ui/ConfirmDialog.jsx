import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Delete",
  loading = false
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-danger-bg flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark">{title}</h3>
            <p className="text-sm text-text-muted mt-1">{message}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
