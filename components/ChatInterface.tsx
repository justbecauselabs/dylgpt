'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
}

function Avatar({ role }: { role: Message['role'] }) {
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full ${
        role === 'user'
          ? 'chrome-surface chrome-bevel text-gray-700'
          : 'chrome-surface-dark chrome-bevel-dark text-white'
      }`}
    >
      {role === 'user' ? (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ) : (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      )}
    </div>
  )
}

export default function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  const canSend = input.trim().length > 0 && !isLoading

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Header */}
      <div className="glass sticky top-0 z-10 flex items-center pl-1 pt-1 sm:pl-3 md:hidden">
        <button className="flex items-center gap-3 p-3 text-gray-700">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="chrome-text flex-1 text-center text-base font-semibold">DylGPT</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-2xl px-4 text-center">
              <h1 className="chrome-text chrome-text-sweep text-5xl font-semibold tracking-tight sm:text-6xl">DylGPT</h1>
              <p className="mt-5 text-lg text-gray-700">How can I help you today?</p>
              <p className="mt-6 text-sm text-gray-500">DylGPT may be experiencing partial outages if he is Yachting, On a Date, or Trying to Deliver Company Value to ChatGPT</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 pb-9">
            {messages.map((message, index) => (
              <div key={index} className="glass chrome-bevel rounded-2xl p-4 md:p-5">
                <div className="flex gap-4 text-base md:gap-5">
                  <div className="flex-shrink-0">
                    <Avatar role={message.role} />
                  </div>
                  <div className="relative flex flex-1 flex-col">
                    <div className="font-semibold text-gray-900">
                      {message.role === 'user' ? 'You' : 'DylGPT'}
                    </div>
                    <div className="prose mt-1 max-w-none text-gray-800">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="glass chrome-bevel rounded-2xl p-4 md:p-5">
                <div className="flex gap-4 md:gap-5">
                  <div className="flex-shrink-0">
                    <Avatar role="assistant" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="font-semibold text-gray-900">DylGPT</div>
                    <div className="mt-3 space-y-2" aria-label="Sending" role="status">
                      <div className="chrome-shimmer h-3 w-2/3 rounded-full" />
                      <div className="chrome-shimmer h-3 w-1/3 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input form */}
      <div className="w-full bg-gradient-to-t from-white/70 to-transparent pt-2 md:pt-0">
        <form onSubmit={handleSubmit} className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
          <div className="relative flex h-full flex-1 md:flex-col">
            <div className="ml-1 mt-1.5 md:w-full md:m-auto md:mb-2 md:flex md:gap-2 md:justify-center"></div>
            <div className="glass chrome-bevel chrome-focus-ring relative flex w-full flex-grow flex-col rounded-3xl py-3 pl-4 pr-14 transition-shadow duration-200 md:py-4 md:pl-5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                rows={1}
                className="m-0 w-full resize-none border-0 bg-transparent p-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus-visible:ring-0"
                placeholder="Message DylGPT..."
                style={{
                  maxHeight: '200px',
                  height: '24px',
                  overflowY: 'hidden'
                }}
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                className={`absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 md:bottom-3 md:right-3 ${
                  canSend
                    ? 'chrome-surface-dark chrome-bevel-dark chrome-sheen text-white hover:-translate-y-px active:translate-y-0'
                    : 'chrome-surface chrome-bevel text-gray-400'
                }`}
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="relative z-[2] h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </form>
        <div className="px-3 pt-2 pb-3 text-center text-xs text-gray-600 md:px-4 md:pt-3 md:pb-6">
          <span>
            DylGPT can make mistakes. Check important info.
          </span>
        </div>
      </div>
    </div>
  )
}
