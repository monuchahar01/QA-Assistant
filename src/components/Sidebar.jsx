import { MessageSquare, PlusCircle, Zap, HelpCircle, BookOpen, LogOut, ChevronRight } from 'lucide-react'

const QUICK_PROMPTS = [
  { icon: <Zap className="w-4 h-4" />,           label: 'Test Plan Creation',  prompt: 'Help me create a comprehensive test plan for a software project.' },
  { icon: <HelpCircle className="w-4 h-4" />,    label: 'Test Case Creation',  prompt: 'Help me write detailed test cases for a feature I am testing.' },
  { icon: <BookOpen className="w-4 h-4" />,      label: 'Draft SAS Scripts',   prompt: 'Help me draft SAS scripts for automated testing.' },
  { icon: <MessageSquare className="w-4 h-4" />, label: 'End of Test Report',  prompt: 'Help me generate an end of test report summarizing the QA results.' },
]

export default function Sidebar({ onNewChat, onQuickPrompt, onLogout, messageCount, isOpen }) {
  return (
    <aside className={`
      flex flex-col h-full w-72 bg-surface-card border-r border-surface-border
      transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      fixed md:relative z-30
    `}>
      {/* Logo */}
      <div className="p-5 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-glow-sm">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <path d="M6 22l5-9 4 6 3-5 6 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="23" cy="9" r="2.5" fill="rgba(255,255,255,0.7)"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">QA AI</h1>
            <p className="text-xs text-slate-500">Azure GPT-4o</p>
          </div>
        </div>
      </div>

      {/* New chat */}
      <div className="p-4">
        <button onClick={onNewChat}
          className="w-full flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-glow-sm">
          <PlusCircle className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      {/* Quick actions */}
      <div className="px-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Quick Actions</p>
        <div className="space-y-1">
          {QUICK_PROMPTS.map((qp) => (
            <button key={qp.label} onClick={() => onQuickPrompt(qp.prompt)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-surface-DEFAULT hover:text-white transition-all group">
              <span className="text-brand-400 group-hover:text-brand-300 transition">{qp.icon}</span>
              <span className="flex-1 text-left">{qp.label}</span>
              <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 my-3 p-3 rounded-xl bg-surface-DEFAULT border border-surface-border">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Messages this session</span>
          <span className="text-sm font-bold gradient-text">{messageCount}</span>
        </div>
        <div className="mt-2 h-1.5 bg-surface-border rounded-full overflow-hidden">
          <div className="h-full gradient-brand rounded-full transition-all duration-500"
               style={{ width: `${Math.min(100, (messageCount / 20) * 100)}%` }} />
        </div>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="p-4 border-t border-surface-border space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-DEFAULT">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-slate-400">Connected · GPT-4o 2024-11-20</span>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all">
          <LogOut className="w-4 h-4" />
          Change API Key
        </button>
      </div>
    </aside>
  )
}
