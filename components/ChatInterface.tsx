'use client'

import { useState, useRef, useEffect } from 'react'
import { POLISHING_STEPS } from '@/utils/concierge'

interface Spark {
  id: number
  x: number
  y: number
  rotation: number
  delay: number
}

const SPARK_LIFETIME_MS = 1100
const SPARK_COUNT = 20

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
  const [sparks, setSparks] = useState<Spark[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sparkId = useRef(0)

  // Scrolling the container directly, rather than scrollIntoView on a sentinel,
  // keeps the surrounding page from being scrolled along with it.
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isLoading) return

    // Start somewhere new each time so the concierge does not repeat his fussing.
    setStepIndex(Math.floor(Math.random() * POLISHING_STEPS.length))
    const timer = setInterval(() => {
      setStepIndex((index) => (index + 1) % POLISHING_STEPS.length)
    }, 700)
    return () => clearInterval(timer)
  }, [isLoading])

  const throwSparks = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const batch: Spark[] = Array.from({ length: SPARK_COUNT }, () => ({
      id: sparkId.current++,
      x: (Math.random() - 0.5) * 220,
      y: -50 - Math.random() * 130,
      rotation: (Math.random() - 0.5) * 540,
      delay: Math.random() * 140,
    }))
    setSparks((current) => [...current, ...batch])
    const expiring = new Set(batch.map((spark) => spark.id))
    setTimeout(() => {
      setSparks((current) => current.filter((spark) => !expiring.has(spark.id)))
    }, SPARK_LIFETIME_MS + 200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
      throwSparks()
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center border-b-[3px] border-[color:var(--ink)] bg-[color:var(--steel-700)] pl-1 pt-1 md:hidden">
        <button className="flex items-center gap-3 p-3 text-[color:var(--gold-300)]">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="gilded-text flex-1 text-center font-[family-name:var(--font-display)] text-xl font-semibold tracking-wide">DylGPT</h1>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="relative flex h-full items-center justify-center overflow-hidden">
            <div className="gilded-rays pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-[58%]" />
            <div className="relative max-w-2xl px-4 text-center">
              <div className="gilded-medallion gilded-glow gilded-glint mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full">
                <svg stroke="var(--ink)" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h1 className="gilded-text font-[family-name:var(--font-display)] text-7xl tracking-wide sm:text-8xl">DylGPT</h1>
              <div className="mx-auto mt-7 flex max-w-md items-center gap-4">
                <hr className="gilded-rule flex-1" />
                <span className="gilded-badge -rotate-3 rounded-full px-4 py-1.5 font-[family-name:var(--font-display)] text-sm tracking-widest">
                  100% REAL GOLD*
                </span>
                <hr className="gilded-rule flex-1" />
              </div>
              <p className="gilded-text-steel mt-7 font-[family-name:var(--font-display)] text-3xl">
                How can I help you today?
              </p>
              <p className="mt-6 text-base font-medium leading-relaxed text-[color:var(--steel-200)]/85">
                *DylGPT may be experiencing partial outages if he is Yachting, On a Date, or Trying to Deliver Company Value to ChatGPT
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-4 py-6 pb-9">
            {messages.map((message, index) => (
              <div
                key={index}
                className="m-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl"
              >
                <div className={`gilded-panel gilded-pop gilded-glint flex gap-4 rounded-3xl p-4 text-base md:gap-6 md:p-6 ${
                  message.role === 'assistant' ? 'gilded-panel-warm rotate-[0.9deg]' : '-rotate-[0.9deg]'
                }`}>
                  <div className="flex-shrink-0">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      message.role === 'user' ? 'gilded-medallion-dark' : 'gilded-medallion'
                    }`}>
                      {message.role === 'user' ? (
                        <svg stroke="var(--ink)" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      ) : (
                        <svg stroke="var(--ink)" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="relative flex flex-1 flex-col">
                    <div className={`font-[family-name:var(--font-display)] text-xl tracking-wide ${
                      message.role === 'user' ? 'text-[color:var(--steel-600)]' : 'text-[color:var(--ink)]'
                    }`}>
                      {message.role === 'user' ? 'You' : 'DylGPT'}
                    </div>
                    <div className="prose mt-1 max-w-none font-medium text-[color:var(--ink)]">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="m-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl">
                <div className="gilded-panel gilded-panel-warm gilded-pop gilded-glint flex rotate-[0.9deg] gap-4 rounded-3xl p-4 text-base md:gap-6 md:p-6">
                  <div className="flex-shrink-0">
                    <div className="gilded-medallion gilded-glow flex h-11 w-11 items-center justify-center rounded-full">
                      <svg stroke="var(--ink)" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="relative flex flex-1 flex-col">
                    <div className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[color:var(--ink)]">
                      DylGPT
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-semibold text-[color:var(--ink)]">
                      <span>{POLISHING_STEPS[stepIndex]}</span>
                      <span className="flex gap-1.5">
                        <span className="gilded-dot h-2.5 w-2.5 rounded-full bg-[color:var(--ink)]" />
                        <span className="gilded-dot h-2.5 w-2.5 rounded-full bg-[color:var(--ink)]" style={{ animationDelay: '160ms' }} />
                        <span className="gilded-dot h-2.5 w-2.5 rounded-full bg-[color:var(--ink)]" style={{ animationDelay: '320ms' }} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input form */}
      <div className="w-full pt-2 md:pt-0">
        <form onSubmit={handleSubmit} className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
          <div className="relative flex h-full flex-1 md:flex-col">
            <div className="gilded-field relative flex w-full flex-grow flex-col rounded-full py-4 pl-6 pr-16">
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
                className="m-0 w-full resize-none border-0 bg-transparent p-0 text-lg font-medium text-[color:var(--gold-100)] placeholder:text-[color:var(--gold-200)]/80 focus:outline-none focus:ring-0"
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
                className="gilded-button absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full"
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
              {sparks.map((spark) => (
                <span
                  key={spark.id}
                  className="gilded-spark"
                  style={{
                    ['--spark-x' as string]: `${spark.x}px`,
                    ['--spark-y' as string]: `${spark.y}px`,
                    ['--spark-rotation' as string]: `${spark.rotation}deg`,
                    animationDelay: `${spark.delay}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </form>
        <div className="px-3 pt-4 pb-3 text-center text-sm font-semibold tracking-wide text-[color:var(--gold-200)]/70 md:px-4 md:pb-6">
          <span>
            DylGPT can make mistakes. The gold, however, is 24 karat.
          </span>
        </div>
      </div>
    </div>
  )
}
