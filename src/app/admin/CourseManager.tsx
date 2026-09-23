'use client'

import { useState } from 'react'
import { addCourse, updateCourse, deleteCourse } from './actions'
import { useRouter } from 'next/navigation'
import CsvUploader from './CsvUploader'

export default function CourseManager({ existingCourses, existingTags }: { existingCourses: any[], existingTags: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    
    let res;
    if (editingCourse) {
      res = await updateCourse(editingCourse.id, formData)
    } else {
      res = await addCourse(formData)
    }
    
    if (res.success) {
      setIsAdding(false)
      setEditingCourse(null)
      router.refresh()
    } else {
      setError(res.error || 'Failed')
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      const res = await deleteCourse(id)
      if (res.success) {
        router.refresh()
      } else {
        alert(res.error || 'Failed to delete course')
      }
    }
  }

  function handleEdit(course: any) {
    setEditingCourse(course)
    setIsAdding(true)
  }

  function handleCancel() {
    setIsAdding(false)
    setEditingCourse(null)
    setError('')
  }

  const [uploadingFor, setUploadingFor] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Manage Programs</h2>
        <button 
          onClick={() => {
            if (isAdding) {
              handleCancel()
            } else {
              setIsAdding(true)
              setEditingCourse(null)
            }
          }}
          className="bg-secondary hover:bg-secondary-dark text-white text-sm font-semibold py-1.5 px-3 rounded"
        >
          {isAdding ? 'Cancel' : '+ New Program'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6 space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Course Name</label>
            <input name="name" required defaultValue={editingCourse?.name || ''} className="w-full border rounded px-3 py-1.5 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">URL Slug</label>
              <input name="slug" required defaultValue={editingCourse?.slug || ''} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Batch Year</label>
              <input name="batch" required defaultValue={editingCourse?.batch || ''} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">About / Description</label>
            <textarea name="description" rows={2} defaultValue={editingCourse?.description || ''} className="w-full border rounded px-3 py-1.5 text-sm"></textarea>
          </div>
          <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded border border-blue-200 mt-3">
            <p className="font-bold mb-1">💡 Automated Statistics</p>
            <p>Batch Size, Top Domain, and Avg Experience are now automatically calculated in real-time based on the uploaded candidate profiles.</p>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="bg-primary text-white text-sm font-bold py-1.5 px-4 rounded w-full">
            {editingCourse ? 'Update Program' : 'Save Program'}
          </button>
        </form>
      )}

      <ul className="space-y-3">
        {existingCourses.map(course => (
          <li key={course.id} className="border border-gray-100 p-3 rounded flex flex-col bg-gray-50 hover:bg-gray-100">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="font-bold text-sm text-primary">{course.name}</p>
                <p className="text-xs text-gray-500">Slug: /{course.slug} • Batch: {course.batch}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setUploadingFor(uploadingFor === course.id ? null : course.id)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded font-semibold">
                  {uploadingFor === course.id ? 'Cancel CSV' : 'Upload CSV'}
                </button>
                <button onClick={() => handleEdit(course)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(course.id)} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded">
                  Delete
                </button>
              </div>
            </div>
            {uploadingFor === course.id && (
              <CsvUploader 
                courseId={course.id} 
                existingTags={existingTags} 
                onClose={() => setUploadingFor(null)} 
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
