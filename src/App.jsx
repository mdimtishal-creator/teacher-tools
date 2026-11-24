import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'
import Classes from './pages/dashboard/Classes'
import ClassDetails from './pages/dashboard/ClassDetails'
import BulkMarksEntry from './pages/dashboard/BulkMarksEntry'
import ExamsHome from './pages/dashboard/ExamsHome'
import ReportCardsHome from './pages/dashboard/ReportCardsHome'
import ClassReportCards from './pages/dashboard/ClassReportCards'
import StudentMarks from './pages/dashboard/StudentMarks'

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardHome />} />

      {/* Classes */}
      <Route path="/dashboard/classes" element={<Classes />} />
      <Route path="/dashboard/classes/:id" element={<ClassDetails />} />
      <Route path="/dashboard/classes/:id/marks" element={<BulkMarksEntry />} />

      {/* Exams */}
      <Route path="/dashboard/exams" element={<ExamsHome />} />

      {/* Report Cards */}
      <Route path="/dashboard/report-cards" element={<ReportCardsHome />} />
      <Route path="/dashboard/report-cards/class/:id" element={<ClassReportCards />} />

      {/* Student Marksheet / Report Card (naya) */}
      <Route path="/dashboard/student/:studentId" element={<StudentMarks />} />

      {/* Fallback: galat URL -> login par wapas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
