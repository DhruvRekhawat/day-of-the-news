import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { NewsApiClient } from "@/lib/fetch-news"

const newsClient = new NewsApiClient({
  apiKey: process.env.EVENTREGISTRY_API_KEY!,
})

export async function POST() {
  try {
    console.log("[CRON] Starting events update...")

    const topics = [
      { name: "india", fetcher: () => newsClient.fetchIndianEvents() },
      { name: "politics", fetcher: () => newsClient.fetchEventsByTopic("politics") },
      { name: "sports", fetcher: () => newsClient.fetchEventsByTopic("sports") },
      { name: "business", fetcher: () => newsClient.fetchEventsByTopic("business") },
      { name: "global-conflicts", fetcher: () => newsClient.fetchGlobalConflictEvents() },
    ]

    // Fetch & store events by topic
    for (const { name, fetcher } of topics) {
      console.log(`[CRON] Fetching topic: ${name}`)
      const eventsWithArticles = await fetcher()

      for (const { event, articles } of eventsWithArticles) {
        // Create or update the event
        const dbEvent = await prisma.event.upsert({
          where: { eventUri: event.eventUri },
          update: { 
            ...event, 
            topic: name, 
            isTrending: false 
          },
          create: { 
            ...event, 
            topic: name, 
            isTrending: false 
          },
        })

        // Create or update articles and link them to the event
        for (const article of articles) {
          const dbArticle = await prisma.article.upsert({
            where: { id: article.id },
            update: { ...article, topic: name, isTrending: false },
            create: { ...article, topic: name, isTrending: false },
          })

          // Link article to event
          await prisma.eventArticle.upsert({
            where: {
              eventId_articleId: {
                eventId: dbEvent.id,
                articleId: dbArticle.id,
              },
            },
            update: {},
            create: {
              eventId: dbEvent.id,
              articleId: dbArticle.id,
            },
          })
        }
      }
    }

    // Fetch & store trending events
    console.log("[CRON] Fetching trending events...")
    const trendingEventsWithArticles = await newsClient.fetchTrendingEvents()
    
    for (const { event, articles } of trendingEventsWithArticles) {
      // Create or update the event
      const dbEvent = await prisma.event.upsert({
        where: { eventUri: event.eventUri },
        update: { 
          ...event, 
          topic: null, 
          isTrending: true 
        },
        create: { 
          ...event, 
          topic: null, 
          isTrending: true 
        },
      })

      // Create or update articles and link them to the event
      for (const article of articles) {
        const dbArticle = await prisma.article.upsert({
          where: { id: article.id },
          update: { ...article, topic: null, isTrending: true },
          create: { ...article, topic: null, isTrending: true },
        })

        // Link article to event
        await prisma.eventArticle.upsert({
          where: {
            eventId_articleId: {
              eventId: dbEvent.id,
              articleId: dbArticle.id,
            },
          },
          update: {},
          create: {
            eventId: dbEvent.id,
            articleId: dbArticle.id,
          },
        })
      }
    }

    // Delete month-old events and articles
    console.log("[CRON] Cleaning up old events and articles...")
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Delete old events (this will cascade to EventArticle and Article relations)
    const deletedEvents = await prisma.event.deleteMany({
      where: {
        publishedAt: { lt: thirtyDaysAgo },
      },
    })
    
    // Also delete orphaned articles (not linked to any events)
    const deletedOrphanedArticles = await prisma.article.deleteMany({
      where: {
        publishedAt: { lt: thirtyDaysAgo },
        events: { none: {} },
      },
    })
    
    console.log(`[CRON] Deleted ${deletedEvents.count} old events and ${deletedOrphanedArticles.count} orphaned articles.`)

    return NextResponse.json({
      success: true,
      message: "Events and articles updated successfully",
    })
  } catch (error) {
    console.error("[CRON] Error:", error)
    return new NextResponse("Error updating events and articles", { status: 500 })
  }
}
