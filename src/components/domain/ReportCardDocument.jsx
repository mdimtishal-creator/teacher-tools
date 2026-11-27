
export default function ReportCardDocument({
  student,
  schoolInfo,
  marks,
  gridData,
  totals,
  getGrade
}) {
  const {
    t1, t2, hy, t3, t4, final,
    group1Total, group1Percent,
    group2Total, group2Percent,
    overallTotal, overallPercent
  } = totals

  const getMarks = (row, exam) =>
    row.marks?.[exam]?.marks_obtained ?? '-'

  const getGroupTotal = (row, examNames) => {
    const values = examNames.map(exam => getMarks(row, exam))
    if (values.every(value => value === '-')) return '-'

    return values.reduce(
      (sum, value) => sum + (value === '-' ? 0 : Number(value)),
      0
    )
  }

  const grade = getGrade(Number(overallPercent))

  return (
    <>
      <style>{`
        .report-sheet {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 25px;
          background: #fff;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
          box-sizing: border-box;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .report-sheet * {
          box-sizing: border-box;
        }

        .report-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          text-align: center;
          padding-bottom: 14px;
          border-bottom: 3px solid #243b63;
        }

        .report-logo {
          width: 76px;
          height: 76px;
          object-fit: contain;
        }

        .report-school-name {
          font-size: 27px;
          font-weight: 900;
          color: #17345e;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        .report-subtitle {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #64748b;
          margin-top: 5px;
          text-transform: uppercase;
        }

        .report-heading {
          display: inline-block;
          margin-top: 12px;
          padding: 6px 24px;
          background: #17345e;
          color: white;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 2px;
          border-radius: 4px;
        }

        .report-student-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px 20px;
          padding: 13px 16px;
          margin: 15px 0;
          background: #f3f6fb;
          border: 1px solid #dbe3ef;
          border-radius: 7px;
        }

        .report-info-item {
          font-size: 12px;
          color: #475569;
        }

        .report-info-item strong {
          color: #172033;
          margin-left: 4px;
        }

        .report-table-wrap {
          width: 100%;
          overflow: visible;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 10px;
          text-align: center;
        }

        .report-table th,
        .report-table td {
          border: 1px solid #cbd5e1;
          padding: 7px 3px;
          overflow-wrap: anywhere;
        }

        .report-table thead tr:first-child th {
          background: #17345e;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 9px 3px;
        }

        .report-table thead tr:nth-child(2) th {
          background: #e8eef7;
          color: #17345e;
          font-size: 9px;
        }

        .report-table .subject-cell {
          width: 16%;
          text-align: left;
          padding-left: 9px;
          font-weight: 800;
          color: #1e293b;
        }

        .report-table .group-total {
          background: #edf3fc;
          color: #17345e;
          font-weight: 800;
        }

        .report-table tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        .report-table tfoot td {
          background: #e8eef7;
          font-weight: 800;
          color: #17345e;
        }

        .report-summary {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-top: 15px;
        }

        .report-summary-card {
          border: 1px solid #dbe3ef;
          border-radius: 7px;
          padding: 11px;
          text-align: center;
          background: #f8fafc;
        }

        .report-summary-card span {
          display: block;
          font-size: 10px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .report-summary-card strong {
          display: block;
          margin-top: 5px;
          font-size: 18px;
          color: #17345e;
        }

        .report-grade {
          background: #17345e;
          border-color: #17345e;
        }

        .report-grade span,
        .report-grade strong {
          color: white;
        }

        .report-signatures {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 24px;
          padding: 0 20px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-signature {
          width: 190px;
          text-align: center;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-signature-line {
          border-top: 1px solid #475569;
          margin-bottom: 7px;
        }

        .report-signature strong {
          display: block;
          font-size: 11px;
          color: #172033;
          text-transform: uppercase;
        }

        .report-signature span {
          display: block;
          font-size: 10px;
          color: #64748b;
          margin-top: 3px;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 5mm;
          }

          body {
            background: white !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .report-sheet {
            width: 100%;
            max-width: none;
            padding: 5px 8px;
            margin: 0;
            border: none;
            border-radius: 0;
            box-shadow: none;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .report-top {
            padding-bottom: 6px;
          }

          .report-logo {
            width: 52px;
            height: 52px;
          }

          .report-school-name {
            font-size: 21px;
          }

          .report-subtitle {
            font-size: 10px;
            margin-top: 3px;
          }

          .report-heading {
            margin-top: 5px;
            padding: 3px 16px;
            font-size: 11px;
          }

          .report-student-info {
            margin: 7px 0;
            padding: 6px 10px;
            gap: 6px 15px;
          }

          .report-info-item {
            font-size: 10px;
          }

          .report-table {
            font-size: 9px;
          }

          .report-table th,
          .report-table td {
            padding: 4px 2px;
          }

          .report-table thead tr:first-child th {
            padding: 6px 2px;
            font-size: 9px;
          }

          .report-table thead tr:nth-child(2) th {
            font-size: 8px;
          }

          .report-summary {
            margin-top: 7px;
            gap: 8px;
          }

          .report-summary-card {
            padding: 5px;
          }

          .report-summary-card span {
            font-size: 9px;
          }

          .report-summary-card strong {
            font-size: 14px;
            margin-top: 3px;
          }

          .report-signatures {
            margin-top: 17px !important;
            padding: 0 20px;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .report-signature {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .report-footer {
            display: none !important;
          }
        }
      `}</style>

      <div className="report-sheet">

        {/* SCHOOL HEADER */}
        <div className="report-top">
          {schoolInfo?.school_logo_url && (
            <img
              src={schoolInfo.school_logo_url}
              alt="School Logo"
              className="report-logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}

          <div>
            <h1 className="report-school-name">
              {schoolInfo?.school_name || 'School Name'}
            </h1>

            {schoolInfo?.school_address && (
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                {schoolInfo.school_address}
              </div>
            )}

            <div className="report-subtitle">
              Academic Performance Record
            </div>

            <div className="report-heading">
              STUDENT REPORT CARD
            </div>
          </div>
        </div>

        {/* STUDENT DETAILS */}
        <div className="report-student-info">
          <div className="report-info-item">
            Student Name:
            <strong>{student.student_name || 'N/A'}</strong>
          </div>

          <div className="report-info-item">
            Roll Number:
            <strong>{student.roll_number || 'N/A'}</strong>
          </div>

          <div className="report-info-item">
            Class:
            <strong>{student.class_name || 'N/A'}</strong>
          </div>

          <div className="report-info-item">
            Session:
            <strong>{schoolInfo?.academic_year || 'N/A'}</strong>
          </div>

          <div className="report-info-item">
            Date:
            <strong>{new Date().toLocaleDateString('en-GB')}</strong>
          </div>

          <div className="report-info-item">
            Result:
            <strong>
              {Number(overallPercent) >= 33 ? 'PASS' : 'NEEDS IMPROVEMENT'}
            </strong>
          </div>
        </div>

        {/* MARKS TABLE */}
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th rowSpan="2" className="subject-cell">
                  SUBJECT
                </th>
                <th colSpan="4">FIRST TERM</th>
                <th colSpan="4">SECOND TERM</th>
              </tr>

              <tr>
                <th>Term 1</th>
                <th>Term 2</th>
                <th>Half Yearly</th>
                <th>Total</th>
                <th>Term 3</th>
                <th>Term 4</th>
                <th>Final Exam</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {gridData.map((row, index) => (
                <tr key={index}>
                  <td className="subject-cell">{row.subject}</td>
                  <td>{getMarks(row, 'Term 1')}</td>
                  <td>{getMarks(row, 'Term 2')}</td>
                  <td>{getMarks(row, 'Half Yearly')}</td>
                  <td className="group-total">
                    {getGroupTotal(row, ['Term 1', 'Term 2', 'Half Yearly'])}
                  </td>
                  <td>{getMarks(row, 'Term 3')}</td>
                  <td>{getMarks(row, 'Term 4')}</td>
                  <td>{getMarks(row, 'Final Exam')}</td>
                  <td className="group-total">
                    {getGroupTotal(row, ['Term 3', 'Term 4', 'Final Exam'])}
                  </td>
                </tr>
              ))}

              {gridData.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ padding: '20px', color: '#64748b' }}>
                    No marks available yet.
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr>
                <td className="subject-cell">TOTAL MARKS</td>
                <td>{t1.obt}/{t1.max}</td>
                <td>{t2.obt}/{t2.max}</td>
                <td>{hy.obt}/{hy.max}</td>
                <td>{group1Total.obt}/{group1Total.max}</td>
                <td>{t3.obt}/{t3.max}</td>
                <td>{t4.obt}/{t4.max}</td>
                <td>{final.obt}/{final.max}</td>
                <td>{group2Total.obt}/{group2Total.max}</td>
              </tr>

              <tr>
                <td className="subject-cell">PERCENTAGE</td>
                <td>{t1.percent}%</td>
                <td>{t2.percent}%</td>
                <td>{hy.percent}%</td>
                <td>{group1Percent}%</td>
                <td>{t3.percent}%</td>
                <td>{t4.percent}%</td>
                <td>{final.percent}%</td>
                <td>{group2Percent}%</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* OVERALL SUMMARY */}
        <div className="report-summary">
          <div className="report-summary-card">
            <span>Grand Total</span>
            <strong>
              {overallTotal.obt} / {overallTotal.max}
            </strong>
          </div>

          <div className="report-summary-card">
            <span>Overall Percentage</span>
            <strong>{overallPercent}%</strong>
          </div>

          <div className="report-summary-card report-grade">
            <span>Final Grade</span>
            <strong>{grade}</strong>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="report-signatures">
          <div className="report-signature">
            <div className="report-signature-line"></div>
            <strong>Class Teacher</strong>
            <span>Signature</span>
          </div>

          <div className="report-signature">
            <div className="report-signature-line"></div>
            <strong>
              {schoolInfo?.principal_name || 'Principal'}
            </strong>
            <span>Principal Signature</span>
          </div>
        </div>

      </div>
    </>
  )
}
