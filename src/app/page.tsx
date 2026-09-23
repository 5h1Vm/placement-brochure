import Link from 'next/link'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  const totalStudents = await prisma.student.count()
  const totalCourses = await prisma.course.count()
  
  // Auto-count internships from student experience data
  const students = await prisma.student.findMany({ select: { experience: true } })
  const internshipCount = students.reduce((count, s) => {
    const exp = s.experience?.toLowerCase() || ''
    // Count semicolons/commas as separators for multiple entries, or count 1 if exists
    if (!exp || exp === 'n/a') return count
    const entries = exp.split(/[;,]/).filter(e => e.trim().length > 0)
    return count + entries.length
  }, 0)

  return (
    <div className="flex flex-col items-center">

      {/* ─── HERO ─── */}
      <section 
        className="w-full relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/collegephoto.png')" }}
      >
        {/* Much lighter overlay, NO blur - lets the photo shine through clearly */}
        <div className="absolute inset-0 bg-white/50" />
        {/* Subtle top shadow to blend with the dark header */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/20 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28 text-center">
          {/* Official full NFSU logo - Added a white glow drop-shadow to keep dark text readable over the busy photo */}
          <div className="mb-12 inline-block">
            <img 
              src="/nfsu-logo-full.png" 
              alt="National Forensic Sciences University — Official Logo" 
              className="h-20 md:h-28 lg:h-32 object-contain mx-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]" 
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-5 tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">
            Placement Brochure <span className="text-secondary drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">2026–27</span>
          </h1>
          <p className="text-sm font-bold tracking-[0.35em] text-gray-800 mb-8 uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
            People · Purpose · Possibilities
          </p>
          <p className="text-base md:text-lg text-gray-900 max-w-2xl mx-auto mb-12 leading-relaxed font-bold drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
            School of Cyber Security & Digital Forensics <br /> 
            Discover top talent equipped with cutting edge skills in CyberSecurity, Digital Forensics, and AI.
          </p>
          
          {/* Two CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/courses" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-xl transition-all text-lg shadow-[0_8px_20px_rgba(27,42,74,0.4)] hover:-translate-y-0.5">
              View Candidate Profiles
            </Link>
            <a href="#footer-contact" className="inline-block bg-white/95 hover:bg-white text-primary font-bold py-4 px-10 rounded-xl transition-all text-lg border border-gray-300 shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-gray-400">
              Contact Placement Office
            </a>
          </div>
        </div>
      </section>

      {/* ─── STATS (floating card) ─── */}
      <section className="w-full -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 text-center border-b sm:border-b-0 sm:border-r border-gray-100">
              <h3 className="text-5xl font-black text-primary mb-1">{totalStudents > 10 ? totalStudents + '+' : totalStudents}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Technical Talent</p>
            </div>
            <div className="p-8 text-center border-b sm:border-b-0 sm:border-r border-gray-100">
              <h3 className="text-5xl font-black text-primary mb-1">{totalCourses}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Programme Tracks</p>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-5xl font-black text-primary mb-1">{internshipCount > 0 ? internshipCount + '+' : '—'}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Internships & Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY NFSU ─── */}
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase mb-3">Why Recruit From</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary">NFSU Delhi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Computer Science Foundation", desc: "Programming, data structures & algorithms, databases, operating systems, computer networks, software engineering and AI/ML." },
              { title: "Cybersecurity & Digital Forensics", desc: "VAPT, application security, network security, SOC operations, incident response, malware analysis and digital forensics." },
              { title: "Hands-on Technical Experience", desc: "Laboratory work, technical projects, internships, applied research and practical problem-solving across security and technology domains." },
              { title: "Industry & Public-Sector Exposure", desc: "Exposure across technology, consulting, infrastructure, government, law enforcement, forensic laboratories and research ecosystems." },
            ].map(item => (
              <div key={item.title} className="group p-8 rounded-2xl border border-gray-100 hover:border-secondary/30 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50/50 to-white">
                <h4 className="text-lg font-bold text-primary mb-3 group-hover:text-primary-light transition-colors">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECHNICAL DOMAINS (dark contrast section) ─── */}
      <section className="w-full py-24 bg-primary">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase mb-3">Technical Domains</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-10">Skills Across Technology & Security</h2>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Programming", "Data Structures & Algorithms", "Software Engineering", 
              "Databases", "Computer Networks", "Cloud & DevOps", "AI / Machine Learning", 
              "Application Security", "VAPT", "SOC Operations", "Threat Intelligence", 
              "Incident Response", "Malware Analysis", "Digital Forensics", "GRC & Compliance", "Mobile Security"
            ].map(skill => (
              <span key={skill} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECRUITMENT & NEWS ─── */}
      <section className="w-full py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Recruitment Steps */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase mb-3">Recruitment</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-10">Connect With NFSU Talent</h2>
              
              <div className="space-y-0">
                {[
                  { num: "01", title: "Share Requirements", desc: "Share the role, skills, eligibility and hiring requirements." },
                  { num: "02", title: "Explore Talent", desc: "Review relevant candidate profiles and technical capabilities." },
                  { num: "03", title: "Conduct Recruitment", desc: "Coordinate assessments, interviews and selection rounds." },
                  { num: "04", title: "Select Candidates", desc: "Complete the selection and offer process with NFSU support." },
                ].map(step => (
                  <div key={step.num} className="flex items-start group py-6 border-b border-gray-200 last:border-b-0 hover:bg-white hover:px-4 hover:rounded-xl hover:border-transparent transition-all duration-200">
                    <span className="text-3xl font-black text-primary/15 group-hover:text-secondary mr-6 transition-colors select-none w-12 shrink-0">{step.num}</span>
                    <div>
                      <h4 className="text-lg font-bold text-primary mb-1 group-hover:text-primary-light transition-colors">{step.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media/News */}
            <div className="flex flex-col">
              <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase mb-3">In The News</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-8">Media Coverage</h2>
              
              <a href="https://www.aninews.in/topic/nfsu/" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 bg-white">
                <div className="w-full">
                  <img src="/newspapertxt.png" alt="NFSU in the News" className="w-full h-auto" />
                </div>
                <div className="px-6 py-5 bg-primary text-white flex justify-between items-center group-hover:bg-primary-light transition-colors">
                  <span className="font-bold">Read NFSU News on ANI</span>
                  <span className="text-xl font-bold group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
                </div>
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
