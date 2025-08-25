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

    // Check if bookmark already exists
    const existingBookmark = await prisma.eventBookmark.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId
        }
      }
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: 'Event already bookmarked' },
        { status: 409 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.eventBookmark.create({
      data: {
        userId: session.user.id,
        eventId: eventId
      }
    });

    return NextResponse.json({
      success: true,
      bookmark: {
        id: bookmark.id,
        createdAt: bookmark.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating bookmark:', error);
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

    // Find and delete bookmark
    const deletedBookmark = await prisma.eventBookmark.deleteMany({
      where: {
        userId: session.user.id,
        eventId: eventId
      }
    });

    if (deletedBookmark.count === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed successfully'
    });

  } catch (error) {
    console.error('Error deleting bookmark:', error);
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
      // Check if specific event is bookmarked
      const bookmark = await prisma.eventBookmark.findUnique({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: eventId
          }
        }
      });

      return NextResponse.json({
        isBookmarked: !!bookmark
      });
    }

    // Get all user's bookmarks
    const bookmarks = await prisma.eventBookmark.findMany({
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
      bookmarks: bookmarks.map(bookmark => ({
        id: bookmark.id,
        createdAt: bookmark.createdAt,
        event: bookmark.event
      }))
    });

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}