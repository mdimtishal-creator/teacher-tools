
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { FileText, ArrowRight, GraduationCap } from 'lucide-react'

export default function ReportCardsHome() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('classes')
      .select('*')
      .order('class_name', { ascending: true })

    if (data) setClasses(data)
    setLoading(false)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark tracking-tight">
          Report Cards
        </h1>
        <p className="text-text-muted mt-1">
          Select a class to view and generate student report cards.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-24 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border border-dashed">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-dark mb-2">
            No classes found
          </h3>
          <p className="text-text-muted">
            Please add a class first to generate report cards.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <Link
              to={`/dashboard/report-cards/class/${cls.id}`}
              key={cls.id}
              className="flex items-center p-6 bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all group"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mr-5 shrink-0 group-hover:bg-purple-100 transition-colors">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-dark">
                  {cls.class_name}
                </h3>
                <p className="text-sm text-text-muted mt-0.5">
                  View student report cards
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-text-subtle group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
