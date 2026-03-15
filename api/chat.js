const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const password = req.headers['x-app-password']
  if (!password || password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' })
  }

  let body = {}
  try {
    if (req.body && typeof req.body === 'object') {
      body = req.body
    } else {
      const chunks = []
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
      }
      body = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
    }
  } catch {
    return res.status(400).json({ error: '요청 본문 파싱 실패' })
  }

  const { systemPrompt, userMessage } = body
  if (!systemPrompt || !userMessage) {
    return res.status(400).json({ error: '필수 파라미터 누락 (systemPrompt, userMessage)' })
  }

  const upstream = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      stream: true,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!upstream.ok) {
    const err = await upstream.text()
    return res.status(upstream.status).send(err)
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(decoder.decode(value, { stream: true }))
  }

  res.end()
}
