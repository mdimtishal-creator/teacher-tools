import { Link } from 'react-router-dom'
import { GraduationCap, FileText, ShieldCheck, Zap, ArrowRight, MessageCircle, Heart, Mail } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-muted overflow-hidden relative">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-dark tracking-tight">Teacher Tools</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-dark hover:text-primary-600 transition">
              Sign in
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" /> The #1 Tool for Indian Teachers
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-dark tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            Manage your school <span className="text-primary-600">10x faster</span> with automated report cards.
          </h1>
          
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10">
            Say goodbye to manual calculations. Create classes, enter marks, and generate beautiful, print-ready A4 report cards in seconds. 100% free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Start for Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-text-muted mt-4 sm:mt-0 sm:ml-4">No credit card required.</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">Everything you need to save hours</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Built specifically for the needs of teachers. No complex setup, no training required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-surface-muted border border-border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Print-Ready Report Cards</h3>
              <p className="text-text-muted">Generate professional A4 report cards with school logo, grades, and percentages instantly.</p>
            </div>

            <div className="p-8 rounded-2xl bg-surface-muted border border-border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Bulk Marks Entry</h3>
              <p className="text-text-muted">Enter marks for the whole class in one simple table. Auto-calculates totals and grades.</p>
            </div>

            <div className="p-8 rounded-2xl bg-surface-muted border border-border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Secure & Private</h3>
              <p className="text-text-muted">Your school data is stored securely. Only you can see your classes and students.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT THE CREATOR SECTION */}
      <div className="py-24 bg-surface-muted border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <GraduationCap className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-4">Built by a Teacher, for Teachers</h2>
          <p className="text-lg text-text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            I built Teacher Tools to solve a simple problem: teachers spend hours doing manual calculations and writing report cards. My goal is to make your life easier so you can focus on teaching, not paperwork. This tool is 100% free for every school.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/918318284984" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#20bd5a] transition shadow-sm w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
            <a 
              href="mailto:info.schoolsetup@gmail.com" 
              className="flex items-center gap-2 bg-white border border-border text-dark px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition shadow-sm w-full sm:w-auto justify-center"
            >
              <Mail className="w-5 h-5" /> Email Support
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 border-t border-border text-center text-text-muted flex flex-col items-center justify-center">
        <p className="flex items-center gap-1">Made with <Heart className="w-4 h-4 text-red-500" /> for Indian Teachers</p>
        <p className="mt-2 text-sm">© {new Date().getFullYear()} Teacher Tools. All rights reserved.</p>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/918318284984" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50 flex items-center justify-center"
        title="Contact Developer"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

    </div>
  )
}
