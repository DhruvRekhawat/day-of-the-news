// app/api/cron/update-articles/route.ts

import { NextResponse } from 'next/server'
import { NewsApiClient } from '@/lib/fetch-news'
import { prisma } from '@/lib/prisma'

const newsClient = new NewsApiClient({ apiKey: process.env.EVENTREGISTRY_API_KEY! })

export async function POST() {
  try {
    // 1. Fetch latest articles for each topic
    const [latestNews, trendingNews, politicsNews, globalConflicts, businessNews, sportsNews] =
      await Promise.all([
        newsClient.fetchArticlesByTopic('india'),
        newsClient.fetchTrendingArticles(), // You'd need to implement this in NewsApiClient
        newsClient.fetchArticlesByTopic('politics'),
        newsClient.fetchArticlesByTopic('global-conflicts'),
        newsClient.fetchArticlesByTopic('business'),
        newsClient.fetchArticlesByTopic('sports'),
      ])

    const allArticles = [
      ...latestNews,
      ...trendingNews,
      ...politicsNews,
      ...globalConflicts,
      ...businessNews,
      ...sportsNews,
    ]

    // 2. Upsert articles
    for (const article of allArticles) {
      await prisma.article.upsert({
        where: { id: article.id },
        update: {
          title: article.title,
          url: article.url,
          image: article.image,
          source: article.source,
          publishedAt: article.publishedAt,
          aiSummary: article.excerpt,
          topic: article.topic,
          originalUri: article.url,
          content: article.excerpt || '',
          excerpt: article.excerpt || '',
          category: article.topic || 'general',
        },
        create: {
          id: article.id,
          title: article.title,
          url: article.url,
          image: article.imageUrl,
          source: article.source,
          publishedAt: article.publishedAt,
          aiSummary: article.excerpt,
          topic: article.topic,
          originalUri: article.url,
          content: article.excerpt || '',
          excerpt: article.excerpt || '',
          category: article.topic || 'general',
        },
      })
    }

    // 3. Delete old articles (older than 1 month)
    const cutoffDate = new Date()
    cutoffDate.setMonth(cutoffDate.getMonth() - 1)

    const deleted = await prisma.article.deleteMany({
      where: { publishedAt: { lt: cutoffDate } },
    })

    return NextResponse.json({
      success: true,
      message: `Articles updated. Deleted ${deleted.count} old articles.`,
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    return new NextResponse('Error updating articles', { status: 500 })
  }
}
