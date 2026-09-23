import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Users, BookOpen, ChevronRight } from 'lucide-react'

const prisma = new PrismaClient()

export default async function CoursesIndexPage() {
  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: { students: true }
      }
    }
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase mb-2">Talent Directory</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
          Our Programmes
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course) => (
          <Link href={`/courses/${course.slug}`} key={course.id} className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50 group-hover:bg-primary/5 transition-colors">
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 group-hover:text-primary-light transition-colors">
                  {course.name}
                </h2>
                <p className="text-sm font-semibold text-secondary-dark tracking-wide uppercase">Batch of {course.batch}</p>
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between">
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                  {course.description || "Learn more about the candidates in this specialized program."}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-bold text-gray-500 flex items-center">
                    <Users className="w-4 h-4 mr-1.5" /> {course._count.students} Candidates
                  </span>
                  
                  <span className="text-sm font-bold text-primary flex items-center group-hover:text-primary-light transition-colors">
                    View Profiles <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
