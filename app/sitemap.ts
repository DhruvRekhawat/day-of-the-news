import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dayofthenews.com'

  // Get all events
  const events = await prisma.event.findMany({
    select: {
      id: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  // Get all articles
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  // Get unique categories
  const categories = await prisma.event.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  })

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Event pages
  const eventPages = events.map((event) => ({
    url: `${baseUrl}/event/${event.id}`,
    lastModified: event.updatedAt || event.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/article/${article.id}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Category pages
  const categoryPages = categories
    .filter((cat) => cat.category) // Filter out null/undefined categories
    .map((cat) => ({
      url: `${baseUrl}/category/${encodeURIComponent(cat.category!)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

  return [
    ...staticPages,
    ...eventPages,
    ...articlePages,
    ...categoryPages,
  ]
}
