import { NextRequest, NextResponse } from 'next/server'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ChatRequest = {
  messages: ChatMessage[]
  userName: string | null
}

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions'
const MAX_MESSAGES = 50
const MAX_MESSAGE_LENGTH = 20_000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseChatMessage(value: unknown): ChatMessage | null {
  if (!isRecord(value)) {
    return null
  }

  const { role, content } = value
  if (
    (role !== 'user' && role !== 'assistant') ||
    typeof content !== 'string' ||
    content.trim().length === 0 ||
    content.length > MAX_MESSAGE_LENGTH
  ) {
    return null
  }

  return { role, content: content.trim() }
}

function parseChatRequest(value: unknown): ChatRequest | null {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    return null
  }

  if (value.messages.length === 0 || value.messages.length > MAX_MESSAGES) {
    return null
  }

  const messages: ChatMessage[] = []
  for (const valueMessage of value.messages) {
    const message = parseChatMessage(valueMessage)
    if (!message) {
      return null
    }
    messages.push(message)
  }

  const userName =
    typeof value.userName === 'string' && value.userName.trim().length > 0
      ? value.userName.trim().slice(0, 80)
      : null

  return { messages, userName }
}

function readAssistantContent(value: unknown): string | null {
  if (!isRecord(value) || !Array.isArray(value.choices)) {
    return null
  }

  const firstChoice = value.choices[0]
  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    return null
  }

  const { content } = firstChoice.message
  return typeof content === 'string' && content.trim().length > 0
    ? content.trim()
    : null
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Grok is not configured. Add XAI_API_KEY to the server environment.' },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const chatRequest = parseChatRequest(body)
  if (!chatRequest) {
    return NextResponse.json(
      { error: 'Send between 1 and 50 valid chat messages.' },
      { status: 400 },
    )
  }

  const nameContext = chatRequest.userName
    ? ` The person you are speaking with is named ${chatRequest.userName}.`
    : ''

  try {
    const grokResponse = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL ?? 'grok-4-latest',
        messages: [
          {
            role: 'system',
            content:
              `You are DylGPT, a direct, thoughtful AI assistant powered by Grok. Give clear, useful answers and say when you are uncertain.${nameContext}`,
          },
          ...chatRequest.messages,
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    })

    if (!grokResponse.ok) {
      return NextResponse.json(
        { error: 'Grok could not complete that request. Please try again.' },
        { status: 502 },
      )
    }

    const grokBody: unknown = await grokResponse.json()
    const message = readAssistantContent(grokBody)
    if (!message) {
      return NextResponse.json(
        { error: 'Grok returned an empty response. Please try again.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ message })
  } catch {
    return NextResponse.json(
      { error: 'Could not reach Grok. Please try again.' },
      { status: 502 },
    )
  }
}
