import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET() {
  const listings = await db.listing.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json({ listings })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = session.user as any
  if (!['agent', 'admin'].includes(user.role || 'user')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { title, description, price, currency = 'USD', location, type, images = [], status } = body || {}
  if (!title || !price || !location || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const created = await db.listing.create({
    data: {
      agentId: user.id,
      title,
      description,
      price: Number(price),
      currency,
      location,
      type,
      status: status || undefined,
      images: { createMany: { data: images.map((url: string, idx: number) => ({ url, sortOrder: idx })) } },
    },
    include: { images: true },
  })

  return NextResponse.json({ listing: created }, { status: 201 })
}

