'use client'

import { useState } from 'react'
import { loginAdmin } from './actions'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await loginAdmin(password)
    if (res.success) {
      router.refresh()
    } else {
      setError(res.error || 'Login failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-primary w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter secret"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded transition-colors">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}
