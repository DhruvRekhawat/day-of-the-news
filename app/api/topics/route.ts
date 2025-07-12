// app/api/topics/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// GET followed topics for the current user
export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const followed = await prisma.followedTopic.findMany({
    where: { userId: session.user.id },
    include: { topic: true },
  });

  return NextResponse.json(followed.map((f) => f.topic));
}

// POST to follow a new topic
export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
});
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { topicSlug } = await request.json();
  if (!topicSlug) {
    return new NextResponse('Topic slug is required', { status: 400 });
  }

  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
  if (!topic) {
    return new NextResponse('Topic not found', { status: 404 });
  }

  try {
    await prisma.followedTopic.create({
      data: {
        userId: session.user.id,
        topicId: topic.id,
      },
    });
    return NextResponse.json({ success: true, message: `Followed ${topic.name}` });
  } catch (error) {
    return new NextResponse(`Could not follow topic ${error}`, { status: 500 });
  }
}

// DELETE to unfollow a topic
export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
});
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const topicSlug = searchParams.get('slug');
  if (!topicSlug) {
    return new NextResponse('Topic slug is required', { status: 400 });
  }

  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
  if (!topic) {
    return new NextResponse('Topic not found', { status: 404 });
  }

  try {
    await prisma.followedTopic.delete({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId: topic.id,
        },
      },
    });
    return NextResponse.json({ success: true, message: `Unfollowed ${topic.name}` });
  } catch (error) {
    return new NextResponse(`Could not unfollow topic ${error}`, { status: 500 });
  }
}