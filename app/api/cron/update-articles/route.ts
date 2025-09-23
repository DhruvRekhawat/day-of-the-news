import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { NewsApiClient } from "@/lib/fetch-news"

const newsClient = new NewsApiClient({
  apiKey: process.env.EVENTREGISTRY_API_KEY!,
})

export async function POST() {
  try {
    console.log("[CRON] Starting events update...")
    console.log("[CRON] API Key present:", !!process.env.EVENTREGISTRY_API_KEY)

    // Fetch all topics for homepage sections
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
      console.log(`[CRON] Received ${eventsWithArticles.length} events for topic: ${name}`)

             for (const { event, articles } of eventsWithArticles) {
         console.log(`[CRON] Processing event: ${event.title} with ${articles.length} articles`)
         console.log(`[CRON] Event data:`, JSON.stringify(event, null, 2))
         
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
           console.log(`[CRON] Event stored/updated: ${dbEvent.id}`)
         } catch (error) {
           console.error(`[CRON] Error storing event:`, error)
           console.error(`[CRON] Event data that failed:`, event)
           continue // Skip this event and continue with others
         }

         // Create or update articles and link them to the event
         for (const article of articles) {
           const dbArticle = await prisma.article.upsert({
             where: { id: article.id },
             update: { ...article, topic: name, isTrending: false },
             create: { ...article, topic: name, isTrending: false },
           })
           console.log(`[CRON] Article stored/updated: ${dbArticle.id}`)

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
           console.log(`[CRON] Linked article ${dbArticle.id} to event ${dbEvent.id}`)
         }
      }
    }

    // Fetch trending events for homepage featured/sidebar sections
    console.log("[CRON] Fetching trending events...")
    try {
      const trendingEventsWithArticles = await newsClient.fetchTrendingEvents()
      console.log(`[CRON] Received ${trendingEventsWithArticles.length} trending events`)
      
      for (const { event, articles } of trendingEventsWithArticles) {
        console.log(`[CRON] Processing trending event: ${event.title} with ${articles.length} articles`)
        
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
          console.log(`[CRON] Trending event stored/updated: ${dbEvent.id}`)
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
          console.log(`[CRON] Trending article stored/updated: ${dbArticle.id}`)

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
          console.log(`[CRON] Linked trending article ${dbArticle.id} to event ${dbEvent.id}`)
        }
      }
    } catch (error) {
      console.error("[CRON] Error fetching trending events:", error)
      console.log("[CRON] Continuing with other topics...")
    }


    // Get final counts
    const eventCount = await prisma.event.count()
    const articleCount = await prisma.article.count()
    const eventArticleCount = await prisma.eventArticle.count()
    
    console.log(`[CRON] Final database state: ${eventCount} events, ${articleCount} articles, ${eventArticleCount} event-article links`)

    return NextResponse.json({
      success: true,
      message: "Events and articles updated successfully",
      stats: {
        events: eventCount,
        articles: articleCount,
        eventArticles: eventArticleCount
      }
    })
  } catch (error) {
    console.error("[CRON] Error:", error)
    return new NextResponse("Error updating events and articles", { status: 500 })
  }
}
