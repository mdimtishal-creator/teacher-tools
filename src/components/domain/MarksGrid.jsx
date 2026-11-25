import { AlertCircle } from 'lucide-react'

export default function MarksGrid({ 
  students, 
  marksData, 
  maxMarks, 
  onMarksChange, 
  fetchingMarks 
}) {
  if (fetchingMarks) {
    return (
      <div className="bg-white rounded-xl border border-border shadow-card p-12 text-center text-text-muted">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        Loading saved marks...
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border shadow-card p-12 text-center">
        <p className="text-text-muted">No students found in this class.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted border-b border-border">
              <th className="p-4 font-semibold text-text-muted text-sm w-24">Roll No</th>
              <th className="p-4 font-semibold text-text-muted text-sm">Student Name</th>
              <th className="p-4 font-semibold text-text-muted text-sm w-40 text-center">Marks (Max: {maxMarks})</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const value = marksData[student.id] ?? ''
              const isError = Number(value) > Number(maxMarks)

              return (
                <tr key={student.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-text-muted font-medium">
                    {student.roll_number || '-'}
                  </td>
                  <td className="p-4 font-bold text-dark">
                    {student.student_name}
                  </td>
                  <td className="p-3">
                    <div className="relative max-w-[120px] mx-auto">
                      <input
                        type="number"
                        placeholder="-"
                        value={value}
                        onChange={(e) => onMarksChange(student.id, e.target.value)}
                        className={`w-full text-center font-bold text-lg px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                          isError 
                            ? 'border-danger text-danger bg-danger-bg focus:ring-danger/20 focus:border-danger' 
                            : 'border-border text-primary-700 bg-white focus:ring-primary-500/20 focus:border-primary-500'
                        }`}
                      />
                      {isError && (
                        <div className="absolute -bottom-5 left-0 right-0 flex items-center justify-center gap-1 text-[10px] font-bold text-danger">
                          <AlertCircle className="w-3 h-3" /> Too high!
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
