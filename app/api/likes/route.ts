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

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: articleId
        }
      }
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'Article already liked' },
        { status: 409 }
      );
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        articleId: articleId
      }
    });

    // Get total likes count for this article
    const totalLikes = await prisma.like.count({
      where: { articleId: articleId }
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
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Find and delete like
    const deletedLike = await prisma.like.deleteMany({
      where: {
        userId: session.user.id,
        articleId: articleId
      }
    });

    if (deletedLike.count === 0) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }

    // Get updated total likes count for this article
    const totalLikes = await prisma.like.count({
      where: { articleId: articleId }
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
    const articleId = searchParams.get('articleId');

    if (articleId) {
      // Check if specific article is liked and get total likes
      const [userLike, totalLikes] = await Promise.all([
        prisma.like.findUnique({
          where: {
            userId_articleId: {
              userId: session.user.id,
              articleId: articleId
            }
          }
        }),
        prisma.like.count({
          where: { articleId: articleId }
        })
      ]);

      return NextResponse.json({
        isLiked: !!userLike,
        totalLikes
      });
    }

    // Get all user's likes
    const likes = await prisma.like.findMany({
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
      likes: likes.map(like => ({
        id: like.id,
        createdAt: like.createdAt,
        article: like.article
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