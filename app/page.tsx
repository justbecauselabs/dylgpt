'use client'

import { useEffect, useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import NameModal from '@/components/NameModal'
import { getCookie, setCookie } from '@/utils/cookies'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const storedName = getCookie('dylgpt_user')
    if (storedName) {
      setUserName(storedName)
    } else {
      setShowModal(true)
    }
  }, [])

  const handleNameSubmit = (name: string) => {
    setCookie('dylgpt_user', name)
    setUserName(name)
    setShowModal(false)
  }

  const sendMessage = async (message: string) => {
    setIsLoading(true)
    const newMessages: Message[] = [...messages, { role: 'user', content: message }]
    setMessages(newMessages)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          userName,
        }),
      })

      const body: unknown = await response.json()
      const responseMessage =
        isRecord(body) && typeof body.message === 'string' ? body.message : null

      if (!response.ok || !responseMessage) {
        const errorMessage =
          isRecord(body) && typeof body.error === 'string'
            ? body.error
            : 'Grok could not complete that request. Please try again.'
        throw new Error(errorMessage)
      }

      setMessages([...newMessages, { role: 'assistant', content: responseMessage }])
    } catch (error: unknown) {
      const content =
        error instanceof Error
          ? error.message
          : 'Could not reach Grok. Check your connection and try again.'
      setMessages([...newMessages, { role: 'assistant', content }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#09090b] text-white">
      <NameModal isOpen={showModal} onSubmit={handleNameSubmit} />
      <div className="flex h-full">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/8 bg-[#0d0d0f] md:flex">
          <div className="flex h-16 items-center gap-3 px-5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
              D
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">DylGPT</p>
              <p className="text-[11px] text-zinc-500">Powered by Grok</p>
            </div>
          </div>
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={() => setMessages([])}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-white text-lg leading-none text-black">
                +
              </span>
              New conversation
            </button>
          </div>
          <div className="mt-auto border-t border-white/8 p-4">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 text-xs font-bold text-black">
                {userName?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-zinc-200">{userName ?? 'Guest'}</p>
                <p className="text-xs text-zinc-600">Grok 4</p>
              </div>
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            onNewChat={() => setMessages([])}
            isLoading={isLoading}
            userName={userName}
          />
        </div>
      </div>
    </main>
  )
}
