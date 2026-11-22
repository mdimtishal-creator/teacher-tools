import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'

function App() {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/dashboard" element={<DashboardHome />} />
    </Routes>
  )
}

export default App
