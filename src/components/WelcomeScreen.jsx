import { Zap, HelpCircle, BookOpen, MessageSquare, ShieldCheck, Cpu, Globe } from 'lucide-react'

const SUGGESTIONS = [
  { icon: <Zap className="w-5 h-5 text-yellow-400" />,           title: 'Test Plan Creation',  desc: 'Create a comprehensive test plan for your software project',  prompt: 'Help me create a comprehensive test plan for a software project.' },
  { icon: <HelpCircle className="w-5 h-5 text-blue-400" />,      title: 'Test Case Creation',  desc: 'Write detailed, structured test cases for any feature',        prompt: 'Help me write detailed test cases for a feature I am testing.' },
  { icon: <BookOpen className="w-5 h-5 text-green-400" />,       title: 'Draft SAS Scripts',   desc: 'Generate SAS scripts for automated testing workflows',         prompt: 'Help me draft SAS scripts for automated testing.' },
  { icon: <MessageSquare className="w-5 h-5 text-purple-400" />, title: 'End of Test Report',  desc: 'Summarize QA results into a professional end of test report',  prompt: 'Help me generate an end of test report summarizing the QA results.' },
]

const BADGES = [
  { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Secure & Private' },
  { icon: <Cpu className="w-3.5 h-3.5" />,         label: 'Azure GPT-4o' },
  { icon: <Globe className="w-3.5 h-3.5" />,        label: '24/7 Available' },
]

export default function WelcomeScreen({ onPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center select-none overflow-y-auto">
      <div className="relative mb-6">
        <div className="w-20 h-20 gradient-brand rounded-3xl flex items-center justify-center shadow-glow">
          <svg viewBox="0 0 32 32" fill="none" className="w-11 h-11">
            <path d="M6 22l5-9 4 6 3-5 6 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="23" cy="9" r="3" fill="rgba(255,255,255,0.75)"/>
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-surface-DEFAULT flex items-center justify-center">
          <span className="w-2 h-2 bg-white rounded-full" />
        </span>
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">
        How can I <span className="gradient-text">assist your QA</span> today?
      </h2>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        I'm your QA-powered support assistant. Ask me anything about Quality Assurance Support.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {BADGES.map(b => (
          <span key={b.label}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card border border-surface-border text-xs text-slate-400 font-medium">
            <span className="text-brand-400">{b.icon}</span>
            {b.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SUGGESTIONS.map(s => (
          <button key={s.title} onClick={() => onPrompt(s.prompt)}
            className="text-left p-4 rounded-2xl bg-surface-card border border-surface-border hover:border-brand-600/60 hover:bg-brand-950/20 transition-all group active:scale-95">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-surface-DEFAULT group-hover:bg-brand-950/50 transition">
                {s.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition">{s.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
