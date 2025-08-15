import { NextResponse } from "next/server"
import { NewsApiClient } from "@/lib/fetch-news"

const newsClient = new NewsApiClient({
  apiKey: process.env.EVENTREGISTRY_API_KEY!,
})

export async function GET() {
  try {
    console.log("[TEST] Testing events fetching...")
    
    // Test fetching events
    const params = new URLSearchParams({
      keyword: "politics",
      eventsSortBy: "rel",
      eventsCount: "3",
    })
    
    const events = await newsClient.fetchEvents(params)
    
    return NextResponse.json({
      success: true,
      eventsCount: events.length,
      events: events.map(e => ({
        event: e.event,
        articleCount: e.articles.length,
        firstArticle: e.articles[0] ? {
          id: e.articles[0].id,
          title: e.articles[0].title,
          source: e.articles[0].source
        } : null
      }))
    })
  } catch (error) {
    console.error("[TEST] Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
