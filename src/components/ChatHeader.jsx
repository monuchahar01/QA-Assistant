import { Menu, Trash2, Download, Info } from 'lucide-react'

export default function ChatHeader({ onToggleSidebar, onClear, messageCount }) {
  const exportChat = () => {
    window.dispatchEvent(new CustomEvent('exportChat'))
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-surface-border glass shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-surface-DEFAULT text-slate-400 hover:text-white transition">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4">
                <path d="M6 22l5-9 4 6 3-5 6 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="23" cy="9" r="2.5" fill="rgba(255,255,255,0.7)"/>
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface-card" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">QA Assistant</p>
            <p className="text-xs text-green-400 leading-tight">Online · Ready to help</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {messageCount > 0 && (
          <>
            <button onClick={exportChat}
              className="p-2 rounded-lg hover:bg-surface-DEFAULT text-slate-400 hover:text-white transition" title="Export chat">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onClear}
              className="p-2 rounded-lg hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition" title="Clear chat">
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
        <button className="p-2 rounded-lg hover:bg-surface-DEFAULT text-slate-400 hover:text-white transition" title="About">
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
