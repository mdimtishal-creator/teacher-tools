import { Link } from 'react-router-dom'
import { Trash2, FileText } from 'lucide-react'
import Button from '../ui/Button'

export default function StudentTable({ students, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-muted rounded-xl border border-border border-dashed">
        <p className="text-text-muted">No students added yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted border-b border-border">
              <th className="p-4 font-semibold text-text-muted text-sm w-24">Roll No</th>
              <th className="p-4 font-semibold text-text-muted text-sm">Student Name</th>
              <th className="p-4 font-semibold text-text-muted text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                <td className="p-4 text-text-muted font-medium">
                  {student.roll_number || '-'}
                </td>
                <td className="p-4 font-bold text-dark">
                  {student.student_name}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      to={`/dashboard/student/${student.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
                    >
                      <FileText className="w-4 h-4" />
                      Report Card
                    </Link>
                    <button 
                      onClick={() => onDelete(student)}
                      className="p-2 text-text-subtle hover:text-danger hover:bg-danger-bg rounded-lg transition"
                      title="Delete Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
