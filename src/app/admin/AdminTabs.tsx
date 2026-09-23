'use client'

import { useState, ReactNode } from 'react'

interface AdminTabsProps {
  courses: ReactNode
  faculty: ReactNode
  domains: ReactNode
  visits: ReactNode
}

export default function AdminTabs({ courses, faculty, domains, visits }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'faculty' | 'domains' | 'visits'>('courses')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'courses' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Programs & Students
        </button>
        <button 
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'faculty' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Leadership & Faculty
        </button>
        <button 
          onClick={() => setActiveTab('domains')}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'domains' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Manage Domains
        </button>
        <button 
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'visits' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Recruiter Log
        </button>
      </div>

      <div>
        {activeTab === 'courses' && courses}
        {activeTab === 'faculty' && faculty}
        {activeTab === 'domains' && domains}
        {activeTab === 'visits' && visits}
      </div>
    </div>
  )
}
