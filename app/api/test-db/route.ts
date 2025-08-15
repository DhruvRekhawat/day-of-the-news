import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("[TEST-DB] Checking database contents...")
    
    // Get counts
    const eventCount = await prisma.event.count()
    const articleCount = await prisma.article.count()
    const eventArticleCount = await prisma.eventArticle.count()
    
    // Get sample events by topic
    const eventsByTopic = await prisma.event.groupBy({
      by: ['topic'],
      _count: {
        topic: true
      }
    })
    
    // Get a few sample events
    const sampleEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { publishedAt: 'desc' },
      include: {
        articles: {
          include: {
            article: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      message: "Database contents",
      counts: {
        events: eventCount,
        articles: articleCount,
        eventArticles: eventArticleCount
      },
      eventsByTopic,
      sampleEvents: sampleEvents.map(e => ({
        id: e.id,
        title: e.title,
        topic: e.topic,
        isTrending: e.isTrending,
        articleCount: e.articles.length
      }))
    })
  } catch (error) {
    console.error("[TEST-DB] Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
