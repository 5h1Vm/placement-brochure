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
      });
    } catch (error) {
      console.error(error)
    } finally {
      localStorage.setItem('recruiter_visit', 'true')
      setIsOpen(false)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-md w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome</h2>
          <p className="text-gray-500 text-sm">Please introduce yourself to access the Brochure.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Your Name <span className="text-red-500">*</span></label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Company / Organization <span className="text-red-500">*</span></label>
            <input required type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Phone or Email <span className="text-red-500">*</span></label>
            <input required type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200" />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              style={{ touchAction: 'manipulation' }}
              className={`w-full bg-primary text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5'}`}
            >
              {loading ? 'Entering...' : 'View Profiles'}
            </button>
          </div>

          <p className="text-center mt-5 text-[11px] italic text-gray-400">
            * This is a one-time verification. You will not be asked again on this device.
          </p>
        </form>
      </div>
    </div>
  )
}
