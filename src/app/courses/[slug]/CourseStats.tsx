'use client'

import DomainPieChart from './DomainPieChart'

export default function CourseStats({ course }: { course: any }) {
  const tagCounts: Record<string, number> = {}
  course.students.forEach((s: any) => {
    s.tags.forEach((t: any) => {
      tagCounts[t.name] = (tagCounts[t.name] || 0) + 1
    })
  })

  const data = Object.entries(tagCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const batchSize = course.students.length
  const topExpertise = data.length > 0 ? data.slice(0, 3).map(d => d.name).join(', ') : 'N/A'

  let totalInternships = 0
  course.students.forEach((s: any) => {
    const exp = s.experience?.toLowerCase() || ''
    if (exp && exp !== 'n/a') {
      const entries = exp.split(/\n/).filter((e: string) => e.trim().length > 0)
      totalInternships += entries.length
    }
  })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Batch Stats</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Aggregated insights from student profiles</p>
        </div>
        <span className="mt-3 sm:mt-0 bg-secondary/10 text-secondary-dark text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-secondary/30 shadow-sm">
          Batch Data
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: 3 stat cards in a row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/40 p-4 rounded-xl shadow-sm border border-white/60 backdrop-blur-sm text-center">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Batch Size</p>
            <p className="text-3xl font-black text-gray-900">{batchSize}</p>
          </div>
          <div className="bg-white/40 p-4 rounded-xl shadow-sm border border-white/60 backdrop-blur-sm text-center">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Top Domains</p>
            <p className="text-xs font-bold text-gray-900 leading-tight">{topExpertise}</p>
          </div>
          <div className="bg-white/40 p-4 rounded-xl shadow-sm border border-white/60 backdrop-blur-sm text-center">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Internships</p>
            <p className="text-3xl font-black text-gray-900">{totalInternships}+</p>
          </div>
        </div>

        {/* Right: semi-circle chart */}
        {data.length > 0 && (
          <div className="w-full min-w-0">
            <DomainPieChart data={data} />
          </div>
        )}
      </div>
    </div>
  )
}
