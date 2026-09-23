'use client'

import { useState } from 'react'
import { addFaculty, updateFaculty, deleteFaculty } from './actions'
import { useRouter } from 'next/navigation'

export default function FacultyManager({ existingFaculty }: { existingFaculty: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    
    let res;
    if (editingFaculty) {
      res = await updateFaculty(editingFaculty.id, formData)
    } else {
      res = await addFaculty(formData)
    }
    
    if (res.success) {
      setIsAdding(false)
      setEditingFaculty(null)
      router.refresh()
    } else {
      setError(res.error || 'Failed')
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      const res = await deleteFaculty(id)
      if (res.success) {
        router.refresh()
      } else {
        alert(res.error || 'Failed to delete')
      }
    }
  }

  function handleEdit(fac: any) {
    setEditingFaculty(fac)
    setIsAdding(true)
  }

  function handleCancel() {
    setIsAdding(false)
    setEditingFaculty(null)
    setError('')
  }

  // Group faculty by tier for display
  const tier1 = existingFaculty.filter(f => f.roleTier === 1).sort((a, b) => a.order - b.order)
  const tier2 = existingFaculty.filter(f => f.roleTier === 2).sort((a, b) => a.order - b.order)
  const tier3 = existingFaculty.filter(f => f.roleTier === 3).sort((a, b) => a.order - b.order)

  const renderList = (list: any[], title: string, colorClass: string) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${colorClass}`}>{title}</h3>
        <ul className="space-y-2">
          {list.map(fac => (
            <li key={fac.id} className="border border-gray-100 p-2 rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center gap-3">
                {fac.imageUrl ? (
                  <img src={fac.imageUrl} alt={fac.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {fac.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm text-primary">{fac.name}</p>
                  <p className="text-xs text-gray-500">{fac.title}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(fac)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(fac.id)} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Manage Faculty & Leadership</h2>
        <button 
          onClick={() => {
            if (isAdding) {
              handleCancel()
            } else {
              setIsAdding(true)
              setEditingFaculty(null)
            }
          }}
          className="bg-secondary hover:bg-secondary-dark text-white text-sm font-semibold py-1.5 px-3 rounded"
        >
          {isAdding ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input name="name" required defaultValue={editingFaculty?.name || ''} className="w-full border rounded px-3 py-1.5 text-sm" placeholder="e.g. Dr. J.M. Vyas" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Title / Position</label>
              <input name="title" required defaultValue={editingFaculty?.title || ''} className="w-full border rounded px-3 py-1.5 text-sm" placeholder="e.g. Vice Chancellor" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Role Tier (Size on Page)</label>
              <select name="roleTier" defaultValue={editingFaculty?.roleTier || 3} className="w-full border rounded px-3 py-1.5 text-sm bg-white">
                <option value={1}>Tier 1: Giant (VC / Campus Director)</option>
                <option value={2}>Tier 2: Large (Dean / Coordinator)</option>
                <option value={3}>Tier 3: Standard (Faculty / Lecturer)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Display Order (0 is first)</label>
              <input name="order" type="number" defaultValue={editingFaculty?.order || 0} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email (Optional)</label>
              <input name="email" type="email" defaultValue={editingFaculty?.email || ''} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn URL (Optional)</label>
              <input name="linkedinUrl" defaultValue={editingFaculty?.linkedinUrl || ''} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Photo URL (Google Drive/Imgur)</label>
              <input name="imageUrl" defaultValue={editingFaculty?.imageUrl || ''} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Short Bio / Expertise (Optional)</label>
            <textarea name="bio" rows={2} defaultValue={editingFaculty?.bio || ''} className="w-full border rounded px-3 py-1.5 text-sm" placeholder="e.g. Expert in Digital Forensics and Cyber Security..."></textarea>
          </div>
          
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="bg-primary text-white text-sm font-bold py-1.5 px-4 rounded w-full">
            {editingFaculty ? 'Update Member' : 'Save Member'}
          </button>
        </form>
      )}

      {existingFaculty.length === 0 && !isAdding && (
        <p className="text-sm text-gray-500 italic">No faculty members added yet.</p>
      )}

      <div className="space-y-6 mt-4">
        {renderList(tier1, "Tier 1: Leadership", "text-secondary-dark")}
        {renderList(tier2, "Tier 2: Directors & Coordinators", "text-primary")}
        {renderList(tier3, "Tier 3: Faculty", "text-gray-500")}
      </div>
    </div>
  )
}
