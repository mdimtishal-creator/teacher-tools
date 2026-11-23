import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'
import Classes from './pages/dashboard/Classes'
import ClassDetails from './pages/dashboard/ClassDetails'

function App() {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/dashboard" element={<DashboardHome />} />
      <Route path="/dashboard/classes" element={<Classes />} />
      <Route path="/dashboard/classes/:id" element={<ClassDetails />} />
    </Routes>
  )
}

export default App
