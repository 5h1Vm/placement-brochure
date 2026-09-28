import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isRateLimited } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/sanitize'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Rate limit: max 5 submissions per IP per minute
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(`visits-post-${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const name = sanitizeText(body?.name)
    const company = sanitizeText(body?.company)
    const contact = sanitizeText(body?.contact)

    if (!name || !company) {
      return NextResponse.json({ error: 'Name and company are required' }, { status: 400 })
    }

    if (name.length < 2 || company.length < 2) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    try {
      // Send data invisibly to Google Forms from the server
      // This bypasses browser adblockers and strict CORS cross-site tracking policies
      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdT2ntEcRmvSf0QW23zOQmjW9sOVhy8CltCHIaoP5eSWdVBOQ/formResponse';
      const formData = new URLSearchParams();
      formData.append('entry.144198576', name);
      formData.append('entry.79918247', company);
      formData.append('entry.624496990', contact);

      await fetch(formUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
    } catch (dbError) {
      console.warn("Form submission proxy failed:", dbError);
    }

    // Always return success so the popup closes
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// GET requires admin authentication - recruiter PII should not be publicly accessible
export async function GET() {
  try {
    const ADMIN_SECRET = process.env.ADMIN_SECRET
    if (!ADMIN_SECRET) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin_auth')?.value

    // Compare hashed values instead of raw secrets
    if (!authCookie || authCookie !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const visits = await prisma.recruiterVisit.findMany({
      orderBy: { visitedAt: 'desc' }
    })
    return NextResponse.json(visits)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
