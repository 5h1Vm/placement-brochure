'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { sanitizeText, sanitizeColor, sanitizeSlug, sanitizeUrl } from '@/lib/sanitize'
import { isRateLimited } from '@/lib/rate-limit'
import { revalidatePath } from 'next/cache'

async function verifyAuth() {
  const ADMIN_SECRET = process.env.ADMIN_SECRET
  if (!ADMIN_SECRET) {
    throw new Error('Server misconfigured: ADMIN_SECRET not set')
  }
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== ADMIN_SECRET) {
    throw new Error('Unauthorized Action Blocked')
  }
}


export async function loginAdmin(password: string) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET
  if (!ADMIN_SECRET) {
    return { success: false, error: 'Server misconfigured. Set ADMIN_SECRET environment variable.' }
  }

  // Rate limit login attempts: max 5 per minute globally (server actions don't easily expose IP)
  if (isRateLimited('admin-login-global', 5, 60_000)) {
    return { success: false, error: 'Too many login attempts. Try again in a minute.' }
  }

  // Constant-time comparison to prevent timing attacks
  const passwordBuffer = Buffer.from(password)
  const secretBuffer = Buffer.from(ADMIN_SECRET)
  
  if (passwordBuffer.length !== secretBuffer.length) {
    return { success: false, error: 'Invalid secret' }
  }
  
  const { timingSafeEqual } = await import('crypto')
  if (!timingSafeEqual(passwordBuffer, secretBuffer)) {
    return { success: false, error: 'Invalid secret' }
  }
  
  const cookieStore = await cookies()
  cookieStore.set('admin_auth', ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 4 // 4 hour session max
  })
  return { success: true }
}

export async function logoutAdmin() {
  (await cookies()).delete('admin_auth')
}

export async function addCourse(formData: FormData) {
  await verifyAuth()
  
  const name = sanitizeText(formData.get('name') as string)
  const slug = sanitizeSlug(formData.get('slug') as string || '')
  const batch = sanitizeText(formData.get('batch') as string)
  const description = sanitizeText(formData.get('description') as string)
  
  const statBatchSize = sanitizeText(formData.get('statBatchSize') as string)
  const statTopExpertise = sanitizeText(formData.get('statTopExpertise') as string)
  const statAvgExperience = sanitizeText(formData.get('statAvgExperience') as string)

  if (!name || !slug || !batch) return { success: false, error: 'Missing required fields' }

  try {
    await prisma.course.create({
      data: { name, slug, batch, description, statBatchSize, statTopExpertise, statAvgExperience }
    })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to create course. Slug might already exist.' }
  }
}

export async function updateCourse(id: string, formData: FormData) {
  await verifyAuth()
  
  const name = sanitizeText(formData.get('name') as string)
  const slug = sanitizeSlug(formData.get('slug') as string || '')
  const batch = sanitizeText(formData.get('batch') as string)
  const description = sanitizeText(formData.get('description') as string)
  
  const statBatchSize = sanitizeText(formData.get('statBatchSize') as string)
  const statTopExpertise = sanitizeText(formData.get('statTopExpertise') as string)
  const statAvgExperience = sanitizeText(formData.get('statAvgExperience') as string)

  if (!name || !slug || !batch) return { success: false, error: 'Missing required fields' }

  try {
    await prisma.course.update({
      where: { id },
      data: { name, slug, batch, description, statBatchSize, statTopExpertise, statAvgExperience }
    })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update course.' }
  }
}

export async function deleteCourse(id: string) {
  await verifyAuth()
  try {
    await prisma.course.delete({ where: { id } })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete course.' }
  }
}

export async function deleteTag(id: string) {
  await verifyAuth()
  await prisma.tag.delete({ where: { id } })
  revalidatePath('/admin')
}

export async function addTag(name: string) {
  await verifyAuth()
  const safeName = sanitizeText(name)
  if (!safeName) return { success: false, error: 'Invalid tag name' }
  try {
    await prisma.tag.create({ data: { name: safeName } })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false, error: 'Tag might already exist' }
  }
}

