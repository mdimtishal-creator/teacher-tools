import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'
import Classes from './pages/dashboard/Classes' // Naya import

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardHome />} />
      <Route path="/dashboard/classes" element={<Classes />} /> {/* Naya route */}
    </Routes>
  )
}

export default App
