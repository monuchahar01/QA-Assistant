import { useState } from 'react'
import ApiKeyModal  from './components/ApiKeyModal'
import Sidebar      from './components/Sidebar'
import ChatHeader   from './components/ChatHeader'
import ChatWindow   from './components/ChatWindow'
import ChatInput    from './components/ChatInput'
import { useChat }  from './hooks/useChat'

export default function App() {
  const [apiKey, setApiKey] = useState(() => {
    try { return sessionStorage.getItem('azure_api_key') || '' } catch { return '' }
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {
    messages, isStreaming, error,
    sendMessage, stopStreaming, clearChat, retryLast,
  } = useChat(apiKey)

  const handleSend = (text) => {
    setSidebarOpen(false)
    sendMessage(text)
  }

  const handleLogout = () => {
    try { sessionStorage.removeItem('azure_api_key') } catch {}
    clearChat()
    setApiKey('')
  }

  if (!apiKey) {
    return <ApiKeyModal onKeySubmit={setApiKey} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-DEFAULT">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 md:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        messageCount={messages.length}
        onNewChat={clearChat}
        onQuickPrompt={(p) => { setSidebarOpen(false); sendMessage(p) }}
        onLogout={handleLogout}
      />

      {/* Main chat area — always shows header + window + input */}
      <div className="flex flex-col flex-1 min-w-0 relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-700 opacity-5 rounded-full blur-3xl" />
        </div>

        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          onClear={clearChat}
          messageCount={messages.length}
        />

        {/* ChatWindow fills remaining space */}
        <ChatWindow
          messages={messages}
          isStreaming={isStreaming}
          onRetry={retryLast}
          onQuickPrompt={handleSend}
        />

        {/* Error banner */}
        {error && !messages.some(m => m.error) && (
          <div className="mx-4 mb-2 p-3 rounded-xl bg-red-950/50 border border-red-800/40 text-xs text-red-300 animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        {/* Input bar — always visible at the bottom */}
        <ChatInput
          onSend={handleSend}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          disabled={!apiKey}
        />
      </div>
    </div>
  )
}
