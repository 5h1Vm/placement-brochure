'use client'

import { useState } from 'react'
import { BookOpen, Award, Briefcase, UserCircle, Link as LinkIcon, FileText, Globe } from 'lucide-react'
import { getDirectDriveLink } from '@/lib/utils'

export default function ClientStudentGrid({ students }: { students: any[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  
  // Extract all unique tags
  const allTags = Array.from(
    new Set(students.flatMap(s => s.tags.map((t: any) => t.name)))
  ).sort()

  const filteredStudents = (selectedTag 
    ? students.filter(s => s.tags.some((t: any) => t.name === selectedTag))
    : students).sort((a, b) => {
      const topTier = ['Shivam Kumar Singh', 'Vedant Prasad', 'Abhinand A', 'Vaibhav Tripathi'];
      const aTop = topTier.includes(a.name) ? topTier.indexOf(a.name) : 999;
      const bTop = topTier.includes(b.name) ? topTier.indexOf(b.name) : 999;
      if (aTop !== bTop) return aTop - bTop;
      
      const getScore = (s: any) => {
        let score = 0;
        if (s.experience && s.experience.trim() !== '') score += s.experience.split('\n').length * 10;
        if (s.certifications && s.certifications.trim() !== '') score += s.certifications.split('\n').length * 10;
        if (s.achievements && s.achievements.trim() !== '') score += s.achievements.split('\n').length * 10;
        if (s.tags) score += s.tags.length * 2;
        if (s.imageUrl) score += 50;
        if (s.linkedinUrl) score += 20;
        if (s.portfolioUrl) score += 20;
        if (s.resumeUrl) score += 20;
        return score;
      };
      
      const scoreDiff = getScore(b) - getScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return a.name.localeCompare(b.name);
    })

  return (
    <div>
      {/* Filters (Toggleable) */}
      <div className="mb-8">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center hover:text-primary transition-colors"
        >
          {isFilterOpen ? 'Hide Filters ▲' : 'Filter by Domain ▼'}
        </button>
        
        {isFilterOpen && (
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <button 
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === null ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
            >
              All Students
            </button>
            {allTags.map(tag => (
              <button 
                key={tag as string}
                onClick={() => setSelectedTag(tag as string)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-secondary-dark text-white border border-secondary-dark' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
              >
                {tag as string}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredStudents.map((student: any) => (
          <div key={student.id} className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 transition-all duration-300 flex flex-col h-full relative">
            <div className="flex items-start space-x-6 mb-4 pb-4 border-b border-gray-200/60">
              <div className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-white/40 rounded-xl overflow-hidden flex flex-shrink-0 items-center justify-center border-2 border-white/60 shadow-inner">
                {student.imageUrl ? (
                  <img src={getDirectDriveLink(student.imageUrl) || student.imageUrl} alt={student.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <UserCircle className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-primary">{student.name}</h3>
                
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  {student.portfolioUrl && (
                    <a href={student.portfolioUrl.trim().startsWith('http') ? student.portfolioUrl.trim() : `https://${student.portfolioUrl.trim()}`} target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-primary flex items-center text-sm font-bold transition-colors">
                      <Globe className="w-4 h-4 mr-1" /> Portfolio
                    </a>
                  )}
                  {student.linkedinUrl && (
                    <a href={student.linkedinUrl.trim().startsWith('http') ? student.linkedinUrl.trim() : `https://${student.linkedinUrl.trim()}`} target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-primary flex items-center text-sm font-bold transition-colors">
                      <LinkIcon className="w-4 h-4 mr-1" /> LinkedIn
                    </a>
                  )}
                  {student.resumeUrl && (
                    <a href={getDirectDriveLink(student.resumeUrl) || student.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-primary flex items-center text-sm font-bold transition-colors">
                      <FileText className="w-4 h-4 mr-1" /> Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-5 flex-grow overflow-y-auto custom-scrollbar pr-2 max-h-[350px]">
              {student.tags && student.tags.length > 0 && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-secondary uppercase tracking-[0.15em] mb-2">
                    <BookOpen className="w-4 h-4 mr-2 shrink-0" /> Domains & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {student.tags.map((tag: any) => (
                      <span key={tag.id} className="bg-primary/5 border border-primary/10 text-primary text-xs px-2.5 py-1 rounded-md font-semibold">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {student.experience && student.experience.trim() !== '' && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-secondary uppercase tracking-[0.15em] mb-2">
                    <Briefcase className="w-4 h-4 mr-2 shrink-0" /> Experience
                  </h4>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-1">{student.experience}</div>
                </div>
              )}

              {student.certifications && student.certifications.trim() !== '' && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-secondary uppercase tracking-[0.15em] mb-2">
                    <Award className="w-4 h-4 mr-2 shrink-0" /> Certifications
                  </h4>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-1">
                    {student.certifications}
                  </div>
                </div>
              )}

              {student.achievements && student.achievements.trim() !== '' && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-secondary uppercase tracking-[0.15em] mb-2">
                    <Award className="w-4 h-4 mr-2 shrink-0" /> Achievements
                  </h4>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-1">
                    {student.achievements}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 italic">No candidates match the selected domain.</p>
        </div>
      )}
    </div>
  )
}
