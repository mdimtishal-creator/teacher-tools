import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary">
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Teacher Tools</h1>
          <div className="flex gap-4">
            <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Login</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
          Save Hours of Your <br />
          <span className="text-primary">Teaching Time</span>
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Free professional tools for Indian school teachers.
        </p>
        <Link to="/login" className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition">
          Get Started
        </Link>
      </main>
    </div>
  )
}
