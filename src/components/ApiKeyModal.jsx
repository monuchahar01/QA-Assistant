import { useState } from 'react'
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'
import { validateApiKey } from '../services/azureOpenAI'

export default function ApiKeyModal({ onKeySubmit }) {
  const [key, setKey]           = useState('')
  const [showKey, setShowKey]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!key.trim()) return
    setError('')
    setLoading(true)
    const result = await validateApiKey(key.trim())
    setLoading(false)
    if (!result.valid) {
      setError(result.error || 'Could not validate the key. Please check and try again.')
      return
    }
    if (remember) {
      try { sessionStorage.setItem('azure_api_key', key.trim()) } catch (_) {}
    }
    onKeySubmit(key.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.18) 0%, rgba(15,23,42,0.98) 60%)' }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-700 opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-700 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="glass rounded-2xl border border-surface-border shadow-2xl p-8">

          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center shadow-glow">
                <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
                  <path d="M6 22l5-9 4 6 3-5 6 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="23" cy="9" r="3" fill="rgba(255,255,255,0.7)"/>
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-surface-card flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full" />
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">QA AI</h1>
            <p className="text-sm text-slate-400 mt-1 text-center">
              Intelligent QA Support · Powered by Azure GPT-4o
            </p>
          </div>

          <div className="flex items-start gap-3 bg-blue-950/50 border border-blue-800/40 rounded-xl p-3 mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-300 leading-relaxed">
              Your API key is used <strong>only in your browser</strong> and is never sent to any third-party server.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Azure OpenAI API Key</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={e => { setKey(e.target.value); setError('') }}
                  placeholder="Paste your Azure OpenAI key…"
                  autoFocus
                  className="w-full bg-surface-DEFAULT border border-surface-border rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
                <button type="button" onClick={() => setShowKey(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition">
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div onClick={() => setRemember(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors relative ${remember ? 'bg-brand-600' : 'bg-surface-border'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${remember ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm text-slate-400">Remember for this session</span>
            </label>

            {error && (
              <div className="flex items-start gap-2 bg-red-950/50 border border-red-800/40 rounded-xl p-3 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button type="submit" disabled={!key.trim() || loading}
              className="w-full gradient-brand text-white font-semibold py-3 rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Validating…</> : 'Start Chatting →'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-5">
            Need an API key?{' '}
            <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
              Azure Portal ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
