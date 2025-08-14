import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic")
    const trending = searchParams.get("trending") === "true"
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Build the where clause
    const where: any = {}
    
    if (topic) {
      where.topic = topic
    }
    
    if (trending) {
      where.isTrending = true
    }

    // Fetch events with their articles
    const events = await prisma.event.findMany({
      where,
      include: {
        articles: {
          include: {
            article: {
              include: {
                _count: {
                  select: {
                    interactions: true,
                    Bookmark: true,
                    Like: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    // Transform the data to a more frontend-friendly format
    const transformedEvents = events.map((event) => ({
      id: event.id,
      eventUri: event.eventUri,
      title: event.title,
      category: event.category,
      topic: event.topic,
      isTrending: event.isTrending,
      summary: event.summary,
      image: event.image,
      publishedAt: event.publishedAt,
      articles: event.articles.map((ea) => ({
        ...ea.article,
        interactionCount: ea.article._count.interactions,
        bookmarkCount: ea.article._count.Bookmark,
        likeCount: ea.article._count.Like,
        _count: undefined, // Remove the _count object
      })),
    }))

    return NextResponse.json({
      success: true,
      events: transformedEvents,
      total: events.length,
    })
  } catch (error) {
    console.error("[API] Error fetching events:", error)
    return new NextResponse("Error fetching events", { status: 500 })
  }
}
