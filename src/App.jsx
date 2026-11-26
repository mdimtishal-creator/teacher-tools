import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import NotFound from './routes/NotFound'

// Pages
import Landing from './pages/Landing' // <-- Naya Import
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'
import Classes from './pages/dashboard/Classes'
import ClassDetails from './pages/dashboard/ClassDetails'
import BulkMarksEntry from './pages/dashboard/BulkMarksEntry'
import ExamsHome from './pages/dashboard/ExamsHome'
import ReportCardsHome from './pages/dashboard/ReportCardsHome'
import ClassReportCards from './pages/dashboard/ClassReportCards'
import StudentMarks from './pages/dashboard/StudentMarks'
import Settings from './pages/dashboard/Settings'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} /> {/* <-- Yahan change kiya */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          
          <Route path="/dashboard/classes" element={<Classes />} />
          <Route path="/dashboard/classes/:id" element={<ClassDetails />} />
          <Route path="/dashboard/classes/:id/marks" element={<BulkMarksEntry />} />
          
          <Route path="/dashboard/exams" element={<ExamsHome />} />
          
          <Route path="/dashboard/report-cards" element={<ReportCardsHome />} />
          <Route path="/dashboard/report-cards/class/:id" element={<ClassReportCards />} />
          
          <Route path="/dashboard/student/:studentId" element={<StudentMarks />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
