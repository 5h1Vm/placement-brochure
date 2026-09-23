'use client'

import { useState, useEffect } from 'react'

export default function RecruiterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('recruiter_visit')
    if (!hasVisited) setIsOpen(true)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !company || !contact) return

    setLoading(true)
    try {
      await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, contact })
      })
      localStorage.setItem('recruiter_visit', 'true')
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-t-4 border-primary transform transition-all">
        <h2 className="text-2xl font-bold text-primary mb-2">Welcome to NFSU Delhi</h2>
        <p className="text-gray-600 mb-6 text-sm">Please introduce yourself to view the student profiles.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Name *</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Company / Organization *</label>
            <input required type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone or Email *</label>
            <input required type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2">
            {loading ? 'Entering...' : 'View Profiles'}
          </button>
        </form>
      </div>
    </div>
  )
}
