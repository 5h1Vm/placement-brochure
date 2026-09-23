'use server'

import { cookies } from 'next/headers'

export async function loginAdmin(password: string) {
  // Use a hardcoded secret for now, can be moved to .env later
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'nfsu_admin'
  
  if (password === ADMIN_SECRET) {
    (await cookies()).set('admin_auth', 'true', { httpOnly: true, path: '/' })
    return { success: true }
  }
  return { success: false, error: 'Invalid secret' }
}

export async function logoutAdmin() {
  (await cookies()).delete('admin_auth')
}

export async function addCourse(formData: FormData) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const batch = formData.get('batch') as string
  const description = formData.get('description') as string
  
  const statBatchSize = formData.get('statBatchSize') as string
  const statTopExpertise = formData.get('statTopExpertise') as string
  const statAvgExperience = formData.get('statAvgExperience') as string

  if (!name || !slug || !batch) return { success: false, error: 'Missing required fields' }

  try {
    await prisma.course.create({
      data: { name, slug, batch, description, statBatchSize, statTopExpertise, statAvgExperience }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create course. Slug might already exist.' }
  }
}

export async function updateCourse(id: string, formData: FormData) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const batch = formData.get('batch') as string
  const description = formData.get('description') as string
  
  const statBatchSize = formData.get('statBatchSize') as string
  const statTopExpertise = formData.get('statTopExpertise') as string
  const statAvgExperience = formData.get('statAvgExperience') as string

  if (!name || !slug || !batch) return { success: false, error: 'Missing required fields' }

  try {
    await prisma.course.update({
      where: { id },
      data: { name, slug, batch, description, statBatchSize, statTopExpertise, statAvgExperience }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update course.' }
  }
}

export async function deleteCourse(id: string) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  try {
    await prisma.course.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete course.' }
  }
}

export async function deleteTag(id: string) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  await prisma.tag.delete({ where: { id } })
}

export async function addTag(name: string) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  try {
    await prisma.tag.create({ data: { name } })
    return { success: true }
  } catch (e) {
    return { success: false, error: 'Tag might already exist' }
  }
}

export async function updateSettings(data: { primaryColor: string, secondaryColor: string, contactPhone: string, contactEmail: string, coordinatorName: string }) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  await prisma.platformSettings.upsert({
    where: { id: 'default' },
    update: data,
    create: { id: 'default', ...data }
  })
}

export async function bulkImportStudents(courseId: string, studentsData: any[], mode: 'append' | 'replace') {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
  try {
    if (mode === 'replace') {
      await prisma.student.deleteMany({
        where: { courseId }
      })
    }

    // Process students one by one to handle tag connections
    for (const data of studentsData) {
      // Find the tag IDs for the valid domains
      const tags = await prisma.tag.findMany({
        where: {
          name: {
            in: data.domains
          }
        }
      })

      // We need case-insensitive mapping because the DB might have "VAPT" and CSV has "vapt"
      // Wait, sqlite in case-insensitive can be tricky with 'in', but we can just use the tags returned by Prisma.
      // Actually Prisma's `in` is case-sensitive by default in SQLite. 
      // To be safe, we will just fetch all tags and filter in memory since tags are small.
      const allTags = await prisma.tag.findMany()
      const domainsLower = data.domains.map((d: string) => d.toLowerCase())
      const matchedTags = allTags.filter(t => domainsLower.includes(t.name.toLowerCase()))

      await prisma.student.create({
        data: {
          name: data.name,
          courseId,
          experience: data.experience,
          certifications: data.certifications,
          achievements: data.achievements,
          linkedinUrl: data.linkedinUrl,
          resumeUrl: data.resumeUrl,
          imageUrl: data.photoUrl,
          tags: {
            connect: matchedTags.map(t => ({ id: t.id }))
          }
        }
      })
    }
    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message || 'Failed to import students' }
  }
}

// ==========================================
// FACULTY MANAGEMENT
// ==========================================

export async function addFaculty(data: FormData) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  try {
    const faculty = await prisma.faculty.create({
      data: {
        name: data.get('name') as string,
        title: data.get('title') as string,
        roleTier: parseInt(data.get('roleTier') as string, 10) || 3,
        email: data.get('email') as string || null,
        linkedinUrl: data.get('linkedinUrl') as string || null,
        imageUrl: data.get('imageUrl') as string || null,
        bio: data.get('bio') as string || null,
        order: parseInt(data.get('order') as string, 10) || 0,
      }
    })
    return { success: true, faculty }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateFaculty(id: string, data: FormData) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  try {
    const faculty = await prisma.faculty.update({
      where: { id },
      data: {
        name: data.get('name') as string,
        title: data.get('title') as string,
        roleTier: parseInt(data.get('roleTier') as string, 10) || 3,
        email: data.get('email') as string || null,
        linkedinUrl: data.get('linkedinUrl') as string || null,
        imageUrl: data.get('imageUrl') as string || null,
        bio: data.get('bio') as string || null,
        order: parseInt(data.get('order') as string, 10) || 0,
      }
    })
    return { success: true, faculty }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteFaculty(id: string) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  try {
    await prisma.faculty.delete({ where: { id } })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteRecruiterVisit(id: string) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  await prisma.recruiterVisit.delete({ where: { id } });
  const { revalidatePath } = require('next/cache');
  revalidatePath('/admin');
}

export async function updateTag(id: string, name: string) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await prisma.tag.update({ where: { id }, data: { name } });
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Failed to update or domain already exists' };
  }
}
