import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Square } from 'lucide-react'

const MAX_ROWS = 5

export default function ChatInput({ onSend, onStop, isStreaming, disabled }) {
  const [text, setText]  = useState('')
  const textareaRef      = useRef(null)

  // Auto-resize — stays at 1 row until user types multiple lines
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const lineH = parseInt(getComputedStyle(ta).lineHeight) || 20
    const maxH  = lineH * MAX_ROWS + 16
    ta.style.height = Math.min(ta.scrollHeight, maxH) + 'px'
  }, [text])

  const handleSend = useCallback(() => {
    if (!text.trim() || isStreaming) return
    onSend(text)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }, [text, isStreaming, onSend])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const nearLimit = text.length > 3500

  return (
    <div className="shrink-0 px-4 pb-3 pt-2 border-t border-surface-border glass">
      {/* Compact input row */}
      <div className={`flex items-end gap-2 bg-surface-card border rounded-2xl px-3 py-2 transition-all ${
        nearLimit
          ? 'border-yellow-700/60'
          : 'border-surface-border focus-within:border-brand-600/60 focus-within:shadow-glow-sm'
      }`}>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={isStreaming ? 'Wait for response…' : 'Type your message… (Shift+Enter for newline)'}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none resize-none textarea-custom leading-5 max-h-32"
          style={{ minHeight: '20px' }}
        />

        {nearLimit && (
          <span className="text-xs text-yellow-500 shrink-0 self-end mb-0.5">{text.length}/4000</span>
        )}

        {isStreaming ? (
          <button onClick={onStop}
            className="shrink-0 w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 flex items-center justify-center transition active:scale-90 self-end"
            title="Stop">
            <Square className="w-3.5 h-3.5 text-white fill-white" />
          </button>
        ) : (
          <button onClick={handleSend}
            disabled={!text.trim() || disabled}
            className="shrink-0 w-7 h-7 rounded-lg gradient-brand hover:opacity-90 flex items-center justify-center transition active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed self-end shadow-glow-sm"
            title="Send (Enter)">
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        )}
      </div>

      {/* One-line footer */}
      <p className="text-center text-xs text-slate-700 mt-1.5">
        QA AI · Powered by Azure OpenAI GPT-4o 2024-11-20
      </p>
    </div>
  )
}
