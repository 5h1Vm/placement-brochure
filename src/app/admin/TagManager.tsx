'use client'

import { useState } from 'react'
import { addTag, deleteTag, updateTag } from './actions'
import { useRouter } from 'next/navigation'

export default function TagManager({ existingTags }: { existingTags: any[] }) {
  const [newTag, setNewTag] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const router = useRouter()

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTag.trim()) return
    setError('')
    const res = await addTag(newTag.trim())
    if (res.success) {
      setNewTag('')
      router.refresh()
    } else {
      setError(res.error || 'Failed to add')
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this domain? It will be removed from all students.')) {
      await deleteTag(id)
      router.refresh()
    }
  }

  async function handleSaveEdit(id: string) {
    if (!editValue.trim()) return
    setError('')
    const res = await updateTag(id, editValue.trim())
    if (res.success) {
      setEditingId(null)
      setEditValue('')
      router.refresh()
    } else {
      setError(res.error || 'Failed to update')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-primary mb-4">Manage Domains</h2>
      <p className="text-sm text-text-muted mb-3">
        Define the standardized domains that recruiters can filter by.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 mb-5 text-sm rounded flex items-start gap-2 shadow-sm">
        <span className="text-lg leading-none">💡</span>
        <p>
          <strong>Pro Tip:</strong> Click on any existing tag below to rename it directly! Renaming a tag automatically updates it across all student profiles instantly, which is much safer and faster than deleting it and recreating it.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input 
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="e.g. Digital Forensics"
          className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
          Add Domain
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {existingTags.map(tag => (
          <div key={tag.id} className="bg-gray-100 border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full flex items-center shadow-sm">
            {editingId === tag.id ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={editValue} 
                  onChange={e => setEditValue(e.target.value)} 
                  className="px-2 py-0.5 rounded border border-gray-300 text-sm w-32"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveEdit(tag.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
                <button onClick={() => handleSaveEdit(tag.id)} className="text-green-600 hover:text-green-800 font-bold" title="Save">✓</button>
                <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700 font-bold" title="Cancel">✗</button>
              </div>
            ) : (
              <div className="flex items-center">
                <span 
                  className="cursor-pointer hover:text-primary mr-2"
                  onClick={() => {
                    setEditingId(tag.id)
                    setEditValue(tag.name)
                  }}
                  title="Click to edit"
                >
                  {tag.name}
                </span>
                <button 
                  onClick={() => handleDelete(tag.id)}
                  className="ml-1 text-red-500 hover:text-red-700 font-bold px-1"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
