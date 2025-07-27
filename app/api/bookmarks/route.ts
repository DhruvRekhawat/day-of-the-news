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
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: articleId
        }
      }
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: 'Article already bookmarked' },
        { status: 409 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        articleId: articleId
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
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Find and delete bookmark
    const deletedBookmark = await prisma.bookmark.deleteMany({
      where: {
        userId: session.user.id,
        articleId: articleId
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
    const articleId = searchParams.get('articleId');

    if (articleId) {
      // Check if specific article is bookmarked
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_articleId: {
            userId: session.user.id,
            articleId: articleId
          }
        }
      });

      return NextResponse.json({
        isBookmarked: !!bookmark
      });
    }

    // Get all user's bookmarks
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            excerpt: true,
            source: true,
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
        article: bookmark.article
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