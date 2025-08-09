import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const error = searchParams.get('error') || 'Unknown'
  return NextResponse.json({ error }, { status: 400 })
}

