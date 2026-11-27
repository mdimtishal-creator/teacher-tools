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

  const grade = getGrade(overallPercent)
  const today = new Date().toLocaleDateString('en-GB')

  const exams = [
    ['Term 1', 't1'],
    ['Term 2', 't2'],
    ['Half Yearly', 'hy'],
    ['Term 3', 't3'],
    ['Term 4', 't4'],
    ['Final Exam', 'final']
  ]

  const examMarks = (row, name) =>
    row.marks?.[name]?.marks_obtained ?? '—'

  const addMarks = (values) => {
    const available = values.filter(v => v !== '—')
    return available.length
      ? available.reduce((sum, v) => sum + Number(v || 0), 0)
      : '—'
  }

  const gradeText = String(grade ?? '—')
  const compact = gridData.length > 10

  return (
    <>
      <style>{`
        .pro-report {
          --navy: #152f50;
          --blue: #24558a;
          --gold: #b9934d;
          --ink: #26364a;
          --muted: #718096;
          width: 100%;
          max-width: 1120px;
          margin: 24px auto;
          padding: 30px 34px;
          background: #fff;
          color: var(--ink);
          font-family: Arial, Helvetica, sans-serif;
          border: 1px solid #dce3ec;
          border-radius: 8px;
          box-shadow: 0 10px 35px rgba(21,47,80,.09);
        }

        .pr-top {
          height: 5px;
          margin: -30px -34px 22px;
          background: linear-gradient(90deg,#152f50 0 75%,#b9934d 75%);
          border-radius: 8px 8px 0 0;
        }

        .pr-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--navy);
        }

        .pr-logo {
          width: 72px;
          height: 72px;
          object-fit: contain;
        }

        .pr-school {
          margin: 0;
          color: var(--navy);
          font-size: 26px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .pr-school-sub {
          margin-top: 7px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
          color: var(--gold);
        }

        .pr-title {
          display: inline-block;
          margin-top: 12px;
          padding: 6px 22px;
          background: var(--navy);
          color: white;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          border-radius: 3px;
        }

        .pr-student {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          margin: 17px 0;
          background: #f5f8fc;
          border: 1px solid #dce4ee;
          border-radius: 6px;
          overflow: hidden;
        }

        .pr-field {
          padding: 11px 13px;
          border-right: 1px solid #e0e6ef;
          border-bottom: 1px solid #e0e6ef;
          min-width: 0;
        }

        .pr-label {
          display: block;
          color: #8190a4;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .pr-value {
          color: var(--navy);
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }

        .pr-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 17px 0 9px;
          color: var(--navy);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .pr-section:after {
          content: "";
          flex: 1;
          height: 1px;
          background: #dce3ed;
        }

        .pr-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 10px;
        }

        .pr-table th {
          background: var(--navy);
          color: white;
          padding: 10px 3px;
          border: 1px solid #294767;
          font-size: 9px;
          line-height: 1.35;
          text-align: center;
        }

        .pr-table th:first-child,
        .pr-table td:first-child {
          width: 17%;
          text-align: left;
          padding-left: 9px;
        }

        .pr-table td {
          padding: 9px 3px;
          text-align: center;
          border: 1px solid #dce3ec;
          color: #3a4a5e;
          font-weight: 600;
        }

        .pr-table tbody tr:nth-child(even) {
          background: #f7f9fc;
        }

        .pr-table tbody td:first-child {
          color: var(--navy);
          font-weight: 800;
          text-transform: uppercase;
        }

        .pr-table .pr-group {
          background: #edf3fa;
          color: #20528a;
          font-weight: 900;
        }

        .pr-table tfoot td {
          padding: 9px 3px;
          background: #eaf0f7;
          color: var(--navy);
          font-weight: 900;
        }

        .pr-table tfoot tr:last-child td {
          background: #f3f6fa;
        }

        .pr-result-area {
          display: grid;
          grid-template-columns: 1.05fr 1.35fr;
          gap: 20px;
          margin-top: 20px;
          align-items: stretch;
        }

        .pr-result {
          padding: 15px;
          border: 1px solid #cfdae8;
          border-left: 5px solid var(--gold);
          border-radius: 7px;
          background: #f5f8fc;
        }

        .pr-result-heading {
          color: var(--navy);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          padding-bottom: 10px;
          border-bottom: 1px solid #dce4ee;
          margin-bottom: 12px;
        }

        .pr-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .pr-total span {
          color: var(--muted);
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .pr-total strong {
          color: var(--navy);
          font-size: 20px;
          font-weight: 900;
        }

        .pr-stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 8px;
          margin-top: 15px;
          padding-top: 12px;
          border-top: 1px solid #dce4ee;
        }

        .pr-stat-label {
          display: block;
          color: #8290a2;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .7px;
          margin-bottom: 7px;
        }

        .pr-stat-value {
          color: var(--navy);
          font-size: 16px;
          font-weight: 900;
        }

        .pr-grade {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 39px;
          min-height: 34px;
          padding: 4px 9px;
          border-radius: 5px;
          background: var(--navy);
          color: #fff;
          font-size: 16px;
          font-weight: 900;
        }

        .pr-approvals {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: end;
          padding: 8px 5px 3px;
        }

        .pr-sign {
          text-align: center;
        }

        .pr-sign-space {
          height: 55px;
        }

        .pr-sign-line {
          border-top: 1px solid #53677e;
          margin-bottom: 8px;
        }

        .pr-sign-name {
          color: var(--navy);
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .pr-sign-sub {
          margin-top: 5px;
          color: #8290a2;
          font-size: 9px;
        }

        .pr-footer {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 17px;
          padding-top: 9px;
          border-top: 1px solid #e0e6ed;
          color: #8793a4;
          font-size: 9px;
        }

        .pr-compact .pr-table td {
          padding-top: 6px;
          padding-bottom: 6px;
        }

        .pr-compact .pr-sign-space {
          height: 35px;
        }

        @page {
          size: A4 landscape;
          margin: 7mm;
        }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          .pro-report,
          .pro-report * {
            visibility: visible !important;
          }

          .pro-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 283mm !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 4mm 5mm !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .pr-top {
            margin: -4mm -5mm 4mm !important;
            border-radius: 0 !important;
          }

          .pr-header {
            padding-bottom: 7px !important;
          }

          .pr-logo {
            width: 45px !important;
            height: 45px !important;
          }

          .pr-school {
            font-size: 21px !important;
          }

          .pr-student {
            margin: 8px 0 !important;
          }

          .pr-field {
            padding: 6px 9px !important;
          }

          .pr-section {
            margin: 8px 0 5px !important;
          }

          .pr-table th {
            padding: 6px 2px !important;
            font-size: 8px !important;
          }

          .pr-table td {
            padding: 5px 2px !important;
            font-size: 9px !important;
          }

          .pr-result-area {
            margin-top: 10px !important;
            gap: 12px !important;
          }

          .pr-result {
            padding: 9px 12px !important;
          }

          .pr-sign-space {
            height: 30px !important;
          }

          .pr-footer {
            margin-top: 8px !important;
            padding-top: 5px !important;
          }

          .pr-table tr,
          .pr-result-area {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        @media screen and (max-width: 650px) {
          .pro-report {
            padding: 15px;
            overflow-x: auto;
          }

          .pr-header,
          .pr-student,
          .pr-table,
          .pr-result-area {
            min-width: 650px;
          }
        }
      `}</style>

      <article className={`pro-report ${compact ? 'pr-compact' : ''}`}>

        <div className="pr-top" />

        {/* SCHOOL IDENTITY */}

        <header className="pr-header">

          {schoolInfo?.school_logo_url && (
            <img
              src={schoolInfo.school_logo_url}
              alt="School Logo"
              className="pr-logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}

          <div>
            <h1 className="pr-school">
              {schoolInfo?.school_name || 'RAINBOW PUBLIC SCHOOL'}
            </h1>

            <div className="pr-school-sub">
              EXCELLENCE IN EDUCATION
            </div>

            <div className="pr-title">
              STUDENT REPORT CARD
            </div>
          </div>

        </header>

        {/* STUDENT DETAILS */}

        <section className="pr-student">

          <div className="pr-field">
            <span className="pr-label">Student Name</span>
            <span className="pr-value">
              {student.student_name || '—'}
            </span>
          </div>

          <div className="pr-field">
            <span className="pr-label">Roll Number</span>
            <span className="pr-value">
              {student.roll_number || 'N/A'}
            </span>
          </div>

          <div className="pr-field">
            <span className="pr-label">Class</span>
            <span className="pr-value">
              {student.class_name || 'N/A'}
            </span>
          </div>

          <div className="pr-field">
            <span className="pr-label">Academic Report</span>
            <span className="pr-value">Annual Result</span>
          </div>

          <div className="pr-field">
            <span className="pr-label">Date of Issue</span>
            <span className="pr-value">{today}</span>
          </div>

          <div className="pr-field">
            <span className="pr-label">Subjects</span>
            <span className="pr-value">{gridData.length}</span>
          </div>

        </section>

        {/* SUBJECT PERFORMANCE */}

        <div className="pr-section">
          SCHOLASTIC PERFORMANCE
        </div>

        <table className="pr-table">

          <thead>
            <tr>
              <th>SUBJECT</th>
              <th>TERM 1</th>
              <th>TERM 2</th>
              <th>HALF<br/>YEARLY</th>
              <th>GROUP 1<br/>TOTAL</th>
              <th>TERM 3</th>
              <th>TERM 4</th>
              <th>FINAL<br/>EXAM</th>
              <th>GROUP 2<br/>TOTAL</th>
            </tr>
          </thead>

          <tbody>

            {gridData.map((row, idx) => {
              const a = examMarks(row, 'Term 1')
              const b = examMarks(row, 'Term 2')
              const c = examMarks(row, 'Half Yearly')
              const d = examMarks(row, 'Term 3')
              const e = examMarks(row, 'Term 4')
              const f = examMarks(row, 'Final Exam')

              return (
                <tr key={idx}>
                  <td>{row.subject}</td>
                  <td>{a}</td>
                  <td>{b}</td>
                  <td>{c}</td>
                  <td className="pr-group">
                    {addMarks([a,b,c])}
                  </td>
                  <td>{d}</td>
                  <td>{e}</td>
                  <td>{f}</td>
                  <td className="pr-group">
                    {addMarks([d,e,f])}
                  </td>
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

        {/* FINAL RESULT */}

        <div className="pr-section">
          FINAL ACADEMIC RESULT
        </div>

        <section className="pr-result-area">

          <div className="pr-result">

            <div className="pr-result-heading">
              PERFORMANCE SUMMARY
            </div>

            <div className="pr-total">
              <span>Grand Total</span>
              <strong>
                {overallTotal.obt} / {overallTotal.max}
              </strong>
            </div>

            <div className="pr-stats">

              <div>
                <span className="pr-stat-label">
                  PERCENTAGE
                </span>
                <strong className="pr-stat-value">
                  {overallPercent}%
                </strong>
              </div>

              <div>
                <span className="pr-stat-label">
                  FINAL GRADE
                </span>
                <strong className="pr-grade">
                  {gradeText}
                </strong>
              </div>

              <div>
                <span className="pr-stat-label">
                  SUBJECTS
                </span>
                <strong className="pr-stat-value">
                  {gridData.length}
                </strong>
              </div>

            </div>

          </div>

          {/* APPROVAL ORDER */}

          <div className="pr-approvals">

            <div className="pr-sign">

              <div className="pr-sign-space" />

              <div className="pr-sign-line" />

              <div className="pr-sign-name">
                CLASS TEACHER
              </div>

              <div className="pr-sign-sub">
                Checked & Recommended
              </div>

            </div>

            <div className="pr-sign">

              <div className="pr-sign-space" />

              <div className="pr-sign-line" />

              <div className="pr-sign-name">
                {schoolInfo?.principal_name || 'PRINCIPAL'}
              </div>

              <div className="pr-sign-sub">
                Approved By Principal
              </div>

            </div>

          </div>

        </section>

        <footer className="pr-footer">
          <span>
            {schoolInfo?.school_name || 'Rainbow Public School'}
          </span>

          <span>
            OFFICIAL ACADEMIC DOCUMENT
          </span>
        </footer>

      </article>
    </>
  )
}

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
