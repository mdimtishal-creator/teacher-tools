import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import Button from './ui/Button'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      // Browser ko rok rahe hain taaki hum apna button dikha sakein
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  if (!isVisible) return null

  return (
    <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl flex items-center justify-between mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-lg">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-dark text-sm">Install Teacher Tools</h3>
          <p className="text-xs text-text-muted">Add to your home screen for quick access.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleInstall} size="sm">Install</Button>
        <button onClick={() => setIsVisible(false)} className="text-text-subtle hover:text-dark">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
