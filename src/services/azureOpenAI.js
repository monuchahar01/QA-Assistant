/**
 * azureOpenAI.js
 * Direct frontend integration with Azure OpenAI GPT-4o endpoint.
 * No backend required — calls are made from the browser.
 */

const AZURE_ENDPOINT = 'https://monuuchahhar-5251-resource.services.ai.azure.com/openai/v1'
const DEPLOYMENT_NAME = 'gpt-4o'

// This endpoint uses the OpenAI-compatible /v1/ format — no api-version param needed.
const CHAT_URL = `${AZURE_ENDPOINT}/chat/completions`

/**
 * Send a conversation history to Azure OpenAI and stream the response.
 *
 * @param {string}   apiKey       - Azure OpenAI API key (entered by user in UI)
 * @param {Array}    messages     - Array of { role, content } message objects
 * @param {Function} onChunk      - Callback fired with each streamed text chunk
 * @param {Function} onDone       - Callback fired when streaming is complete
 * @param {Function} onError      - Callback fired on error
 * @param {AbortSignal} signal    - AbortController signal for cancellation
 */
export async function streamChat({ apiKey, messages, onChunk, onDone, onError, signal }) {
  try {
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        model: DEPLOYMENT_NAME,
        messages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
      }),
      signal,
    })

    if (!response.ok) {
      let errMsg = `HTTP ${response.status}`
      try {
        const errJson = await response.json()
        errMsg = errJson?.error?.message || errMsg
      } catch (_) {}
      throw new Error(errMsg)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() // keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') {
          onDone()
          return
        }
        try {
          const json = JSON.parse(data)
          const delta = json?.choices?.[0]?.delta?.content
          if (delta) onChunk(delta)
        } catch (_) {
          // skip malformed SSE lines
        }
      }
    }
    onDone()
  } catch (err) {
    if (err.name === 'AbortError') {
      onDone()
      return
    }
    onError(err)
  }
}

/**
 * Non-streaming fallback using the /responses endpoint.
 * Used when the user's browser blocks SSE or streaming fails.
 */
export async function sendChat({ apiKey, messages, onError }) {
  try {
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        model: DEPLOYMENT_NAME,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
      }),
    })

    if (!response.ok) {
      let errMsg = `HTTP ${response.status}`
      try {
        const errJson = await response.json()
        errMsg = errJson?.error?.message || errMsg
      } catch (_) {}
      throw new Error(errMsg)
    }

    const json = await response.json()
    return json?.choices?.[0]?.message?.content || ''
  } catch (err) {
    onError(err)
    return null
  }
}

/**
 * Validate an API key with a minimal test call.
 */
export async function validateApiKey(apiKey) {
  try {
    const res = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        model: DEPLOYMENT_NAME,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1,
      }),
    })
    if (res.status === 401 || res.status === 403) return { valid: false, error: 'Invalid API key.' }
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}))
      return { valid: false, error: errJson?.error?.message || `Error ${res.status}` }
    }
    return { valid: true }
  } catch (err) {
    return { valid: false, error: err.message }
  }
}
