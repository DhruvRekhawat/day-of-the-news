import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { NewsApiClient } from "@/lib/fetch-news"

const newsClient = new NewsApiClient({
  apiKey: process.env.EVENTREGISTRY_API_KEY!,
})

export async function POST() {
  try {
    console.log("[CRON] Starting article update...")

    const topics = [
      { name: "india", fetcher: () => newsClient.fetchIndianHeadlines() },
      { name: "politics", fetcher: () => newsClient.fetchArticlesByTopic("politics") },
      { name: "sports", fetcher: () => newsClient.fetchArticlesByTopic("sports") },
      { name: "business", fetcher: () => newsClient.fetchArticlesByTopic("business") },
      { name: "global-conflicts", fetcher: () => newsClient.fetchGlobalConflicts() },
    ]

    // Fetch & store articles by topic
    for (const { name, fetcher } of topics) {
      console.log(`[CRON] Fetching topic: ${name}`)
      const articles = await fetcher()

      for (const article of articles) {
        await prisma.article.upsert({
          where: { id: article.id },
          update: { ...article, topic: name, isTrending: false },
          create: { ...article, topic: name, isTrending: false },
        })
      }
    }

    // Fetch & store trending
    console.log("[CRON] Fetching trending articles...")
    const trendingArticles = await newsClient.fetchTrendingArticles()
    for (const article of trendingArticles) {
      await prisma.article.upsert({
        where: { id: article.id },
        update: { ...article, topic: null, isTrending: true },
        create: { ...article, topic: null, isTrending: true },
      })
    }

    // Delete month-old articles
    // console.log("[CRON] Deleting old articles...")
    // const deleted = await prisma.article.deleteMany({
    //   where: {
    //     publishedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    //   },
    // })
    // console.log(`[CRON] Deleted ${deleted.count} old articles.`)

    return NextResponse.json({
      success: true,
      message: "Articles updated successfully",
    })
  } catch (error) {
    console.error("[CRON] Error:", error)
    return new NextResponse("Error updating articles", { status: 500 })
  }
}
