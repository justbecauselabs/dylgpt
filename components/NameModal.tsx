'use client'

import { useState, useEffect } from 'react'

interface NameModalProps {
  isOpen: boolean
  onSubmit: (name: string) => void
}

export default function NameModal({ isOpen, onSubmit }: NameModalProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#151518] p-7 shadow-2xl shadow-black">
        <div className="mb-8 flex size-11 items-center justify-center rounded-2xl bg-white text-base font-black text-black">
          D
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Meet DylGPT</h2>
        <p className="mb-7 mt-2 text-sm leading-6 text-zinc-500">
          A sharper assistant, now powered by Grok. What should I call you?
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25"
            autoFocus
            required
            maxLength={80}
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Start chatting
          </button>
        </form>
      </div>
    </div>
  )
}