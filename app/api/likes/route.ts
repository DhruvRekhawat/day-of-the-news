import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if like already exists
    const existingLike = await prisma.eventLike.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId
        }
      }
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'Event already liked' },
        { status: 409 }
      );
    }

    // Create like
    const like = await prisma.eventLike.create({
      data: {
        userId: session.user.id,
        eventId: eventId
      }
    });

    // Get total likes count for this event
    const totalLikes = await prisma.eventLike.count({
      where: { eventId: eventId }
    });

    return NextResponse.json({
      success: true,
      like: {
        id: like.id,
        createdAt: like.createdAt
      },
      totalLikes
    });

  } catch (error) {
    console.error('Error creating like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Find and delete like
    const deletedLike = await prisma.eventLike.deleteMany({
      where: {
        userId: session.user.id,
        eventId: eventId
      }
    });

    if (deletedLike.count === 0) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }

    // Get updated total likes count for this event
    const totalLikes = await prisma.eventLike.count({
      where: { eventId: eventId }
    });

    return NextResponse.json({
      success: true,
      message: 'Like removed successfully',
      totalLikes
    });

  } catch (error) {
    console.error('Error deleting like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (eventId) {
      // Check if specific event is liked and get total likes
      const [userLike, totalLikes] = await Promise.all([
        prisma.eventLike.findUnique({
          where: {
            userId_eventId: {
              userId: session.user.id,
              eventId: eventId
            }
          }
        }),
        prisma.eventLike.count({
          where: { eventId: eventId }
        })
      ]);

      return NextResponse.json({
        isLiked: !!userLike,
        totalLikes
      });
    }

    // Get all user's likes
    const likes = await prisma.eventLike.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            summary: true,
            topic: true,
            publishedAt: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      likes: likes.map(like => ({
        id: like.id,
        createdAt: like.createdAt,
        event: like.event
      }))
    });

  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}