import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const conversations = await db.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
          leftAt: null
        }
      }
    },
    include: {
      participants: {
        where: { leftAt: null },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } }
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: { select: { id: true, name: true, email: true } }
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json({ conversations })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const body = await req.json()
  const { otherUserId, title, isGroup = false } = body || {}

  if (!isGroup && !otherUserId) {
    return NextResponse.json({ error: 'Missing otherUserId for direct conversation' }, { status: 400 })
  }

  if (isGroup && (!title || !Array.isArray(body.participantIds))) {
    return NextResponse.json({ error: 'Missing title or participantIds for group conversation' }, { status: 400 })
  }

  // For direct conversations, check if one already exists
  if (!isGroup && otherUserId) {
    const existing = await db.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: userId, leftAt: null } } },
          { participants: { some: { userId: otherUserId, leftAt: null } } }
        ]
      }
    })

    if (existing) {
      return NextResponse.json({ conversation: existing })
    }
  }

  // Create new conversation
  const conversation = await db.conversation.create({
    data: {
      title,
      isGroup,
      participants: {
        create: isGroup 
          ? [
              { userId, role: 'admin' },
              ...body.participantIds.map((id: string) => ({ userId: id, role: 'member' }))
            ]
          : [
              { userId, role: 'member' },
              { userId: otherUserId, role: 'member' }
            ]
      }
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } }
        }
      }
    }
  })

  return NextResponse.json({ conversation }, { status: 201 })
}

