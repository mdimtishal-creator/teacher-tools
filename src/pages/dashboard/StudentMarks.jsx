import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function StudentMarks() {
  const { studentId } = useParams()
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [studentId]) // 👈 fix: studentId change par refresh

  const fetchData = async () => {
    setLoading(true)
    const { data: sData, error: sError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single()

    if (sError) console.error('Error fetching student:', sError.message)
    if (sData) setStudent(sData)

    const { data: mData, error: mError } = await supabase
      .from('marks')
      .select('*')
      .eq('student_id', studentId)

    if (mError) console.error('Error fetching marks:', mError.message)
    if (mData) setMarks(mData)

    setLoading(false)
  }

  const deleteSubject = async (subjectName) => {
    if (!window.confirm(`Are you sure you want to delete all marks for ${subjectName}?`)) return

    const { error } = await supabase
      .from('marks')
      .delete()
      .eq('student_id', studentId)
      .eq('subject', subjectName)

    if (error) {
      alert("Error deleting: " + error.message)
    } else {
      fetchData()
    }
  }

  if (loading) return <div className="p-10 text-center">Loading Marksheet...</div>
  if (!student) return <div className="p-10 text-center">Student not found</div>

  const uniqueSubjects = [...new Set(marks.map(m => m.subject))]
  const examsList = ['Term 1', 'Term 2', 'Half Yearly', 'Term 3', 'Term 4', 'Final Exam']

  const gridData = uniqueSubjects.map(sub => {
    const subMarks = {}
    examsList.forEach(exam => {
      const record = marks.find(m => m.subject === sub && m.exam_name === exam)
      if (record) subMarks[exam] = record
    })
    return { subject: sub, marks: subMarks }
  })

  const calculateColumnTotal = (examName) => {
    let obt = 0, max = 0
    gridData.forEach(row => {
      if (row.marks[examName]) {
        obt += row.marks[examName].marks_obtained
        max += row.marks[examName].max_marks
      }
    })
    return { obt, max, percent: max > 0 ? ((obt / max) * 100).toFixed(1) : 0 }
  }

  const t1 = calculateColumnTotal('Term 1')
  const t2 = calculateColumnTotal('Term 2')
  const hy = calculateColumnTotal('Half Yearly')

  const t3 = calculateColumnTotal('Term 3')
  const t4 = calculateColumnTotal('Term 4')
  const final = calculateColumnTotal('Final Exam')

  const group1Total = { obt: t1.obt + t2.obt + hy.obt, max: t1.max + t2.max + hy.max }
  const group1Percent = group1Total.max > 0 ? ((group1Total.obt / group1Total.max) * 100).toFixed(2) : 0

  const group2Total = { obt: t3.obt + t4.obt + final.obt, max: t3.max + t4.max + final.max }
  const group2Percent = group2Total.max > 0 ? ((group2Total.obt / group2Total.max) * 100).toFixed(2) : 0

  const overallTotal = { obt: group1Total.obt + group2Total.obt, max: group1Total.max + group2Total.max }
  const overallPercent = overallTotal.max > 0 ? ((overallTotal.obt / overallTotal.max) * 100).toFixed(2) : 0

  const getGrade = (percent) => {
    if (percent >= 90) return 'A+'
    if (percent >= 80) return 'A'
    if (percent >= 70) return 'B'
    if (percent >= 60) return 'C'
    if (percent >= 50) return 'D'
    return 'F'
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-dark font-medium">← Back</button>
        <button onClick={() => window.print()} className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
          🖨️ Print / Save PDF
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-6 mt-6">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-none print:p-0">

          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-extrabold text-dark uppercase tracking-wide">Student Report Card</h1>
            <p className="text-gray-500 text-sm mt-1">Generated via Teacher Tools</p>
          </div>

          {/* Student Info */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 bg-gray-50 p-4 rounded-lg print:bg-white print:p-0">
            <div>
              <p className="text-lg"><span className="font-bold text-gray-700">Name:</span> <span className="font-semibold text-primary">{student.student_name}</span></p>
              <p className="text-md mt-1"><span className="font-bold text-gray-700">Roll No:</span> {student.roll_number || 'N/A'}</p>
            </div>
            <div className="md:text-right">
              <p className="text-md"><span className="font-bold text-gray-700">Date:</span> {new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          {/* MARKS TABLE */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-center border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white print:bg-gray-200 print:text-black">
                  <th className="p-2 border border-gray-300 text-left">Subject</th>
                  <th className="p-2 border border-gray-300">Term 1</th>
                  <th className="p-2 border border-gray-300">Term 2</th>
                  <th className="p-2 border border-gray-300">Half Yearly</th>
                  <th className="p-2 border border-gray-300 bg-gray-700 print:bg-gray-300 font-bold">Total (1+2+HY)</th>
                  <th className="p-2 border border-gray-300">Term 3</th>
                  <th className="p-2 border border-gray-300">Term 4</th>
                  <th className="p-2 border border-gray-300">Final</th>
                  <th className="p-2 border border-gray-300 bg-gray-700 print:bg-gray-300 font-bold">Total (3+4+Fin)</th>
                  <th className="p-2 border border-gray-300 print:hidden">Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData.map((row, idx) => {
                  const r_t1 = row.marks['Term 1']?.marks_obtained ?? '-'
                  const r_t2 = row.marks['Term 2']?.marks_obtained ?? '-'
                  const r_hy = row.marks['Half Yearly']?.marks_obtained ?? '-'
                  const r_g1 = (r_t1 !== '-' || r_t2 !== '-' || r_hy !== '-')
                    ? (Number(r_t1 === '-' ? 0 : r_t1) + Number(r_t2 === '-' ? 0 : r_t2) + Number(r_hy === '-' ? 0 : r_hy))
                    : '-'

                  const r_t3 = row.marks['Term 3']?.marks_obtained ?? '-'
                  const r_t4 = row.marks['Term 4']?.marks_obtained ?? '-'
                  const r_fin = row.marks['Final Exam']?.marks_obtained ?? '-'
                  const r_g2 = (r_t3 !== '-' || r_t4 !== '-' || r_fin !== '-')
                    ? (Number(r_t3 === '-' ? 0 : r_t3) + Number(r_t4 === '-' ? 0 : r_t4) + Number(r_fin === '-' ? 0 : r_fin))
                    : '-'

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300 text-left font-bold text-gray-700">{row.subject}</td>
                      <td className="p-2 border border-gray-300">{r_t1}</td>
                      <td className="p-2 border border-gray-300">{r_t2}</td>
                      <td className="p-2 border border-gray-300">{r_hy}</td>
                      <td className="p-2 border border-gray-300 font-bold bg-gray-50">{r_g1}</td>

                      <td className="p-2 border border-gray-300">{r_t3}</td>
                      <td className="p-2 border border-gray-300">{r_t4}</td>
                      <td className="p-2 border border-gray-300">{r_fin}</td>
                      <td className="p-2 border border-gray-300 font-bold bg-gray-50">{r_g2}</td>

                      <td className="p-2 border border-gray-300 print:hidden text-center">
                        <button
                          onClick={() => deleteSubject(row.subject)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold text-gray-800">
                  <td className="p-2 border border-gray-300 text-left">TOTAL MARKS</td>
                  <td className="p-2 border border-gray-300">{t1.obt} / {t1.max}</td>
                  <td className="p-2 border border-gray-300">{t2.obt} / {t2.max}</td>
                  <td className="p-2 border border-gray-300">{hy.obt} / {hy.max}</td>
                  <td className="p-2 border border-gray-300 bg-blue-100 text-primary">{group1Total.obt} / {group1Total.max}</td>
                  <td className="p-2 border border-gray-300">{t3.obt} / {t3.max}</td>
                  <td className="p-2 border border-gray-300">{t4.obt} / {t4.max}</td>
                  <td className="p-2 border border-gray-300">{final.obt} / {final.max}</td>
                  <td className="p-2 border border-gray-300 bg-blue-100 text-primary">{group2Total.obt} / {group2Total.max}</td>
                  <td className="p-2 border border-gray-300 print:hidden"></td>
                </tr>
                <tr className="bg-gray-100 font-bold text-gray-800">
                  <td className="p-2 border border-gray-300 text-left">PERCENTAGE</td>
                  <td className="p-2 border border-gray-300">{t1.percent}%</td>
                  <td className="p-2 border border-gray-300">{t2.percent}%</td>
                  <td className="p-2 border border-gray-300">{hy.percent}%</td>
                  <td className="p-2 border border-gray-300 bg-blue-200 text-primary">{group1Percent}%</td>
                  <td className="p-2 border border-gray-300">{t3.percent}%</td>
                  <td className="p-2 border border-gray-300">{t4.percent}%</td>
                  <td className="p-2 border border-gray-300">{final.percent}%</td>
                  <td className="p-2 border border-gray-300 bg-blue-200 text-primary">{group2Percent}%</td>
                  <td className="p-2 border border-gray-300 print:hidden"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* OVERALL RESULT SUMMARY */}
          <div className="flex justify-end mt-6">
            <div className="border-2 border-primary rounded-xl p-6 w-full md:w-80 bg-blue-50 print:bg-white">
              <h3 className="text-center font-bold text-lg mb-3 border-b border-blue-200 pb-2 text-primary">Overall Result</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 font-medium">Grand Total:</span>
                <span className="font-bold text-dark">{overallTotal.obt} / {overallTotal.max}</span>
              </div>
              <div className="flex justify-between mb-2 border-b border-blue-200 pb-2">
                <span className="text-gray-600 font-medium">Overall %:</span>
                <span className="font-bold text-primary">{overallPercent}%</span>
              </div>
              <div className="flex justify-between mt-2 items-center">
                <span className="text-gray-600 font-bold uppercase">Final Grade:</span>
                <span className="font-extrabold text-2xl text-dark bg-white px-3 py-1 rounded shadow-sm print:shadow-none print:border">{getGrade(overallPercent)}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
