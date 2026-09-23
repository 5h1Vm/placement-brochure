'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { bulkImportStudents } from './actions'
import { useRouter } from 'next/navigation'

type ExcelUploaderProps = {
  courseId: string
  existingTags: any[]
  onClose: () => void
}

export default function CsvUploader({ courseId, existingTags, onClose }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      parseAndPreview(e.target.files[0])
    }
  }

  function parseAndPreview(excelFile: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      if (!data) return
      
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]
      
      const newWarnings: string[] = []
      const validTagNames = new Set(existingTags.map(t => t.name.toLowerCase().trim()))

      jsonData.forEach((row, i) => {
        if (row.Domains) {
          const rowDomains = String(row.Domains).split(',').map((d: string) => d.trim()).filter(Boolean)
          rowDomains.forEach((d: string) => {
            if (!validTagNames.has(d.toLowerCase())) {
              if (!newWarnings.includes(d)) newWarnings.push(d)
            }
          })
        }
      })

      setPreview(jsonData)
      setWarnings(newWarnings)
    }
    reader.readAsArrayBuffer(excelFile)
  }

  async function handleUpload(mode: 'append' | 'replace') {
    if (!preview.length) return
    setLoading(true)
    
    // Process the data to only include valid domains
    const validTagNames = existingTags.map(t => t.name.toLowerCase().trim())
    const processedData = preview.map(row => {
      const domains = (row.Domains || '').split(',').map((d: string) => d.trim()).filter(Boolean)
      const validDomains = domains.filter((d: string) => validTagNames.includes(d.toLowerCase()))
      
      return {
        name: row.Name || 'Unknown',
        experience: row.Experience || '',
        certifications: row.Certifications || '',
        achievements: row.Achievements || '',
        linkedinUrl: row['LinkedIn URL'] || '',
        resumeUrl: row['Resume Drive Link'] || '',
        photoUrl: row['Photo Drive Link'] || '',
        domains: validDomains
      }
    })

    const res = await bulkImportStudents(courseId, processedData, mode)
    setLoading(false)
    if (res.success) {
      alert(`Success! Imported ${processedData.length} students.`)
      router.refresh()
      onClose()
    } else {
      alert(`Error: ${res.error}`)
    }
  }

  return (
    <div className="bg-white border-2 border-primary/20 rounded-lg p-5 mt-3 shadow-inner">
      <h3 className="font-bold text-primary mb-3">Upload Students via CSV</h3>
      
      <div className="mb-4">
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-gray-600 font-medium">Click to select Excel/CSV file</span>
          <br />
          <span className="text-gray-400 text-xs">or drag and drop here (.xlsx, .xls, .csv)</span>
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
        <p className="text-xs text-gray-400 mt-1">Columns: Name, Experience, Certifications, Achievements, LinkedIn URL, Resume Drive Link, Photo Drive Link, Domains</p>
      </div>

      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm font-medium">
            Ready to import {preview.length} students.
          </div>
          
          {warnings.length > 0 && (
            <div className="bg-amber-50 text-amber-800 p-3 rounded text-sm border border-amber-200">
              <p className="font-bold mb-1">⚠️ Unknown Domains Found</p>
              <p className="mb-2">The following domains do not exist in the database and will be <strong>ignored</strong>:</p>
              <div className="flex flex-wrap gap-1">
                {warnings.map(w => <span key={w} className="bg-amber-100 px-2 py-0.5 rounded text-xs">{w}</span>)}
              </div>
              <p className="mt-2 text-xs">If you want to keep these, please create them in the "Manage Domains" section first, then upload again.</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button 
              disabled={loading}
              onClick={() => handleUpload('replace')}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-sm transition-colors"
            >
              {loading ? 'Uploading...' : 'Replace All Existing Students'}
            </button>
            <button 
              disabled={loading}
              onClick={() => handleUpload('append')}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded text-sm transition-colors"
            >
              {loading ? 'Uploading...' : 'Append to Existing'}
            </button>
          </div>
          
          <button 
            disabled={loading}
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-800 text-sm font-semibold underline mt-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
