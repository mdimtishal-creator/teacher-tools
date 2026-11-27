import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { FileText, ArrowRight, GraduationCap } from 'lucide-react'


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

  const today = new Date().toLocaleDateString('en-GB')

  const grade = getGrade(overallPercent)

  const moneyFormat = (value) =>
    Number(value || 0).toLocaleString('en-IN')

  const columns = [
    { label: 'TERM 1', data: t1 },
    { label: 'TERM 2', data: t2 },
    { label: 'HALF YEARLY', data: hy },
    { label: 'TERM 3', data: t3 },
    { label: 'TERM 4', data: t4 },
    { label: 'FINAL', data: final }
  ]

  return (
    <>
      <style>{`
        .report-card-document {
          width: 100%;
          max-width: 1120px;
          margin: 20px auto;
          padding: 26px 30px;
          background: #ffffff;
          color: #172b4d;
          font-family: Arial, Helvetica, sans-serif;
          border: 1px solid #dce3ed;
          border-radius: 9px;
          box-shadow: 0 5px 25px rgba(20,40,70,.08);
        }

        .rc-heading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          text-align: center;
          padding-bottom: 15px;
          border-bottom: 3px solid #244776;
        }

        .rc-logo {
          width: 68px;
          height: 68px;
          object-fit: contain;
        }

        .rc-school-name {
          font-size: 25px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #18365f;
          text-transform: uppercase;
        }

        .rc-heading-sub {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #718096;
          margin-top: 6px;
        }

        .rc-details {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 9px 18px;
          padding: 13px 15px;
          margin: 15px 0;
          background: #f4f7fb;
          border: 1px solid #dce5f0;
          border-radius: 5px;
          font-size: 12px;
        }

        .rc-detail-label {
          color: #64748b;
          font-weight: 700;
        }

        .rc-detail-value {
          color: #1e3556;
          font-weight: 800;
          margin-left: 4px;
        }

        .rc-section-heading {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #244776;
          margin: 15px 0 8px;
          text-transform: uppercase;
        }

        .rc-table-wrap {
          width: 100%;
          overflow: visible;
        }

        .rc-marks-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 10px;
        }

        .rc-marks-table th {
          padding: 9px 3px;
          background: #234776;
          color: #fff;
          border: 1px solid #234776;
          text-align: center;
          line-height: 1.3;
          font-size: 9px;
        }

        .rc-marks-table td {
          padding: 7px 3px;
          text-align: center;
          border: 1px solid #d6deea;
          color: #34445b;
          font-weight: 600;
        }

        .rc-marks-table th:first-child,
        .rc-marks-table td:first-child {
          width: 16%;
          text-align: left;
          padding-left: 8px;
          font-weight: 800;
        }

        .rc-marks-table th:nth-child(5),
        .rc-marks-table th:nth-child(9) {
          background: #17385f;
        }

        .rc-marks-table td:nth-child(5),
        .rc-marks-table td:nth-child(9) {
          background: #edf3fc;
          color: #24569a;
          font-weight: 800;
        }

        .rc-marks-table tfoot td {
          background: #eaf0f8;
          color: #18365f;
          font-weight: 800;
          padding: 8px 3px;
        }

        .rc-marks-table tfoot tr:last-child td {
          background: #f4f7fb;
        }

        .rc-bottom {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 22px;
          align-items: stretch;
          margin-top: 17px;
        }

        .rc-overall {
          background: #f1f6fd;
          border: 1px solid #cbd9eb;
          border-left: 4px solid #285795;
          border-radius: 6px;
          padding: 12px 15px;
        }

        .rc-overall-title {
          font-size: 12px;
          color: #234776;
          font-weight: 800;
          padding-bottom: 8px;
          margin-bottom: 9px;
          border-bottom: 1px solid #d2deed;
          letter-spacing: .5px;
        }

        .rc-result-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin: 8px 0;
          font-size: 11px;
        }

        .rc-result-line span {
          color: #64748b;
          font-weight: 600;
        }

        .rc-result-line strong {
          color: #1e3556;
          font-size: 13px;
        }

        .rc-grade {
          display: inline-block;
          padding: 4px 12px;
          background: #ffffff;
          border: 1px solid #dce5f0;
          border-radius: 5px;
          font-size: 17px !important;
        }

        .rc-signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          align-items: end;
          padding: 10px 5px 3px;
        }

        .rc-sign {
          text-align: center;
          min-width: 0;
        }

        .rc-sign-space {
          height: 39px;
        }

        .rc-sign-line {
          border-top: 1px solid #52647b;
          margin-bottom: 7px;
        }

        .rc-sign-name {
          font-size: 11px;
          font-weight: 800;
          color: #243c5c;
          text-transform: uppercase;
        }

        .rc-sign-label {
          font-size: 10px;
          color: #78869a;
          margin-top: 4px;
        }

        .rc-footer {
          margin-top: 14px;
          padding-top: 8px;
          border-top: 1px solid #e1e7ef;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #8491a2;
        }

        @page {
          size: A4 landscape;
          margin: 7mm;
        }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body * {
            visibility: hidden !important;
          }

          .report-card-document,
          .report-card-document * {
            visibility: visible !important;
          }

          .report-card-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 283mm !important;
            max-width: 283mm !important;
            margin: 0 !important;
            padding: 5mm 6mm !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            font-size: 10px !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .rc-heading {
            padding-bottom: 9px !important;
          }

          .rc-logo {
            width: 52px !important;
            height: 52px !important;
          }

          .rc-school-name {
            font-size: 22px !important;
          }

          .rc-details {
            margin: 9px 0 !important;
            padding: 9px 12px !important;
            gap: 7px 15px !important;
          }

          .rc-section-heading {
            margin: 9px 0 6px !important;
          }

          .rc-marks-table {
            font-size: 9px !important;
          }

          .rc-marks-table th {
            padding: 7px 2px !important;
          }

          .rc-marks-table td {
            padding: 5px 2px !important;
          }

          .rc-marks-table tfoot td {
            padding: 6px 2px !important;
          }

          .rc-bottom {
            margin-top: 11px !important;
            gap: 16px !important;
          }

          .rc-sign-space {
            height: 29px !important;
          }

          .rc-footer {
            margin-top: 9px !important;
            padding-top: 6px !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        @media screen and (max-width: 650px) {
          .report-card-document {
            padding: 15px;
            overflow-x: auto;
          }

          .rc-table-wrap {
            min-width: 650px;
          }

          .rc-details {
            grid-template-columns: 1fr 1fr;
          }

          .rc-bottom {
            min-width: 650px;
          }

          .rc-school-name {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="report-card-document">

        {/* SCHOOL HEADER */}

        <header className="rc-heading">

          {schoolInfo?.school_logo_url && (
            <img
              src={schoolInfo.school_logo_url}
              alt="School Logo"
              className="rc-logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}

          <div>
            <h1 className="rc-school-name">
              {schoolInfo?.school_name || 'RAINBOW PUBLIC SCHOOL'}
            </h1>

            <p className="rc-heading-sub">
              STUDENT ACADEMIC REPORT CARD
            </p>
          </div>

        </header>

        {/* STUDENT INFORMATION */}

        <section className="rc-details">

          <div>
            <span className="rc-detail-label">STUDENT NAME:</span>
            <span className="rc-detail-value">
              {student.student_name}
            </span>
          </div>

          <div>
            <span className="rc-detail-label">ROLL NUMBER:</span>
            <span className="rc-detail-value">
              {student.roll_number || 'N/A'}
            </span>
          </div>

          <div>
            <span className="rc-detail-label">CLASS:</span>
            <span className="rc-detail-value">
              {student.class_name || 'N/A'}
            </span>
          </div>

          <div>
            <span className="rc-detail-label">DATE:</span>
            <span className="rc-detail-value">{today}</span>
          </div>

          <div>
            <span className="rc-detail-label">TOTAL SUBJECTS:</span>
            <span className="rc-detail-value">
              {gridData.length}
            </span>
          </div>

          <div>
            <span className="rc-detail-label">ACADEMIC STATUS:</span>
            <span className="rc-detail-value">
              {overallTotal.max > 0 ? 'COMPLETED' : 'PENDING'}
            </span>
          </div>

        </section>

        {/* MARKSHEET TABLE */}

        <div className="rc-section-heading">
          Academic Performance
        </div>

        <div className="rc-table-wrap">

          <table className="rc-marks-table">

            <thead>
              <tr>
                <th>SUBJECT</th>
                <th>TERM 1</th>
                <th>TERM 2</th>
                <th>HALF YEARLY</th>
                <th>TOTAL<br />(1+2+HY)</th>
                <th>TERM 3</th>
                <th>TERM 4</th>
                <th>FINAL</th>
                <th>TOTAL<br />(3+4+FIN)</th>
              </tr>
            </thead>

            <tbody>

              {gridData.map((row, idx) => {

                const t1m = row.marks['Term 1']?.marks_obtained ?? '-'
                const t2m = row.marks['Term 2']?.marks_obtained ?? '-'
                const hym = row.marks['Half Yearly']?.marks_obtained ?? '-'

                const t3m = row.marks['Term 3']?.marks_obtained ?? '-'
                const t4m = row.marks['Term 4']?.marks_obtained ?? '-'
                const finm = row.marks['Final Exam']?.marks_obtained ?? '-'

                const group1 = [t1m, t2m, hym].some(v => v !== '-')
                  ? [t1m, t2m, hym].reduce(
                      (sum, v) => sum + (v === '-' ? 0 : Number(v)), 0
                    )
                  : '-'

                const group2 = [t3m, t4m, finm].some(v => v !== '-')
                  ? [t3m, t4m, finm].reduce(
                      (sum, v) => sum + (v === '-' ? 0 : Number(v)), 0
                    )
                  : '-'

                return (
                  <tr key={idx}>
                    <td>{row.subject}</td>
                    <td>{t1m}</td>
                    <td>{t2m}</td>
                    <td>{hym}</td>
                    <td>{group1}</td>
                    <td>{t3m}</td>
                    <td>{t4m}</td>
                    <td>{finm}</td>
                    <td>{group2}</td>
                  </tr>
                )
              })}

              {gridData.length === 0 && (
                <tr>
                  <td colSpan="9">No marks available yet.</td>
                </tr>
              )}

            </tbody>

            <tfoot>

              <tr>
                <td>TOTAL MARKS</td>
                <td>{t1.obt} / {t1.max}</td>
                <td>{t2.obt} / {t2.max}</td>
                <td>{hy.obt} / {hy.max}</td>
                <td>{group1Total.obt} / {group1Total.max}</td>
                <td>{t3.obt} / {t3.max}</td>
                <td>{t4.obt} / {t4.max}</td>
                <td>{final.obt} / {final.max}</td>
                <td>{group2Total.obt} / {group2Total.max}</td>
              </tr>

              <tr>
                <td>PERCENTAGE</td>
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

        {/* RESULT AND SIGNATURES */}

        <section className="rc-bottom">

          <div className="rc-overall">

            <div className="rc-overall-title">
              OVERALL ACADEMIC RESULT
            </div>

            <div className="rc-result-line">
              <span>Grand Total</span>
              <strong>
                {overallTotal.obt} / {overallTotal.max}
              </strong>
            </div>

            <div className="rc-result-line">
              <span>Overall Percentage</span>
              <strong>{overallPercent}%</strong>
            </div>

            <div className="rc-result-line">
              <span>Final Grade</span>
              <strong className="rc-grade">{grade}</strong>
            </div>

          </div>

          {/* TEACHER AND PRINCIPAL SIGNATURE */}

          <div className="rc-signatures">

            <div className="rc-sign">

              <div className="rc-sign-space"></div>

              <div className="rc-sign-line"></div>

              <div className="rc-sign-name">
                CLASS TEACHER
              </div>

              <div className="rc-sign-label">
                Class Teacher Signature
              </div>

            </div>

            <div className="rc-sign">

              <div className="rc-sign-space"></div>

              <div className="rc-sign-line"></div>

              <div className="rc-sign-name">
                {schoolInfo?.principal_name || 'PRINCIPAL'}
              </div>

              <div className="rc-sign-label">
                Principal Signature
              </div>

            </div>

          </div>

        </section>

        <footer className="rc-footer">
          <span>
            {schoolInfo?.school_name || 'RAINBOW PUBLIC SCHOOL'}
          </span>

          <span>
            OFFICIAL STUDENT REPORT CARD
          </span>
        </footer>

      </div>
    </>
  )
}
