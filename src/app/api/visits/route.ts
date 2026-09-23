import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, company, contact } = await request.json()

    if (!name || !company) {
      return NextResponse.json({ error: 'Name and company are required' }, { status: 400 })
    }

    const visit = await prisma.recruiterVisit.create({
      data: { name, company, contact }
    })

    return NextResponse.json(visit, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const visits = await prisma.recruiterVisit.findMany({
      orderBy: { visitedAt: 'desc' }
    })
    return NextResponse.json(visits)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
