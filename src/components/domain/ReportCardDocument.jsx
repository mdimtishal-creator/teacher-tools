export default function ReportCardDocument({ student, schoolInfo, marks, gridData, totals, getGrade }) {
  const { t1, t2, hy, t3, t4, final, group1Total, group1Percent, group2Total, group2Percent, overallTotal, overallPercent } = totals

  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-border print:shadow-none print:border-none print:p-0 print:m-0 max-w-[210mm] mx-auto">
      
      {/* School Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-6 flex flex-col items-center">
        {schoolInfo?.school_logo_url && (
          <img 
            src={schoolInfo.school_logo_url} 
            alt="School Logo" 
            className="h-20 object-contain mb-3" 
            onError={(e) => e.target.style.display = 'none'} 
          />
        )}
        <h1 className="text-3xl font-extrabold text-dark uppercase tracking-wide">
          {schoolInfo?.school_name || 'Student Report Card'}
        </h1>
        <p className="text-gray-600 text-sm mt-2 font-medium tracking-widest uppercase">Student Report Card</p>
      </div>

      {/* Student Info */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-0 print:border-b print:border-gray-300 print:pb-4 print:mb-4">
        <div className="space-y-1">
          <p className="text-lg"><span className="font-bold text-gray-700 w-24 inline-block">Name:</span> <span className="font-bold text-dark text-xl uppercase">{student.student_name}</span></p>
          <p className="text-md"><span className="font-bold text-gray-700 w-24 inline-block">Roll No:</span> <span className="font-semibold text-gray-800">{student.roll_number || 'N/A'}</span></p>
        </div>
        <div className="md:text-right space-y-1">
          <p className="text-md"><span className="font-bold text-gray-700">Date:</span> {new Date().toLocaleDateString('en-GB')}</p>
          <p className="text-md"><span className="font-bold text-gray-700">Class:</span> {student.class_name || 'N/A'}</p>
        </div>
      </div>

      {/* MARKS TABLE */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-center border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-white print:bg-gray-200 print:text-black">
              <th className="p-2 border border-gray-300 text-left w-32">Subject</th>
              <th className="p-2 border border-gray-300">Term 1</th>
              <th className="p-2 border border-gray-300">Term 2</th>
              <th className="p-2 border border-gray-300">Half Yearly</th>
              <th className="p-2 border border-gray-300 bg-gray-700 print:bg-gray-300 font-bold">Total (1+2+HY)</th>
              <th className="p-2 border border-gray-300">Term 3</th>
              <th className="p-2 border border-gray-300">Term 4</th>
              <th className="p-2 border border-gray-300">Final</th>
              <th className="p-2 border border-gray-300 bg-gray-700 print:bg-gray-300 font-bold">Total (3+4+Fin)</th>
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
                <tr key={idx} className="hover:bg-gray-50 print:hover:bg-transparent">
                  <td className="p-2 border border-gray-300 text-left font-bold text-gray-800 uppercase">{row.subject}</td>
                  <td className="p-2 border border-gray-300 text-gray-700">{r_t1}</td>
                  <td className="p-2 border border-gray-300 text-gray-700">{r_t2}</td>
                  <td className="p-2 border border-gray-300 text-gray-700">{r_hy}</td>
                  <td className="p-2 border border-gray-300 font-bold bg-gray-50 print:bg-transparent text-primary-700">{r_g1}</td>
                  
                  <td className="p-2 border border-gray-300 text-gray-700">{r_t3}</td>
                  <td className="p-2 border border-gray-300 text-gray-700">{r_t4}</td>
                  <td className="p-2 border border-gray-300 text-gray-700">{r_fin}</td>
                  <td className="p-2 border border-gray-300 font-bold bg-gray-50 print:bg-transparent text-primary-700">{r_g2}</td>
                </tr>
              )
            })}
            
            {gridData.length === 0 && (
              <tr>
                <td colSpan="9" className="p-8 text-center text-gray-500 italic">
                  No marks available yet.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold text-gray-800 print:bg-transparent">
              <td className="p-2 border border-gray-300 text-left">TOTAL MARKS</td>
              <td className="p-2 border border-gray-300">{t1.obt} / {t1.max}</td>
              <td className="p-2 border border-gray-300">{t2.obt} / {t2.max}</td>
              <td className="p-2 border border-gray-300">{hy.obt} / {hy.max}</td>
              <td className="p-2 border border-gray-300 bg-blue-100 text-primary-800 print:bg-gray-200 print:text-black">{group1Total.obt} / {group1Total.max}</td>
              <td className="p-2 border border-gray-300">{t3.obt} / {t3.max}</td>
              <td className="p-2 border border-gray-300">{t4.obt} / {t4.max}</td>
              <td className="p-2 border border-gray-300">{final.obt} / {final.max}</td>
              <td className="p-2 border border-gray-300 bg-blue-100 text-primary-800 print:bg-gray-200 print:text-black">{group2Total.obt} / {group2Total.max}</td>
            </tr>
            <tr className="bg-gray-100 font-bold text-gray-800 print:bg-transparent">
              <td className="p-2 border border-gray-300 text-left">PERCENTAGE</td>
              <td className="p-2 border border-gray-300">{t1.percent}%</td>
              <td className="p-2 border border-gray-300">{t2.percent}%</td>
              <td className="p-2 border border-gray-300">{hy.percent}%</td>
              <td className="p-2 border border-gray-300 bg-blue-200 text-primary-800 print:bg-gray-200 print:text-black">{group1Percent}%</td>
              <td className="p-2 border border-gray-300">{t3.percent}%</td>
              <td className="p-2 border border-gray-300">{t4.percent}%</td>
              <td className="p-2 border border-gray-300">{final.percent}%</td>
              <td className="p-2 border border-gray-300 bg-blue-200 text-primary-800 print:bg-gray-200 print:text-black">{group2Percent}%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* OVERALL RESULT & SIGNATURE */}
      <div className="flex flex-col md:flex-row justify-between items-end mt-16 gap-8">
        
        {/* Principal Signature */}
        <div className="text-center w-48">
          <div className="border-t border-gray-400 mb-2"></div>
          <p className="font-bold text-gray-800 text-sm uppercase">
            {schoolInfo?.principal_name || 'Principal'}
          </p>
          <p className="text-xs text-gray-500">Principal Signature</p>
        </div>

        {/* Overall Result Box */}
        <div className="border-2 border-primary-600 rounded-xl p-5 w-full md:w-80 bg-blue-50 print:bg-transparent">
          <h3 className="text-center font-bold text-lg mb-3 border-b border-primary-200 pb-2 text-primary-800">Overall Result</h3>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 font-medium">Grand Total:</span>
            <span className="font-bold text-dark">{overallTotal.obt} / {overallTotal.max}</span>
          </div>
          <div className="flex justify-between mb-2 border-b border-primary-200 pb-2">
            <span className="text-gray-600 font-medium">Overall %:</span>
            <span className="font-bold text-primary-700">{overallPercent}%</span>
          </div>
          <div className="flex justify-between mt-2 items-center">
            <span className="text-gray-600 font-bold uppercase text-sm">Final Grade:</span>
            <span className="font-extrabold text-2xl text-dark bg-white px-3 py-1 rounded shadow-sm print:shadow-none print:border border-gray-200">{getGrade(overallPercent)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
