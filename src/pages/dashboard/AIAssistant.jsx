import AIChatPanel from '../../components/ai/AIChatPanel'

export default function AIAssistant() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">
          Schoolsetup AI Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your intelligent school management companion.
        </p>
      </div>

      <div className="h-[calc(100vh-190px)] min-h-[500px]">
        <AIChatPanel />
      </div>
    </div>
  )
}
