export default function ReportCardDocument({ student, schoolInfo, marks, gridData = [], totals = {}, getGrade }) {
  // Safe destructuring taaki data missing ho toh white screen na aaye
  const { 
    t1 = { obt: 0, max: 0, percent: 0 }, 
    t2 = { obt: 0, max: 0, percent: 0 }, 
    hy = { obt: 0, max: 0, percent: 0 }, 
    t3 = { obt: 0, max: 0, percent: 0 }, 
    t4 = { obt: 0, max: 0, percent: 0 }, 
    final = { obt: 0, max: 0, percent: 0 }, 
    group1Total = { obt: 0, max: 0 }, 
    group1Percent = 0, 
    group2Total = { obt: 0, max: 0 }, 
    group2Percent = 0, 
    overallTotal = { obt: 0, max: 0 }, 
    overallPercent = 0 
  } = totals || {};

  // Check karo ki Term 3, 4 ya Final ke marks hain ya nahi
  const hasGroup2 = (t3.obt > 0) || (t4.obt > 0) || (final.obt > 0);

  return (
    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-border print:shadow-none print:border-none print:p-0 print:m-0 max-w-[210mm] mx-auto text-sm">
      
      {/* School Header (Official Letterhead Style) */}
      <div className="text-center border-4 border-double border-gray-800 p-6 mb-6">
        {schoolInfo?.school_logo_url && (
          <img 
            src={schoolInfo.school_logo_url} 
            alt="School Logo" 
            className="h-20 object-contain mx-auto mb-4" 
            onError={(e) => e.target.style.display = 'none'} 
          />
        )}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark uppercase tracking-widest">
          {schoolInfo?.school_name || 'SCHOOL NAME'}
        </h1>
        <div className="mt-4 inline-block bg-gray-800 text-white px-8 py-1.5 rounded-full font-bold uppercase tracking-widest text-sm print:bg-gray-200 print:text-black">
          Student Report Card
        </div>
      </div>

      {/* Student Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 border border-gray-200 print:bg-transparent">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">Student Name</p>
          <p className="font-bold text-dark text-base uppercase">{student?.student_name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">Roll Number</p>
          <p className="font-bold text-dark text-base">{student?.roll_number || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">Class</p>
          <p className="font-bold text-dark text-base">{student?.class_name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
          <p className="font-bold text-dark text-base">{new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      {/* MARKS TABLE */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-center border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white print:bg-gray-200 print:text-black">
              <th className="p-2 border border-gray-300 text-left font-semibold w-40">SUBJECT</th>
              <th className="p-2 border border-gray-300 font-semibold">TERM 1</th>
              <th className="p-2 border border-gray-300 font-semibold">TERM 2</th>
              <th className="p-2 border border-gray-300 font-semibold">HALF YEARLY</th>
              <th className="p-2 border border-gray-300 font-semibold bg-gray-700 print:bg-gray-300">TOTAL (1+2+HY)</th>
              
              {hasGroup2 && (
                <>
                  <th className="p-2 border border-gray-300 font-semibold border-l-2 border-l-gray-400">TERM 3</th>
                  <th className="p-2 border border-gray-300 font-semibold">TERM 4</th>
                  <th className="p-2 border border-gray-300 font-semibold">FINAL</th>
                  <th className="p-2 border border-gray-300 font-semibold bg-gray-700 print:bg-gray-300">TOTAL (3+4+Fin)</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {gridData.length > 0 ? (
              gridData.map((row, idx) => {
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
                  <tr key={idx} className="even:bg-gray-50 print:even:bg-transparent hover:bg-gray-100 print:hover:bg-transparent">
                    <td className="p-2 border border-gray-300 text-left font-bold text-dark uppercase">{row.subject}</td>
                    <td className="p-2 border border-gray-300 text-gray-700">{r_t1}</td>
                    <td className="p-2 border border-gray-300 text-gray-700">{r_t2}</td>
                    <td className="p-2 border border-gray-300 text-gray-700">{r_hy}</td>
                    <td className="p-2 border border-gray-300 font-bold bg-blue-50 text-primary-700 print:bg-transparent">{r_g1}</td>
                    
                    {hasGroup2 && (
                      <>
                        <td className="p-2 border border-gray-300 border-l-2 border-l-gray-400 text-gray-700">{r_t3}</td>
                        <td className="p-2 border border-gray-300 text-gray-700">{r_t4}</td>
                        <td className="p-2 border border-gray-300 text-gray-700">{r_fin}</td>
                        <td className="p-2 border border-gray-300 font-bold bg-blue-50 text-primary-700 print:bg-transparent">{r_g2}</td>
                      </>
                    )}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={hasGroup2 ? 9 : 5} className="p-6 text-center text-gray-500 italic">
                  No marks available yet.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold text-dark print:bg-transparent">
              <td className="p-2 border border-gray-300 text-left uppercase">Total Marks</td>
              <td className="p-2 border border-gray-300">{t1.obt} / {t1.max}</td>
              <td className="p-2 border border-gray-300">{t2.obt} / {t2.max}</td>
              <td className="p-2 border border-gray-300">{hy.obt} / {hy.max}</td>
              <td className="p-2 border border-gray-300 bg-blue-100 text-primary-800 print:bg-transparent print:text-black">{group1Total.obt} / {group1Total.max}</td>
              
              {hasGroup2 && (
                <>
                  <td className="p-2 border border-gray-300 border-l-2 border-l-gray-400">{t3.obt} / {t3.max}</td>
                  <td className="p-2 border border-gray-300">{t4.obt} / {t4.max}</td>
                  <td className="p-2 border border-gray-300">{final.obt} / {final.max}</td>
                  <td className="p-2 border border-gray-300 bg-blue-100 text-primary-800 print:bg-transparent print:text-black">{group2Total.obt} / {group2Total.max}</td>
                </>
              )}
            </tr>
            <tr className="bg-gray-200 font-bold text-dark print:bg-gray-100">
              <td className="p-2 border border-gray-300 text-left uppercase">Percentage</td>
              <td className="p-2 border border-gray-300">{t1.percent}%</td>
              <td className="p-2 border border-gray-300">{t2.percent}%</td>
              <td className="p-2 border border-gray-300">{hy.percent}%</td>
              <td className="p-2 border border-gray-300 bg-blue-200 text-primary-900 print:bg-transparent print:text-black">{group1Percent}%</td>
              
              {hasGroup2 && (
                <>
                  <td className="p-2 border border-gray-300 border-l-2 border-l-gray-400">{t3.percent}%</td>
                  <td className="p-2 border border-gray-300">{t4.percent}%</td>
                  <td className="p-2 border border-gray-300">{final.percent}%</td>
                  <td className="p-2 border border-gray-300 bg-blue-200 text-primary-900 print:bg-transparent print:text-black">{group2Percent}%</td>
                </>
              )}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* OVERALL RESULT & SIGNATURES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 gap-8">
        
        {/* Signatures */}
        <div className="flex gap-12 w-full md:w-auto mt-8 md:mt-0">
          <div className="text-center">
            <div className="border-t border-gray-400 mb-2 w-32"></div>
            <p className="font-bold text-gray-800 text-sm uppercase">Class Teacher</p>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 mb-2 w-32"></div>
            <p className="font-bold text-gray-800 text-sm uppercase">
              {schoolInfo?.principal_name || 'Principal'}
            </p>
            <p className="text-[10px] text-gray-500">Principal Signature</p>
          </div>
        </div>

        {/* Final Result Box */}
        <div className="border-2 border-primary-600 rounded-xl p-5 w-full md:w-80 bg-white shadow-sm print:shadow-none print:border-gray-400">
          <h3 className="text-center font-bold text-lg mb-4 border-b border-gray-200 pb-2 text-primary-800 uppercase tracking-widest bg-gray-50 py-1 rounded">Final Result</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold text-sm">Grand Total:</span>
              <span className="font-bold text-dark text-lg">{overallTotal.obt} <span className="text-gray-400 text-sm">/ {overallTotal.max}</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold text-sm">Percentage:</span>
              <span className="font-bold text-primary-700 text-lg">{overallPercent}%</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-2">
              <span className="text-gray-800 font-bold uppercase text-sm">Final Grade:</span>
              <span className="font-extrabold text-3xl text-primary-800">{getGrade ? getGrade(overallPercent) : 'N/A'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
