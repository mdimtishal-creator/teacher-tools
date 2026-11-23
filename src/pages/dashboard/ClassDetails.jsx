import { useParams, useNavigate } from 'react-router-dom'

export default function ClassDetails() {
  const { id } = useParams() // URL se class ki ID nikal raha hai
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/classes')} className="text-gray-500 hover:text-dark font-medium">
          ← Back to Classes
        </button>
        <h1 className="text-xl font-bold text-primary">Class Details</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Student List</h2>
          <p className="text-gray-600 mb-4">
            This is the page for Class ID: <span className="font-mono text-primary bg-blue-50 px-2 py-1 rounded">{id}</span>
          </p>
          <p className="text-sm text-gray-500">(Students add karne ka feature hum agle step me add karenge!)</p>
        </div>
      </main>
    </div>
  )
}
