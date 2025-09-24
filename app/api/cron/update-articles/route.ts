import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { NewsApiClient } from "@/lib/fetch-news"

const newsClient = new NewsApiClient({
  apiKey: process.env.EVENTREGISTRY_API_KEY!,
})

// Shared function for the update logic
async function updateEventsAndArticles() {
  console.log("[CRON] Starting events update...")

  // Fetch all topics for homepage sections
  const topics = [
    { name: "india", fetcher: () => newsClient.fetchIndianEvents() },
    { name: "politics", fetcher: () => newsClient.fetchEventsByTopic("politics") },
    { name: "sports", fetcher: () => newsClient.fetchEventsByTopic("sports") },
    { name: "business", fetcher: () => newsClient.fetchEventsByTopic("business") },
    { name: "global-conflicts", fetcher: () => newsClient.fetchGlobalConflictEvents() },
  ]

  let totalEvents = 0;
  const categoryStats: { [key: string]: number } = {};

  // Fetch & store events by topic
  for (const { name, fetcher } of topics) {
    const eventsWithArticles = await fetcher()
    categoryStats[name] = eventsWithArticles.length;
    totalEvents += eventsWithArticles.length;

    for (const { event, articles } of eventsWithArticles) {
      let dbEvent;
      try {
        // Create or update the event
        dbEvent = await prisma.event.upsert({
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
      } catch (error) {
        console.error(`[CRON] Error storing event:`, error)
        continue // Skip this event and continue with others
      }

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

  // Fetch trending events for homepage featured/sidebar sections
  try {
    const trendingEventsWithArticles = await newsClient.fetchTrendingEvents()
    categoryStats["trending"] = trendingEventsWithArticles.length;
    totalEvents += trendingEventsWithArticles.length;
    
    for (const { event, articles } of trendingEventsWithArticles) {
      let dbEvent;
      try {
        // Create or update the trending event
        dbEvent = await prisma.event.upsert({
          where: { eventUri: event.eventUri },
          update: { 
            ...event, 
            topic: "trending", 
            isTrending: true 
          },
          create: { 
            ...event, 
            topic: "trending", 
            isTrending: true 
          },
        })
      } catch (error) {
        console.error(`[CRON] Error storing trending event:`, error)
        continue
      }

      // Create or update articles and link them to the trending event
      for (const article of articles) {
        const dbArticle = await prisma.article.upsert({
          where: { id: article.id },
          update: { ...article, topic: "trending", isTrending: true },
          create: { ...article, topic: "trending", isTrending: true },
        })

        // Link article to trending event
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
  } catch (error) {
    console.error("[CRON] Error fetching trending events:", error)
  }

  // Get final counts
  const eventCount = await prisma.event.count()
  const articleCount = await prisma.article.count()
  const eventArticleCount = await prisma.eventArticle.count()
  
  // Log summary
  console.log(`[CRON] Events fetched by category:`)
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} events`)
  })
  console.log(`[CRON] Total events fetched: ${totalEvents}`)
  console.log(`[CRON] Final database state: ${eventCount} events, ${articleCount} articles, ${eventArticleCount} event-article links`)

  return {
    success: true,
    message: "Events and articles updated successfully",
    stats: {
      events: eventCount,
      articles: articleCount,
      eventArticles: eventArticleCount,
      categoryStats,
      totalFetched: totalEvents
    }
  }
}

// GET handler for Vercel cron jobs
export async function GET() {
  try {
    const result = await updateEventsAndArticles()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[CRON] Error:", error)
    return new NextResponse("Error updating events and articles", { status: 500 })
  }
}

// POST handler for manual triggers
export async function POST() {
  try {
    const result = await updateEventsAndArticles()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[CRON] Error:", error)
    return new NextResponse("Error updating events and articles", { status: 500 })
  }
}
