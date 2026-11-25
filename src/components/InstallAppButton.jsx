import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import Button from './ui/Button'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 1. Check karo ki app pehle se install hai ya nahi
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true)
    }

    // 2. Browser se prompt catch karo
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    // Agar browser ne prompt ready rakha hai
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setIsInstalled(true)
      }
    } else {
      // Agar prompt ready nahi hai, toh thoda wait karke instructions dikhao
      setShowInstructions(true)
    }
  }

  // Agar app pehle se install hai, toh button mat dikhao
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

      {/* Manual Instructions Modal (Agar direct install trigger na ho) */}
      {showInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm" onClick={() => setShowInstructions(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 text-gray-400 hover:text-dark">
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-primary-600" />
            </div>
            
            <h2 className="text-xl font-bold text-dark mb-2">Almost there!</h2>
            <p className="text-sm text-text-muted mb-4">Follow these steps to install the app manually:</p>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="bg-surface-muted p-3 rounded-lg border border-border">
                <p className="font-bold text-dark mb-1">For Android (Chrome):</p>
                <p>1. Tap the <strong>3 dots (⋮)</strong> at the top right.</p>
                <p>2. Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</p>
              </div>
              
              <div className="bg-surface-muted p-3 rounded-lg border border-border">
                <p className="font-bold text-dark mb-1">For iPhone (Safari):</p>
                <p>1. Tap the <strong>Share</strong> icon at the bottom.</p>
                <p>2. Scroll down and select <strong>"Add to Home Screen"</strong>.</p>
              </div>
            </div>

            <Button onClick={() => setShowInstructions(false)} className="w-full mt-6">
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
