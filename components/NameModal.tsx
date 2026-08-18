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
      <div className="fixed inset-0 bg-scrim/70" />
      <div className="relative bg-surface-panel border border-border rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.18)] max-w-md w-full mx-4 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Welcome to DylGPT!</h2>
        <p className="text-muted mb-6">Please enter your name to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-border rounded-md bg-surface-chrome text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            autoFocus
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-brand text-brand-ink py-2 px-4 rounded-md hover:bg-brand-hover transition-colors duration-200 font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}