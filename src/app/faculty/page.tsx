import { PrismaClient } from '@prisma/client'
import { LinkIcon, Mail } from 'lucide-react'

const prisma = new PrismaClient()

export default async function FacultyPage() {
  const faculty = await prisma.faculty.findMany({
    orderBy: { order: 'asc' }
  })

  const tier1 = faculty.filter(f => f.roleTier === 1)
  const tier2 = faculty.filter(f => f.roleTier === 2)
  const tier3 = faculty.filter(f => f.roleTier === 3)

  return (
    <div className="min-h-screen bg-[#f0f2f5] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#e1e6ef] via-[#f0f2f5] to-[#f0f2f5]">
      {/* Hero Section */}
      <div className="bg-primary pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-secondary font-bold tracking-widest uppercase text-sm mb-4">NFSU Delhi Campus</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Leadership & Faculty</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Meet the distinguished visionaries, directors, and academic experts driving innovation and excellence at the National Forensic Sciences University.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* Tier 1: VC and Campus Director (Giant Cards) */}
        {tier1.length > 0 && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {tier1.map(fac => (
                <div key={fac.id} className="bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-48 bg-primary/5"></div>
                  <div className="px-8 pb-8 text-center -mt-24">
                    <div className="w-48 h-48 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-6">
                      {fac.imageUrl ? (
                        <img src={fac.imageUrl} alt={fac.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl font-bold text-gray-300">{fac.name.charAt(0)}</span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-1">{fac.name}</h2>
                    <p className="text-secondary-dark font-black tracking-wider uppercase text-sm mb-4">{fac.title}</p>
                    {fac.bio && <div className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base max-h-40 overflow-y-auto custom-scrollbar px-2 whitespace-pre-line text-left">{fac.bio}</div>}
                    
                    <div className="flex justify-center gap-4">
                      {fac.linkedinUrl && (
                        <a href={fac.linkedinUrl} target="_blank" rel="noreferrer" className="bg-[#0077b5] text-white p-2 rounded-full hover:opacity-80 transition-opacity shadow-sm">
                          <LinkIcon className="w-5 h-5" />
                        </a>
                      )}
                      {fac.email && (
                        <a href={`mailto:${fac.email}`} className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors shadow-sm">
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tier 2: Deans and Coordinators (Large Cards) */}
        {tier2.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-gray-300 flex-1"></div>
              <h3 className="text-xl font-black text-primary tracking-widest uppercase">Our Esteemed Faculties</h3>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {tier2.map(fac => (
                <div key={fac.id} className="bg-white/60 backdrop-blur-lg border border-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
                    {fac.imageUrl ? (
                      <img src={fac.imageUrl} alt={fac.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-gray-300">{fac.name.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-1">{fac.name}</h3>
                  <p className="text-secondary-dark font-bold text-xs uppercase tracking-wide mb-3">{fac.title}</p>
                  {fac.bio && <div className="text-gray-600 text-xs mb-4 max-h-32 overflow-y-auto custom-scrollbar px-2 whitespace-pre-line text-left w-full">{fac.bio}</div>}
                  
                  <div className="mt-auto flex justify-center gap-3 w-full border-t border-gray-100 pt-4">
                    {fac.linkedinUrl && (
                      <a href={fac.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#0077b5] hover:opacity-70 transition-opacity">
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    )}
                    {fac.email && (
                      <a href={`mailto:${fac.email}`} className="text-gray-500 hover:text-primary transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tier 3: Standard Faculty (Grid Cards) */}
        {tier3.length > 0 && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {tier3.map(fac => (
                <div key={fac.id} className="bg-white border border-gray-100 shadow-sm rounded-lg p-5 flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-full border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                      {fac.imageUrl ? (
                        <img src={fac.imageUrl} alt={fac.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-gray-300">{fac.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm leading-tight">{fac.name}</h4>
                      <p className="text-xs text-secondary-dark font-semibold mt-0.5">{fac.title}</p>
                    </div>
                  </div>
                  {fac.bio && <div className="text-gray-500 text-[11px] mb-3 max-h-24 overflow-y-auto custom-scrollbar px-1 whitespace-pre-line text-left">{fac.bio}</div>}
                  
                  <div className="mt-auto flex justify-end gap-2">
                    {fac.linkedinUrl && (
                      <a href={fac.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#0077b5] hover:opacity-70 transition-opacity">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {fac.email && (
                      <a href={`mailto:${fac.email}`} className="text-gray-400 hover:text-primary transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