export async function updateSettings(data: { primaryColor: string, secondaryColor: string, contactPhone: string, contactEmail: string, coordinatorName: string }) {
  await verifyAuth()  // <-- THIS WAS MISSING BEFORE — anyone could overwrite site settings

  const safeData = {
    primaryColor: sanitizeColor(data.primaryColor),
    secondaryColor: sanitizeColor(data.secondaryColor),
    contactPhone: sanitizeText(data.contactPhone).slice(0, 20),
    contactEmail: sanitizeText(data.contactEmail).slice(0, 100),
    coordinatorName: sanitizeText(data.coordinatorName).slice(0, 100),
  }

  await prisma.platformSettings.upsert({
    where: { id: 'default' },
    update: safeData,
    create: { id: 'default', ...safeData }
  })
  revalidatePath('/admin')
}

export async function bulkImportStudents(courseId: string, studentsData: any[], mode: 'append' | 'replace') {
  await verifyAuth()
  
  try {
    if (mode === 'replace') {
      await prisma.student.deleteMany({
        where: { courseId }
      })
    }

    for (const data of studentsData) {
      const allTags = await prisma.tag.findMany()
      const domainsLower = (data.domains || []).map((d: string) => d.toLowerCase())
      const matchedTags = allTags.filter(t => domainsLower.includes(t.name.toLowerCase()))

      await prisma.student.create({
        data: {
          name: sanitizeText(data.name) || 'Unknown',
          courseId,
          experience: data.experience ? sanitizeText(data.experience) : '',
          certifications: data.certifications ? sanitizeText(data.certifications) : '',
          achievements: data.achievements ? sanitizeText(data.achievements) : '',
          linkedinUrl: sanitizeUrl(data.linkedinUrl),
          resumeUrl: sanitizeUrl(data.resumeUrl),
          imageUrl: sanitizeUrl(data.photoUrl),
          tags: {
            connect: matchedTags.map(t => ({ id: t.id }))
          }
        }
      })
    }
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Failed to import students' }
  }
}

// ==========================================
// FACULTY MANAGEMENT
// ==========================================

export async function addFaculty(data: FormData) {
  await verifyAuth()
  try {
    const faculty = await prisma.faculty.create({
      data: {
        name: sanitizeText(data.get('name') as string) || 'Unknown',
        title: sanitizeText(data.get('title') as string) || 'Faculty',
        roleTier: Math.min(3, Math.max(1, parseInt(data.get('roleTier') as string, 10) || 3)),
        email: sanitizeText(data.get('email') as string) || null,
        linkedinUrl: sanitizeUrl(data.get('linkedinUrl') as string),
        imageUrl: sanitizeUrl(data.get('imageUrl') as string),
        bio: sanitizeText(data.get('bio') as string) || null,
        order: Math.min(999, Math.max(0, parseInt(data.get('order') as string, 10) || 0)),
      }
    })
    revalidatePath('/admin')
    revalidatePath('/faculty')
    return { success: true, faculty }
  } catch (err: any) {
    return { success: false, error: 'Failed to add faculty' }
  }
}

export async function updateFaculty(id: string, data: FormData) {
  await verifyAuth()
  try {
    const faculty = await prisma.faculty.update({
      where: { id },
      data: {
        name: sanitizeText(data.get('name') as string) || 'Unknown',
        title: sanitizeText(data.get('title') as string) || 'Faculty',
        roleTier: Math.min(3, Math.max(1, parseInt(data.get('roleTier') as string, 10) || 3)),
        email: sanitizeText(data.get('email') as string) || null,
        linkedinUrl: sanitizeUrl(data.get('linkedinUrl') as string),
        imageUrl: sanitizeUrl(data.get('imageUrl') as string),
        bio: sanitizeText(data.get('bio') as string) || null,
        order: Math.min(999, Math.max(0, parseInt(data.get('order') as string, 10) || 0)),
      }
    })
    revalidatePath('/admin')
    revalidatePath('/faculty')
    return { success: true, faculty }
  } catch (err: any) {
    return { success: false, error: 'Failed to update faculty' }
  }
}

export async function deleteFaculty(id: string) {
  await verifyAuth()
  try {
    await prisma.faculty.delete({ where: { id } })
    revalidatePath('/admin')
    revalidatePath('/faculty')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete faculty' }
  }
}

export async function deleteRecruiterVisit(id: string) {
  await verifyAuth()
  await prisma.recruiterVisit.delete({ where: { id } })
  revalidatePath('/admin')
}

export async function updateTag(id: string, name: string) {
  await verifyAuth()
  const safeName = sanitizeText(name)
  if (!safeName) return { success: false, error: 'Invalid name' }
  try {
    await prisma.tag.update({ where: { id }, data: { name: safeName } })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update or domain already exists' }
  }
}
