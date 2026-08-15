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
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" />
      {/* The outer surface is the metal rim; the inner panel stays near-white
          so the copy keeps its contrast. */}
      <div className="chrome-surface-rim chrome-bevel chrome-modal-in relative mx-4 w-full max-w-md rounded-3xl p-[3px]">
        <div className="rounded-[21px] bg-white/90 p-6 backdrop-blur-sm">
          <h2 className="chrome-text mb-4 text-3xl font-semibold tracking-tight">Welcome to DylGPT!</h2>
          <p className="text-gray-600 mb-6">Please enter your name to continue</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-full border border-slate-300 bg-white/80 px-4 py-2.5 shadow-inner focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-400"
              autoFocus
              required
            />
            <button
              type="submit"
              className="chrome-surface-dark chrome-bevel-dark chrome-sheen mt-4 w-full rounded-full px-4 py-2.5 font-medium text-white transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}