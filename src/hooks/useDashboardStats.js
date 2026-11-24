import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDashboardStats() {
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    subjects: 0,
    marks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // 1. Total Classes
        const { count: classesCount } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true })

        // 2. Total Students
        const { count: studentsCount } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })

        // 3. Total Subjects
        const { count: subjectsCount } = await supabase
          .from('subjects')
          .select('*', { count: 'exact', head: true })

        // 4. Total Marks Entries
        const { count: marksCount } = await supabase
          .from('marks')
          .select('*', { count: 'exact', head: true })

        setStats({
          classes: classesCount || 0,
          students: studentsCount || 0,
          subjects: subjectsCount || 0,
          marks: marksCount || 0
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}
