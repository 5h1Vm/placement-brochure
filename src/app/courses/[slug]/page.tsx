import { prisma } from '@/lib/prisma'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ClientStudentGrid from './ClientStudentGrid'
import CourseStats from './CourseStats'

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({ select: { slug: true } })
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  let course = null;
  try {
    course = await prisma.course.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        students: {
          include: {
            tags: true
          }
        }
      }
    });
  } catch (error) {
    console.warn("DB Read failed for course:", resolvedParams.slug);
  }

    if (course && course.slug === 'bsms') {
    const desiredOrder = ['Biplab Pradhan','Varun','Suprasweeni Sharma','Nistha Jaitly','Nikhil Patil','Shatakshi Khadke','Dibyendu Das','Anjali Kumari','Rajeeva Verma','Himanshu Kumar','Krish Waila','Nandini Shri','Pritham Kaur','Vanshika Jain'];
    course.students.sort((a, b) => {
      let idxA = desiredOrder.findIndex(name => a.name === name);
      let idxB = desiredOrder.findIndex(name => b.name === name);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });
  }

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#e1e6ef] via-[#f0f2f5] to-[#f0f2f5]">
      <div className="container mx-auto px-4 py-8 relative z-10">
      <Link href="/courses" className="inline-flex items-center text-primary hover:text-primary-light font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
      </Link>

      <div className="mb-12">
        {/* Course Header — glassmorphism style to match the rest of the page */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg rounded-2xl p-8 md:p-10">
          <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase mb-3">Programme</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">{course.name}</h1>
          <p className="text-secondary-dark text-lg font-bold">Batch of {course.batch}</p>
          
          {(() => {
            const officialLinks: Record<string, string> = {
              'btmt': 'https://delhi.nfsu.ac.in/program/prog_details/5?deptid=49',
              'bsms': 'https://delhi.nfsu.ac.in/program/prog_details/8?deptid=46',
              'msc-cyber': 'https://delhi.nfsu.ac.in/program/prog_details/12?deptid=46',
              'msc-dfis': 'https://delhi.nfsu.ac.in/program/prog_details/23?deptid=49'
            };
            const link = officialLinks[course.slug];
            if (!link) return null;
            return (
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center mt-5 px-6 py-3 bg-gradient-to-r from-primary to-[#162542] text-white font-semibold text-sm rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-white/10 group"
              >
                View Official Program Details
                <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            );
          })()}

          {course.description && (
            <p className="mt-4 text-gray-600 leading-relaxed">{course.description}</p>
          )}
        </div>
        
        {/* Stats Card */}
        <div className="mt-6 bg-white/60 border border-white/50 shadow-sm rounded-2xl p-8">
          <CourseStats course={course} />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-2">
        <h2 className="text-2xl font-bold text-primary">
          Candidate Profiles ({course.students.length})
        </h2>
      </div>
      
      <div style={{ isolation: 'isolate', position: 'relative' }}>
        <ClientStudentGrid students={course.students} />
      </div>
      </div>
    </div>
  )
}
