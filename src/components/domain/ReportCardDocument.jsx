/* BETTER ONE-PAGE PRINT LAYOUT */

.report-sheet {
  min-height: 190mm !important;
  display: flex !important;
  flex-direction: column !important;
}

.report-top {
  padding-bottom: 10px !important;
}

.report-logo {
  width: 62px !important;
  height: 62px !important;
}

.report-school-name {
  font-size: 24px !important;
}

.report-student-info {
  margin: 10px 0 !important;
  padding: 9px 12px !important;
  gap: 9px 18px !important;
}

.report-info-item {
  font-size: 11px !important;
}

.report-table {
  font-size: 10px !important;
}

.report-table th,
.report-table td {
  padding: 6px 4px !important;
}

.report-table thead tr:first-child th {
  padding: 8px 4px !important;
  font-size: 10px !important;
}

.report-table thead tr:nth-child(2) th {
  font-size: 9px !important;
}

.report-summary {
  margin-top: 12px !important;
  gap: 10px !important;
}

.report-summary-card {
  padding: 9px !important;
}

.report-summary-card span {
  font-size: 10px !important;
}

.report-summary-card strong {
  font-size: 17px !important;
  margin-top: 5px !important;
}

/* SIGNATURE SPACE */
.report-signatures {
  margin-top: auto !important;
  padding: 0 25px 5px !important;
  padding-top: 35px !important;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

.report-signature {
  width: 210px !important;
  padding-top: 0 !important;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

.report-signature-line {
  margin-bottom: 8px !important;
  border-top: 1px solid #333 !important;
}

.report-signature strong {
  font-size: 12px !important;
}

.report-signature span {
  font-size: 10px !important;
}

.report-footer {
  display: none !important;
}
