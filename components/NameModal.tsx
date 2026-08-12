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
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="gilded-panel gilded-glow relative mx-4 w-full max-w-md rounded-2xl p-8 text-center">
        <div className="gilded-medallion mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full">
          <svg stroke="#3a2a02" fill="none" strokeWidth="1.75" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <h2 className="gilded-text font-[family-name:var(--font-display)] text-4xl font-bold tracking-wide">Welcome to DylGPT</h2>
        <hr className="gilded-rule my-5" />
        <p className="mb-7 text-sm tracking-wide text-[color:var(--gold-300)]/70">Please enter your name to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="gilded-field rounded-full px-5 py-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border-0 bg-transparent text-center text-[color:var(--gold-100)] placeholder:text-[color:var(--gold-300)]/40 focus:outline-none focus:ring-0"
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className="gilded-button mt-5 w-full rounded-full px-4 py-3 font-[family-name:var(--font-display)] text-lg font-semibold uppercase tracking-[0.2em]"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}