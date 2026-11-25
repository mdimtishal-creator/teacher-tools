import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import Button from './ui/Button'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Agar browser ne support kiya toh direct prompt kholo
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else {
      // Agar direct prompt nahi hai, toh manual instructions dikhao
      setShowInstructions(true)
    }
  }

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

      {/* Manual Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm" onClick={() => setShowInstructions(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 text-gray-400 hover:text-dark">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-dark mb-4">Install App</h2>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-bold text-dark mb-1">For Android (Chrome):</p>
                <p>1. Tap the <strong>3 dots (⋮)</strong> at the top right.</p>
                <p>2. Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-bold text-dark mb-1">For iPhone (Safari):</p>
                <p>1. Tap the <strong>Share</strong> button at the bottom.</p>
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
