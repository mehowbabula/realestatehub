import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const body = await req.json()
  const { conversationId, content } = body || {}
  if (!conversationId || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Ensure sender is a participant in the conversation
  const participant = await db.conversationParticipant.findFirst({
    where: {
      conversationId,
      userId,
      leftAt: null
    }
  })

  if (!participant) {
    return NextResponse.json({ error: 'Forbidden: Not a participant in this conversation' }, { status: 403 })
  }

  const message = await db.message.create({
    data: { conversationId, senderId: userId, content },
    include: {
      sender: { select: { id: true, name: true, email: true, image: true } }
    }
  })

  // Update conversation timestamp
  await db.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() }
  })

  return NextResponse.json({ message }, { status: 201 })
}

