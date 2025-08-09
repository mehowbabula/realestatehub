'use client'

import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AuthSection() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    return (
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <span className="text-lg text-gray-600">Welcome back, {session.user?.name}!</span>
        <Button onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <Button onClick={() => signIn()} variant="outline" size="lg">
        Sign In
      </Button>
      <Button onClick={() => router.push('/register')} size="lg">
        Get Started Free
      </Button>
    </div>
  )
}
