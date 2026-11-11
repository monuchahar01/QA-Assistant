/**
 * useChat.js
 * Custom hook that manages chat state and Azure OpenAI streaming.
 */
import { useState, useRef, useCallback } from 'react'
import { streamChat } from '../services/azureOpenAI'
import { v4 as uuidv4 } from 'uuid'

const SYSTEM_PROMPT = `You are an expert QA (Quality Assurance) assistant with deep knowledge in General sectors, you could create test planning, test case creation, SAS scripting, and test reporting.
You can please make sure that you could provude short answer only unless user ask

Your capabilities include:
- Creating comprehensive test plans with scope, objectives, resources, timelines and risk analysis
- Writing detailed, structured test cases with preconditions, steps, expected results and pass/fail criteria
- Drafting SAS (Statistical Analysis System) scripts for automated testing and data validation
- Generating professional end-of-test reports summarizing test execution, defects found, coverage metrics and QA sign-off

Guidelines:
- Be precise, structured and use proper QA terminology
- Format test plans and test cases using clear numbered steps and tables where helpful
- When writing SAS scripts, include comments explaining each section
- Always ask clarifying questions about the application, environment and requirements before generating artefacts
- Use bullet points, numbered lists and markdown tables to keep output readable
- Maintain a professional, technical tone`

export function useChat(apiKey) {
  const [messages, setMessages]       = useState([])
  const [isStreaming, setIsStreaming]  = useState(false)
  const [error, setError]             = useState(null)
  const abortRef                      = useRef(null)
  const streamingIdRef                = useRef(null)

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || isStreaming) return
    setError(null)

    const userMsg = { id: uuidv4(), role: 'user', content: userText.trim(), ts: Date.now() }
    const botId   = uuidv4()
    const botMsg  = { id: botId,   role: 'assistant', content: '', ts: Date.now(), streaming: true }

    setMessages(prev => [...prev, userMsg, botMsg])
    setIsStreaming(true)
    streamingIdRef.current = botId

    // Build conversation history for the API (without internal fields)
    const history = [...(messages.map(m => ({ role: m.role, content: m.content }))),
                      { role: 'user', content: userText.trim() }]

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
    ]

    const controller = new AbortController()
    abortRef.current = controller

    await streamChat({
      apiKey,
      messages: apiMessages,
      signal: controller.signal,
      onChunk: (chunk) => {
        setMessages(prev =>
          prev.map(m =>
            m.id === botId ? { ...m, content: m.content + chunk } : m
          )
        )
      },
      onDone: () => {
        setMessages(prev =>
          prev.map(m =>
            m.id === botId ? { ...m, streaming: false } : m
          )
        )
        setIsStreaming(false)
        streamingIdRef.current = null
        abortRef.current = null
      },
      onError: (err) => {
        setMessages(prev =>
          prev.map(m =>
            m.id === botId
              ? { ...m, content: '', streaming: false, error: true, errorMsg: err.message }
              : m
          )
        )
        setError(err.message)
        setIsStreaming(false)
        streamingIdRef.current = null
        abortRef.current = null
      },
    })
  }, [apiKey, messages, isStreaming])

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
  }, [])

  const clearChat = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    setMessages([])
    setIsStreaming(false)
    setError(null)
    streamingIdRef.current = null
  }, [])

  const retryLast = useCallback(() => {
    setMessages(prev => {
      // Find last user message
      const lastUserIdx = [...prev].reverse().findIndex(m => m.role === 'user')
      if (lastUserIdx === -1) return prev
      const idx = prev.length - 1 - lastUserIdx
      const userMsg = prev[idx]
      const trimmed = prev.slice(0, idx)
      // Re-trigger with that message
      setTimeout(() => sendMessage(userMsg.content), 50)
      return trimmed
    })
  }, [sendMessage])

  return { messages, isStreaming, error, sendMessage, stopStreaming, clearChat, retryLast }
}
