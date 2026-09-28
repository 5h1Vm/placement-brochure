'use client'

import { useState } from 'react'
import { BookOpen, Award, Briefcase, UserCircle, Link as LinkIcon, FileText, Globe } from 'lucide-react'
import { getDirectDriveLink } from '@/lib/utils'

export default function ClientStudentGrid({ students }: { students: any[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Extract all unique tags
  const allTags = Array.from(
    new Set(students.flatMap(s => s.tags.map((t: any) => t.name)))
  ).sort((a: any, b: any) => {
    if (a === 'Digital Forensics') return 1;
    if (b === 'Digital Forensics') return -1;
    return a.localeCompare(b);
  })

  const filteredStudents = (selectedTag 
    ? students.filter(s => s.tags.some((t: any) => t.name === selectedTag))
    : students).sort((a, b) => {
      const topTier = ['Shivam Kumar Singh', 'Vedant Prasad', 'Abhinand A', 'Vaibhav Tripathi'];
      const aTop = topTier.includes(a.name) ? topTier.indexOf(a.name) : 999;
      const bTop = topTier.includes(b.name) ? topTier.indexOf(b.name) : 999;
      if (aTop !== bTop) return aTop - bTop;
      
      const getScore = (s: any) => {
        let score = 0;
        
        // 1. Core hygiene factors (Must-haves for recruiters)
        if (s.resumeUrl) score += 200;
        if (s.imageUrl) score += 150;
        if (s.linkedinUrl) score += 100;
        if (s.portfolioUrl) score += 100; // GitHub / Website
        
        // 2. Real-world Experience (Highest value content)
        if (s.experience && s.experience.trim() !== '') {
          const lines = s.experience.split('\n').filter((l: string) => l.trim().length > 0);
          score += lines.length * 75; 
        }

        // 3. Verifiable Skills (Certifications)
        if (s.certifications && s.certifications.trim() !== '') {
          const lines = s.certifications.split('\n').filter((l: string) => l.trim().length > 0);
          score += lines.length * 40;
        }

        // 4. Extracurriculars / Wins (Achievements)
        if (s.achievements && s.achievements.trim() !== '') {
          const lines = s.achievements.split('\n').filter((l: string) => l.trim().length > 0);
          score += lines.length * 30;
        }

        // 5. Versatility (Domain tags)
        if (s.tags) score += s.tags.length * 5;
        
        return score;
      };
      
      const scoreDiff = getScore(b) - getScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return a.name.localeCompare(b.name);
    })

  return (
    <div>
      {/* Filter toggle button */}
      <div className="relative z-30 mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{ touchAction: 'manipulation' }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-gray-300 shadow-sm text-sm font-bold text-gray-600 select-none cursor-pointer hover:bg-gray-50 active:bg-gray-100"
        >
          <span>{isFilterOpen ? '▲ Hide Filters' : '▼ Filter by Domain'}</span>
          {selectedTag && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">1 active</span>}
        </button>

        {/* Filter tags panel */}
        {isFilterOpen && (
          <div className="flex flex-wrap gap-2 p-4 mt-3 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setSelectedTag(null)}
              style={{ touchAction: 'manipulation' }}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold cursor-pointer select-none transition-colors ${selectedTag === null ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              All Students
            </button>
            {allTags.map(tag => (
              <button
                key={tag as string}
                onClick={() => setSelectedTag(tag as string)}
                style={{ touchAction: 'manipulation' }}
                className={`px-4 py-2.5 rounded-full text-sm font-semibold cursor-pointer select-none transition-colors ${selectedTag === tag ? 'bg-[#8B6914] text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
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
                    {[...student.tags].sort((a: any, b: any) => {
                      if (a.name === 'Digital Forensics') return 1;
                      if (b.name === 'Digital Forensics') return -1;
                      return a.name.localeCompare(b.name);
                    }).map((tag: any) => (
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
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 leading-relaxed marker:text-gray-400">
                    {student.experience.split('\n').filter((l: string) => l.trim().length > 0).map((line: string, i: number) => (
                      <li key={i} className="pl-1">{line.replace(/^[\s•*-]+/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {student.certifications && student.certifications.trim() !== '' && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-secondary uppercase tracking-[0.15em] mb-2">
                    <Award className="w-4 h-4 mr-2 shrink-0" /> Certifications
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 leading-relaxed marker:text-gray-400">
                    {student.certifications.split('\n').filter((l: string) => l.trim().length > 0).map((line: string, i: number) => (
                      <li key={i} className="pl-1">{line.replace(/^[\s•*-]+/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {student.achievements && student.achievements.trim() !== '' && (
                <div>
                  <h4 className="flex items-center text-xs font-bold text-secondary uppercase tracking-[0.15em] mb-2">
                    <Award className="w-4 h-4 mr-2 shrink-0" /> Achievements
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 leading-relaxed marker:text-gray-400">
                    {student.achievements.split('\n').filter((l: string) => l.trim().length > 0).map((line: string, i: number) => (
                      <li key={i} className="pl-1">{line.replace(/^[\s•*-]+/, '')}</li>
                    ))}
                  </ul>
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
