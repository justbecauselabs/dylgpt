'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => Promise<void>
  onNewChat: () => void
  isLoading: boolean
  userName: string | null
}

const SUGGESTIONS = [
  {
    label: 'Brainstorm',
    prompt: 'Give me five unconventional ideas for a weekend side project.',
  },
  {
    label: 'Explain',
    prompt: 'Explain a hard technical concept with a useful analogy.',
  },
  {
    label: 'Write',
    prompt: 'Help me write a concise update for my team.',
  },
]

function GrokMark() {
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-black text-black shadow-lg shadow-white/5">
      G
    </div>
  )
}

export default function ChatInterface({
  messages,
  onSendMessage,
  onNewChat,
  isLoading,
  userName,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [input])

  const submitMessage = (message: string) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isLoading) {
      return
    }

    setInput('')
    void onSendMessage(trimmedMessage)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submitMessage(input)
  }

  return (
    <section className="relative flex h-full flex-col bg-[radial-gradient(circle_at_50%_-20%,rgba(70,70,85,0.28),transparent_38%)]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <GrokMark />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight">DylGPT</h1>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                GROK
              </span>
            </div>
            <p className="text-xs text-zinc-500">grok-4-latest</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNewChat}
          disabled={isLoading}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:hidden"
        >
          New chat
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-5 pb-12">
            <div className="mb-8">
              <GrokMark />
            </div>
            <p className="mb-2 text-sm font-medium text-zinc-500">
              {userName ? `Good to see you, ${userName}.` : 'Welcome.'}
            </p>
            <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-zinc-100 sm:text-5xl">
              What are we working on?
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-500">
              Ask for analysis, code, research, or a second opinion. Your conversation is sent
              securely to Grok through the server.
            </p>
            <div className="mt-10 grid gap-2 sm:grid-cols-3">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => submitMessage(suggestion.prompt)}
                  className="group rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-left transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span className="text-xs font-semibold text-zinc-300">
                    {suggestion.label}
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-zinc-600 transition group-hover:text-zinc-400">
                    {suggestion.prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-5 py-8 sm:px-8">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && <GrokMark />}
                <div
                  className={
                    message.role === 'user'
                      ? 'max-w-[85%] rounded-2xl rounded-br-md bg-zinc-100 px-4 py-3 text-sm leading-6 text-zinc-950'
                      : 'min-w-0 max-w-[calc(100%-3.25rem)] pt-1 text-sm leading-7 text-zinc-200'
                  }
                >
                  <div className="prose">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-4">
                <GrokMark />
                <div className="flex gap-1.5 pt-1" aria-label="Grok is thinking">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="size-1.5 animate-pulse rounded-full bg-zinc-500"
                      style={{ animationDelay: `${dot * 180}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-white/10 bg-[#151518] p-2 pl-4 shadow-2xl shadow-black/30 transition focus-within:border-white/20"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                submitMessage(input)
              }
            }}
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600"
            placeholder="Ask Grok anything..."
            aria-label="Message"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
            aria-label="Send message"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-4"
              aria-hidden="true"
            >
              <path d="m5 12 7-7 7 7M12 5v14" />
            </svg>
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-zinc-700">
          Grok can make mistakes. Verify important information.
        </p>
      </div>
    </section>
  )
}