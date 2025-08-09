import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const listing = await db.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        agent: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { favorites: true, leads: true } }
      }
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = session.user as any
  const { id } = await context.params

  try {
    // Check if listing exists and user has permission
    const existingListing = await db.listing.findUnique({
      where: { id },
      select: { agentId: true }
    })

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check ownership or admin role
    const isOwner = existingListing.agentId === user.id
    const isAdmin = user.role === 'admin'
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden - not listing owner' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, price, currency, location, type, status, images } = body

    // Update listing
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = Number(price)
    if (currency !== undefined) updateData.currency = currency
    if (location !== undefined) updateData.location = location
    if (type !== undefined) updateData.type = type
    if (status !== undefined) updateData.status = status

    const updatedListing = await db.listing.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        agent: { select: { id: true, name: true, email: true, image: true } }
      }
    })

    // Handle images update if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      await db.listingImage.deleteMany({ where: { listingId: id } })
      
      // Add new images
      if (images.length > 0) {
        await db.listingImage.createMany({
          data: images.map((url: string, idx: number) => ({
            listingId: id,
            url,
            sortOrder: idx
          }))
        })
      }

      // Fetch updated listing with new images
      const finalListing = await db.listing.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          agent: { select: { id: true, name: true, email: true, image: true } }
        }
      })

      return NextResponse.json({ listing: finalListing })
    }

    return NextResponse.json({ listing: updatedListing })
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = session.user as any
  const { id } = await context.params

  try {
    // Check if listing exists and user has permission
    const existingListing = await db.listing.findUnique({
      where: { id },
      select: { agentId: true, title: true }
    })

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check ownership or admin role
    const isOwner = existingListing.agentId === user.id
    const isAdmin = user.role === 'admin'
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden - not listing owner' }, { status: 403 })
    }

    // Delete listing (cascade will handle related records)
    await db.listing.delete({ where: { id } })

    return NextResponse.json({ 
      message: 'Listing deleted successfully',
      deletedListing: { id, title: existingListing.title }
    })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
