import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import LoginForm from './LoginForm'
import CourseManager from './CourseManager'
import TagManager from './TagManager'
import SettingsManager from './SettingsManager'
import FacultyManager from './FacultyManager'
import { logoutAdmin, deleteRecruiterVisit } from './actions'

import AdminTabs from './AdminTabs'

const prisma = new PrismaClient()

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true'

  if (!isAuthenticated) {
    return <LoginForm />
  }

  const visits = await prisma.recruiterVisit.findMany({
    orderBy: { visitedAt: 'desc' }
  })
  
  const courses = await prisma.course.findMany({
    orderBy: { name: 'asc' }
  })
  
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' }
  })
  
  const totalStudents = await prisma.student.count()
  
  let settings = await prisma.platformSettings.findUnique({ where: { id: 'default' } })
  if (!settings) {
    settings = await prisma.platformSettings.create({ data: { id: 'default' } })
  }

  const faculty = await prisma.faculty.findMany({
    orderBy: { order: 'asc' }
  })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b-2 border-secondary-light pb-2">
        <h1 className="text-3xl font-bold text-primary">
          Admin Dashboard
        </h1>
        <form action={logoutAdmin}>
          <button type="submit" className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded font-medium">
            Logout
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Panel */}
        <div className="lg:col-span-2">
          <AdminTabs 
            courses={<CourseManager key="courses-panel" existingCourses={courses} existingTags={tags} />}
            faculty={<FacultyManager key="faculty-panel" existingFaculty={faculty} />}
            domains={<TagManager key="domains-panel" existingTags={tags} />}
            visits={
              <div key="visits-panel" className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Recruiter Visits</h2>
                {visits.length === 0 ? (
                  <p className="text-text-muted italic">No recruiters have identified themselves yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                      <thead className="uppercase tracking-wider border-b-2 border-gray-200 text-text-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Name</th>
                          <th scope="col" className="px-6 py-3">Company</th>
                          <th scope="col" className="px-6 py-3">Contact</th>
                          <th scope="col" className="px-6 py-3">Time of Visit</th>
                          <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visits.map((visit) => (
                          <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{visit.name}</td>
                            <td className="px-6 py-4 text-gray-600">{visit.company}</td>
                            <td className="px-6 py-4 text-gray-600">{visit.contact || 'N/A'}</td>
                            <td className="px-6 py-4 text-gray-500">{new Date(visit.visitedAt).toLocaleString()}</td>
                            <td className="px-6 py-4 text-right">
                              <form action={deleteRecruiterVisit.bind(null, visit.id)}>
                                <button type="submit" className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            }
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-primary-dark text-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Platform Stats</h2>
            <p className="text-secondary-light text-3xl font-bold">{totalStudents}</p>
            <p className="text-sm opacity-80 uppercase tracking-wider">Total Students in DB</p>
          </div>
          
          <SettingsManager initialSettings={settings} />
          
        </div>
      </div>
    </div>
  )
}
