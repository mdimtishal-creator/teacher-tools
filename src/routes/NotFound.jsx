import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-muted p-6 text-center">
      <h1 className="text-6xl font-extrabold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-dark mb-2">Page not found</h2>
      <p className="text-text-muted mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button>
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}
