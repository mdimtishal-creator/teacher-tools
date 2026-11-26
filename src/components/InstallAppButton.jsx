import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import Button from './ui/Button'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Agar app pehle se install hai (standalone mode), toh button mat dikhao
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true)
    }

    // Browser ka install prompt catch karo
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Agar Chrome ne permission di hai, toh direct install popup kholo
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setIsInstalled(true)
      }
    } else {
      // Agar Chrome ne block kiya hai, toh bada popup mat kholo, bas chhota sa alert dikhao
      alert("To install the app:\n\n1. Tap the 3 dots (⋮) at the top right of your browser.\n2. Select 'Add to Home screen' or 'Install app'.")
    }
  }

  if (isInstalled) return null

  return (
    <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 shadow-sm gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-lg shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-dark text-sm">Install Teacher Tools App</h3>
          <p className="text-xs text-text-muted mt-0.5">Add to your home screen for quick access.</p>
        </div>
      </div>
      <Button onClick={handleInstallClick} size="sm" className="w-full sm:w-auto shrink-0">
        Install App
      </Button>
    </div>
  )
}
