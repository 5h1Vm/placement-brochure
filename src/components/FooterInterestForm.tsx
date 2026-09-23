'use client'

import { useState } from 'react'

export default function FooterInterestForm() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !contact) return

    setLoading(true)
    try {
      await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company: 'Website Footer Lead', contact })
      })
      setSuccess(true)
      setName('')
      setContact('')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm font-medium border border-green-200">
        Thank you! Our placement team will reach out to you shortly.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5">
      <input 
        required
        type="text" 
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name or Company" 
        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-primary" 
      />
      <input 
        required
        type="text" 
        value={contact}
        onChange={e => setContact(e.target.value)}
        placeholder="Phone or Email" 
        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-primary" 
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
