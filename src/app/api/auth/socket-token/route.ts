import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import jwt from 'jsonwebtoken'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      console.error('NEXTAUTH_SECRET not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Create JWT token for Socket.IO authentication
    const payload = {
      sub: (session.user as any).id,
      userId: (session.user as any).id,
      name: session.user.name,
      email: session.user.email,
      role: (session.user as any).role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }

    const token = jwt.sign(payload, secret)

    return NextResponse.json({ token })

  } catch (error) {
    console.error('Error generating socket token:', error)
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}
