import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'
import Classes from './pages/dashboard/Classes'
import ClassDetails from './pages/dashboard/ClassDetails'
import BulkMarksEntry from './pages/dashboard/BulkMarksEntry'
import ExamsHome from './pages/dashboard/ExamsHome'
import ReportCardsHome from './pages/dashboard/ReportCardsHome'
import ClassReportCards from './pages/dashboard/ClassReportCards'

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardHome />} />
      <Route path="/dashboard/classes" element={<Classes />} />
      <Route path="/dashboard/classes/:id" element={<ClassDetails />} />
      <Route path="/dashboard/classes/:id/marks" element={<BulkMarksEntry />} />
      <Route path="/dashboard/exams" element={<ExamsHome />} />
      <Route path="/dashboard/report-cards" element={<ReportCardsHome />} />
<Route path="/dashboard/report-cards/class/:id" element={<ClassReportCards />} />

      
      {/* Fallback sabse aakhir me */}
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default App
