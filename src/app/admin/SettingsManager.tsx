'use client'

import { useState } from 'react'
import { updateSettings } from './actions'

type Settings = {
  primaryColor: string
  secondaryColor: string
  coordinatorName: string
  contactPhone: string
  contactEmail: string
}

export default function SettingsManager({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState(initialSettings)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      await updateSettings(settings)
      setMsg('Settings saved!')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-primary mb-4">Platform Settings</h2>
      {msg && <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-2 rounded">{msg}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Placement Coordinator</label>
          <input 
            type="text" 
            value={settings.coordinatorName} 
            onChange={e => setSettings({ ...settings, coordinatorName: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
          <input 
            type="text" 
            value={settings.contactPhone} 
            onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input 
            type="email" 
            value={settings.contactEmail} 
            onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
          />
        </div>
        <hr />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color (Hex)</label>
          <input 
            type="text" 
            value={settings.primaryColor} 
            onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color (Hex)</label>
          <input 
            type="text" 
            value={settings.secondaryColor} 
            onChange={e => setSettings({ ...settings, secondaryColor: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
          />
        </div>
        <button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
