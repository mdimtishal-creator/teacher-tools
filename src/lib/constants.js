// src/lib/constants.js
// Ye values abhi BulkMarksEntry.jsx aur StudentMarks.jsx mein hardcoded hain.
// Ab ek jagah rahengi taaki drift bug na ho.
// IMPORTANT: values bilkul wahi hain jo existing code mein hain — kuch nahi badla.

export const EXAMS = [
  'Term 1',
  'Term 2',
  'Half Yearly',
  'Term 3',
  'Term 4',
  'Final Exam',
]

// Report card ke group definitions — existing logic ke mutabiq
export const EXAM_GROUPS = {
  group1: ['Term 1', 'Term 2', 'Half Yearly'],
  group2: ['Term 3', 'Term 4', 'Final Exam'],
}

// Grade thresholds — StudentMarks.jsx ke getGrade() se exactly same
export const GRADE_THRESHOLDS = [
  { min: 90, grade: 'A+' },
  { min: 80, grade: 'A' },
  { min: 70, grade: 'B' },
  { min: 60, grade: 'C' },
  { min: 50, grade: 'D' },
  { min: 0,  grade: 'F' },
]

export function getGrade(percent) {
  const p = Number(percent)
  const match = GRADE_THRESHOLDS.find(t => p >= t.min)
  return match ? match.grade : 'F'
}
