import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import WelcomeScreen from './WelcomeScreen'

export default function ChatWindow({ messages, isStreaming, onRetry, onQuickPrompt }) {
  const bottomRef    = useRef(null)
  const containerRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Export listener
  useEffect(() => {
    const handler = () => {
      const lines = messages.map(m =>
        `[${new Date(m.ts).toLocaleString()}] ${m.role === 'user' ? 'You' : 'QA AI'}:\n${m.content}`
      ).join('\n\n---\n\n')
      const blob = new Blob([lines], { type: 'text/plain' })
      const url  = URL.createObjectURL(blob)
      const a    = Object.assign(document.createElement('a'), { href: url, download: `chat-${Date.now()}.txt` })
      a.click()
      URL.revokeObjectURL(url)
    }
    window.addEventListener('exportChat', handler)
    return () => window.removeEventListener('exportChat', handler)
  }, [messages])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        /* Welcome screen shown when no messages — full height */
        <div className="h-full">
          <WelcomeScreen onPrompt={onQuickPrompt} />
        </div>
      ) : (
        <div className="px-4 py-6 space-y-6">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onRetry={msg.error ? onRetry : undefined}
            />
          ))}

          {/* Typing indicator */}
          {isStreaming && messages[messages.length - 1]?.streaming && !messages[messages.length - 1]?.content && (
            <div className="flex items-center gap-2 text-slate-400 text-sm pl-11">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <span key={i} className={`w-2 h-2 bg-brand-500 rounded-full animate-bounce-dot dot-delay-${i}`} />
                ))}
              </div>
              <span className="text-xs">QA AI is typing…</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
