
import { useRef, useState, useEffect } from 'react'
import {
  Sparkles, Send, Bot, User, Loader2,
  MessageSquare, GraduationCap
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const suggestions = [
  'How many students are in my school?',
  'Show students with low marks',
  'Analyse class performance',
  'Create a student performance summary'
]

export default function AIChatPanel({ compact = false }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am Schoolsetup AI Assistant. I am here to help you manage and understand your school data. What would you like to do today?'
    }
  ])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text = message) => {
    const question = text.trim()
    if (!question || loading) return

    setMessages(prev => [...prev, {
      role: 'user',
      content: question
    }])

    setMessage('')
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke(
        'schoolsetup-ai',
        {
          body: { message: question }
        }
      )

      if (error) throw error

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data?.reply || 'I could not generate a response. Please try again.'
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'AI service abhi connect nahi hua hai. Backend setup complete hone ke baad main aapke school data ko samajhkar jawab de paunga.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-white flex flex-col overflow-hidden ${
      compact
        ? 'h-full rounded-2xl'
        : 'h-full min-h-[600px] rounded-2xl border border-border shadow-card'
    }`}>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white px-5 py-4 flex items-center gap-3 shrink-0">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-blue-200" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base">
            Schoolsetup AI Assistant
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Your intelligent school companion
          </p>
        </div>

        <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full">
          AI
        </span>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">

        {messages.length === 1 && (
          <div className="text-center py-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={32} />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              How can I help you?
            </h3>

            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Ask questions about your students, classes, marks and school performance.
            </p>

            <div className="grid gap-2 mt-6 max-w-md mx-auto">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(item)}
                  disabled={loading}
                  className="text-left text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition disabled:opacity-50"
                >
                  <MessageSquare size={15} className="inline mr-2 text-blue-600" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                item.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                item.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-white'
              }`}>
                {item.role === 'user'
                  ? <User size={16} />
                  : <Bot size={17} />
                }
              </div>

              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${
                item.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
              }`}>
                {item.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center">
                <Bot size={17} />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={e => {
          e.preventDefault()
          sendMessage()
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0"
      >
        <div className="flex items-end gap-2 bg-slate-100 border border-slate-200 rounded-2xl p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask Schoolsetup AI anything..."
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none border-0 px-2 py-2 text-sm text-slate-800 placeholder:text-slate-400 max-h-28"
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-40 transition"
          >
            <Send size={17} />
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-2">
          AI can make mistakes. Verify important school records.
        </p>
      </form>
    </div>
  )
}
