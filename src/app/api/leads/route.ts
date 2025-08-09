import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = session.user as any

  const body = await req.json()
  const { agentId, listingId, message } = body || {}
  if (!agentId || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const lead = await db.lead.create({
    data: {
      userId: user.id,
      agentId,
      listingId: listingId || null,
      message,
    },
  })
  return NextResponse.json({ lead }, { status: 201 })
}

