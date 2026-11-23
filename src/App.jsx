import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'
import Classes from './pages/dashboard/Classes'
import ClassDetails from './pages/dashboard/ClassDetails'
import BulkMarksEntry from './pages/dashboard/BulkMarksEntry'

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardHome />} />
      <Route path="/dashboard/classes" element={<Classes />} />
      <Route path="/dashboard/classes/:id" element={<ClassDetails />} />
      <Route path="/dashboard/classes/:id/marks" element={<BulkMarksEntry />} />
      
      {/* Fallback sabse aakhir me */}
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default App
