import { useState, useEffect } from 'react'
import { Download, X, Smartphone, MoreVertical } from 'lucide-react'
import Button from './ui/Button'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true)
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setIsInstalled(true)
      }
    } else {
      // Agar Chrome direct install allow nahi kar raha, toh apna premium popup kholo
      setShowInstructions(true)
    }
  }

  if (isInstalled) return null

  return (
    <>
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

      {/* Premium Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm" onClick={() => setShowInstructions(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md p-6 sm:animate-in sm:fade-in sm:zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary-600" />
              </div>
              <button onClick={() => setShowInstructions(false)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-dark mb-2">Install App</h2>
            <p className="text-sm text-text-muted mb-6">Follow these simple steps to install the app on your phone:</p>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-dark">1</div>
                <p className="text-sm text-dark">Tap the <strong>3 dots</strong> <MoreVertical className="inline w-4 h-4" /> at the top right of your browser.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-dark">2</div>
                <p className="text-sm text-dark">Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> from the menu.</p>
              </div>
            </div>

            <Button onClick={() => setShowInstructions(false)} className="w-full mt-8">
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
