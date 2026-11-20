import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Teacher Tools</h1>
          <div className="flex gap-4">
            <button className="text-dark font-medium hover:text-primary">Hindi / EN</button>
            <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
          Save Hours of Your <br />
          <span className="text-primary">Teaching Time</span>
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Free professional tools for Indian school teachers. Generate marksheets, track attendance, and manage your class easily from your phone.
        </p>
        <Link to="/dashboard" className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition">
          Explore Tools
        </Link>
      </main>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Marksheet Generator</h3>
          <p className="text-gray-600">Add students, enter marks, and download professional PDF report cards instantly.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Attendance System</h3>
          <p className="text-gray-600">Mark daily attendance for your entire class with a single tap.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Free Templates</h3>
          <p className="text-gray-600">Download ready-made Excel and PDF templates for your daily school work.</p>
        </div>
      </div>
    </div>
  )
}
