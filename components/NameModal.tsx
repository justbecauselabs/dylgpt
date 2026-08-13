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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-[color:var(--steel-900)]/85 backdrop-blur-sm" />
      <div className="gilded-panel gilded-pop relative mx-4 w-full max-w-md -rotate-1 rounded-[2rem] p-8 text-center">
        <div className="gilded-medallion gilded-glow gilded-glint mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full">
          <svg stroke="var(--ink)" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <h2 className="gilded-text font-[family-name:var(--font-display)] text-4xl tracking-wide">Welcome to DylGPT</h2>
        <hr className="gilded-rule my-5" />
        <p className="mb-7 text-base font-semibold tracking-wide text-[color:var(--steel-600)]">Who is asking? Names only, no titles.</p>
        <form onSubmit={handleSubmit}>
          <div className="gilded-field rounded-full px-5 py-3.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border-0 bg-transparent text-center text-lg font-medium text-[color:var(--silver-100)] placeholder:text-[color:var(--silver-300)]/75 focus:outline-none focus:ring-0"
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className="gilded-button mt-6 w-full rounded-full px-4 py-3.5 font-[family-name:var(--font-display)] text-2xl tracking-[0.15em]"
          >
            Let&apos;s Go
          </button>
        </form>
      </div>
    </div>
  )
}