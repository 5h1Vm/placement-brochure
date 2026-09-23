'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function CourseStats({ course }: { course: any }) {
  // Aggregate tags for pie chart
  const tagCounts: Record<string, number> = {}
  course.students.forEach((s: any) => {
    s.tags.forEach((t: any) => {
      tagCounts[t.name] = (tagCounts[t.name] || 0) + 1
    })
  })
  
  const data = Object.entries(tagCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 skills

  const COLORS = ['#1B2A4A', '#D4A520', '#2C4066', '#F0C75E', '#4A6FA5']

  const batchSize = course.students.length
  const topExpertise = data.length > 0 ? data.slice(0, 3).map(d => d.name).join(', ') : 'N/A'
  
  // Auto-calculate average internships
  let totalInternships = 0
  course.students.forEach((s: any) => {
    const exp = s.experience?.toLowerCase() || ''
    if (exp && exp !== 'n/a') {
      // Split by newline since we formatted them as bulleted lists separated by \n
      const entries = exp.split(/\n/).filter((e: string) => e.trim().length > 0)
      totalInternships += entries.length
    }
  })
  
  const totalExpLabel = `${totalInternships}+`

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Batch Stats</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Aggregated insights from student profiles</p>
        </div>
        <span className="mt-3 sm:mt-0 bg-secondary/10 text-secondary-dark text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-secondary/30 shadow-sm">
          Batch Data
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side: Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/40 p-4 rounded-xl shadow-sm border border-white/60 backdrop-blur-sm">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Batch Size</p>
            <p className="text-3xl font-bold text-gray-900">{batchSize}</p>
          </div>
          <div className="bg-white/40 p-4 rounded-xl shadow-sm border border-white/60 backdrop-blur-sm">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Top Domains</p>
            <p className="text-sm font-bold text-gray-900 leading-tight whitespace-normal break-words" title={topExpertise}>{topExpertise}</p>
          </div>
          <div className="bg-white/40 p-4 rounded-xl shadow-sm border border-white/60 backdrop-blur-sm">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Total Internships</p>
            <p className="text-xl font-bold text-gray-900">{totalExpLabel}</p>
          </div>
        </div>

        {/* Right Side: Pie Chart */}
        {data.length > 0 && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth={2}
                  label={({ name, percent }) => `${name} (${(((percent ?? 0)) * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '12px', color: '#1F2937', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#1F2937', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
