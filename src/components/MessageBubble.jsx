import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, AlertTriangle, RefreshCw, User, Bot } from 'lucide-react'

function TypingCursor() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1 align-middle">
      {[0, 1, 2].map(i => (
        <span key={i} className={`w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce-dot dot-delay-${i}`} />
      ))}
    </span>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {}
  }
  return (
    <button onClick={copy}
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-surface-DEFAULT/80 text-slate-400 hover:text-white transition-all"
      title="Copy message">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function MessageBubble({ message, onRetry }) {
  const isUser  = message.role === 'user'
  const isEmpty = !message.content && !message.streaming && !message.error

  return (
    <div className={`flex gap-3 animate-slide-up group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white mt-1 ${
        isUser ? 'gradient-brand shadow-glow-sm' : 'bg-surface-card border border-surface-border'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-brand-400" />}
      </div>

      {/* Content */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`relative px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'message-bubble-user text-white'
              : message.error
                ? 'bg-red-950/50 border border-red-800/50 rounded-2xl rounded-bl-sm text-red-300'
                : 'message-bubble-bot text-slate-100'
          }`}>
            {message.error ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-xs">Error</span>
                </div>
                <p className="text-xs text-red-300">{message.errorMsg}</p>
                {onRetry && (
                  <button onClick={onRetry}
                    className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition mt-1">
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                )}
              </div>
            ) : isEmpty && !message.streaming ? (
              <div className="space-y-2">
                <div className="shimmer h-3 w-32 rounded" />
                <div className="shimmer h-3 w-48 rounded" />
              </div>
            ) : (
              <div className="prose-chat">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                {message.streaming && <TypingCursor />}
              </div>
            )}
          </div>
          {!isUser && !message.error && message.content && <CopyButton text={message.content} />}
        </div>
        <span className="text-xs text-slate-600 mt-1 px-1">{formatTime(message.ts)}</span>
      </div>
    </div>
  )
}
