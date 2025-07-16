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

export default function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center border-b border-black/10 bg-white pl-1 pt-1 sm:pl-3 md:hidden">
        <button className="flex items-center gap-3 p-3 text-gray-600">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="flex-1 text-center text-base font-semibold">DylGPT</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-2xl px-4 text-center">
              <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">DylGPT</h1>
              <p className="mt-4 text-lg text-gray-600">How can I help you today?</p>
              <p className="mt-6 text-sm text-gray-500">DylGPT may be experiencing partial outages if he is Yachting, On a Date, or Trying to Deliver Company Value to ChatGPT</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col pb-9">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`group w-full text-gray-800 border-b border-black/10 ${
                  message.role === 'assistant' ? 'bg-gray-50' : ''
                }`}
              >
                <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                  <div className="flex-shrink-0">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-sm ${
                      message.role === 'user' ? 'bg-purple-600' : 'bg-green-600'
                    }`}>
                      {message.role === 'user' ? (
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      ) : (
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="relative flex flex-1 flex-col">
                    <div className="font-semibold">
                      {message.role === 'user' ? 'You' : 'DylGPT'}
                    </div>
                    <div className="prose mt-1 max-w-none">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input form */}
      <div className="w-full border-t bg-white pt-2 md:border-t-0 md:border-transparent md:!bg-transparent md:pt-0">
        <form onSubmit={handleSubmit} className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
          <div className="relative flex h-full flex-1 md:flex-col">
            <div className="ml-1 mt-1.5 md:w-full md:m-auto md:mb-2 md:flex md:gap-2 md:justify-center"></div>
            <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)]">
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
                className="m-0 w-full resize-none border-0 bg-white p-0 pr-7 focus:ring-0 focus-visible:ring-0 pl-2 md:pl-0 text-gray-900"
                placeholder="Message DylGPT..."
                style={{
                  maxHeight: '200px',
                  height: '24px',
                  overflowY: 'hidden'
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg">
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