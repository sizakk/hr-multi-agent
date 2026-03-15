export async function callClaude({ password, systemPrompt, userMessage, onStream }) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-password': password,
    },
    body: JSON.stringify({ systemPrompt, userMessage }),
  })

  if (!response.ok) {
    const err = await response.text()
    if (err.includes('credit balance is too low') || err.includes('Your credit balance')) {
      throw new Error('크레딧이 부족합니다.')
    }
    throw new Error(`API Error ${response.status}: ${err}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let inputTokens = 0
  let outputTokens = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      try {
        const data = JSON.parse(line.slice(6))
        if (data.type === 'content_block_delta' && data.delta?.text) {
          fullText += data.delta.text
          onStream?.(fullText)
        }
        if (data.type === 'message_delta' && data.usage) {
          outputTokens = data.usage.output_tokens || 0
        }
        if (data.type === 'message_start' && data.message?.usage) {
          inputTokens = data.message.usage.input_tokens || 0
        }
      } catch {
        // skip parse errors on partial chunks
      }
    }
  }

  return { text: fullText, inputTokens, outputTokens }
}
