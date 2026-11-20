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
      <div className="fixed inset-0 bg-ink/60" />
      <div className="relative bg-panel rounded-lg shadow-xl max-w-md w-full mx-4 border border-gold/40 p-6">
        <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-gold-deep to-gold-bright" />
        <h2 className="text-2xl font-semibold mb-4 text-ink">Welcome to DylGPT!</h2>
        <p className="text-stone mb-6">Please enter your name to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-line rounded-md bg-panel text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            autoFocus
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-gold-deep text-gold-pale py-2 px-4 rounded-md hover:bg-gold transition-colors duration-200 font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}