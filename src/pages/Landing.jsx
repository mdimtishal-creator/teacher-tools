
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageCircle,
  Heart,
  Mail,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react'
import Button from '../components/ui/Button'
import InstallAppButton from '../components/InstallAppButton'

const features = [
  {
    icon: FileText,
    title: 'Print-Ready Report Cards',
    description:
      'Generate professional A4 report cards with your school logo, grades, and percentages in seconds.',
    style: 'bg-blue-50 text-blue-700 ring-blue-100',
    number: '01',
  },
  {
    icon: Zap,
    title: 'Bulk Marks Entry',
    description:
      'Enter marks for the whole class in one simple table. Totals and grades are calculated automatically.',
    style: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    number: '02',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description:
      'Your school data is stored securely. Only you can see your classes and students.',
    style: 'bg-violet-50 text-violet-700 ring-violet-100',
    number: '03',
  },
]

function ReportCardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-blue-200/60 via-indigo-100/40 to-cyan-100/60 blur-2xl" />

      <div className="relative rounded-[1.75rem] border border-white bg-white/95 p-3 shadow-2xl sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Teacher Tools</p>
              <p className="text-xs text-slate-400">Student report</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Ready to print
          </span>
        </div>

        <div className="px-2 py-5">
          <div className="flex justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Academic Progress
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                Report Card
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Student academic performance
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Award className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">STUDENT</p>
              <p className="mt-1 font-bold text-slate-800">Aarav Sharma</p>
              <p className="text-xs text-slate-500">Class 8 - A</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3">
              <p className="text-xs font-semibold text-blue-500">RESULT</p>
              <p className="mt-1 text-3xl font-black text-blue-700">92%</p>
              <p className="text-xs text-blue-600">Excellent progress</p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
            <div className="grid grid-cols-3 bg-slate-50 p-3 text-xs font-bold text-slate-400">
              <span>Subject</span>
              <span>Marks</span>
              <span>Grade</span>
            </div>
            {[
              ['English', '94/100', 'A+'],
              ['Mathematics', '91/100', 'A+'],
              ['Science', '90/100', 'A+'],
            ].map(([subject, marks, grade]) => (
              <div
                key={subject}
                className="grid grid-cols-3 border-t border-slate-100 p-3 text-xs"
              >
                <span className="font-semibold text-slate-700">{subject}</span>
                <span className="text-slate-500">{marks}</span>
                <span className="font-bold text-emerald-600">{grade}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
            <span className="flex items-center gap-2 text-xs font-semibold">
              <FileText className="h-4 w-4 text-blue-300" />
              A4 Print-Ready Format
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl bg-white p-3 shadow-xl sm:flex">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">Less manual work</p>
          <p className="text-xs text-slate-500">More time for teaching</p>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Teacher Tools
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-700">
              Sign in
            </Link>
            <Link to="/login">
              <Button size="sm" className="rounded-xl px-4">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
          <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <Zap className="h-4 w-4" />
                Built for Indian Teachers
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Manage your school
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  10x faster.
                </span>
                Better reports. Less effort.
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0">
                Say goodbye to manual calculations. Create classes, enter marks,
                and generate beautiful, print-ready A4 report cards in seconds.
                100% free.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link to="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full rounded-xl px-8 py-4 sm:w-auto">
                    Start for Free <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm font-medium text-slate-500">
                  No credit card required.
                </p>
              </div>

              <div className="mx-auto mt-8 max-w-md lg:mx-0">
                <InstallAppButton />
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-500 lg:justify-start">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Easy to get started
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Your records stay private
                </span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-xl px-2 sm:px-6 lg:px-0">
              <ReportCardPreview />
            </div>
          </div>
        </section>

        {/* Existing Features */}
        <section id="features" className="border-y border-slate-100 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-blue-600">
                <Sparkles className="h-4 w-4" />
                Simple tools, meaningful impact
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Everything you need to save hours
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Built specifically for the needs of teachers. No complex setup,
                no training required.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description, style, number }) => (
                <article
                  key={title}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${style}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-slate-300">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-extrabold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                  <div className="mt-7 h-1 w-12 rounded-full bg-blue-100 transition-all group-hover:w-20 group-hover:bg-blue-600" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
              <BookOpen className="h-8 w-8" />
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-widest text-blue-600">
              A Tool Made With Purpose
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Why I Built Teacher Tools
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              As a developer, I saw how much time teachers spend on manual
              calculations and writing report cards. I built this tool to solve
              that exact problem. My goal is to make school management effortless
              so educators can focus on what matters most — teaching. This tool
              is 100% free for every school.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://wa.me/918318284984"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#20bd5a] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>

              <a
                href="mailto:info.schoolsetup@gmail.com"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 sm:w-auto"
              >
                <Mail className="h-5 w-5" />
                Email Support
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center">
        <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600">
          Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> for Indian Teachers
        </p>
        <p className="mt-2 text-xs text-slate-400">
          © {new Date().getFullYear()} Teacher Tools. All rights reserved.
        </p>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/918318284984"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 hover:bg-[#20bd5a] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
        title="Contact Developer"
        aria-label="Contact Developer on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  )
}
