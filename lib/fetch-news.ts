import base64url from "base64url"

interface EventRegistryConfig {
  apiKey: string
  baseUrl: string
}

interface EventRegistrySource {
  uri: string
  title: string
  dataType: string
}

interface EventRegistryArticle {
  uri: string
  title: string
  body: string
  date: string
  time: string
  dateTime: string
  source: EventRegistrySource
  image?: string
  sentiment?: number
  location?: string
  categories?: Array<{ uri: string; label: string }>
  concepts?: Array<{ uri: string; label: string; score: number }>
  lang: string
  isDuplicate: boolean
  url: string
}

interface EventRegistryResponse {
  articles: {
    results: EventRegistryArticle[]
    totalResults: number
    page: number
    count: number
  }
}

const articlesCache: Map<string, any> = new Map()

export class NewsAPIClient {
  constructor(private config: EventRegistryConfig) {}

  async getArticles(params: {
    keyword?: string
    conceptUri?: string
    categoryUri?: string
    sourceLocationUri?: string
    lang?: string
    articlesCount?: number
    sortBy?: "date" | "rel" | "sourceImportance"
    dateStart?: string
    dateEnd?: string
  }): Promise<EventRegistryResponse> {
    const url = new URL("/api/v1/article/getArticles", this.config.baseUrl)
    url.searchParams.append("apiKey", this.config.apiKey)
    url.searchParams.append("resultType", "articles")
    url.searchParams.append("articlesCount", (params.articlesCount || 50).toString())
    url.searchParams.append("lang", params.lang || "eng")

    if (params.keyword) url.searchParams.append("keyword", params.keyword)
    if (params.conceptUri) url.searchParams.append("conceptUri", params.conceptUri)
    if (params.categoryUri) url.searchParams.append("categoryUri", params.categoryUri)
    if (params.sourceLocationUri) url.searchParams.append("sourceLocationUri", params.sourceLocationUri)
    if (params.sortBy) url.searchParams.append("sortBy", params.sortBy)
    if (params.dateStart) url.searchParams.append("dateStart", params.dateStart)
    if (params.dateEnd) url.searchParams.append("dateEnd", params.dateEnd)

    try {
      console.log("Fetching from EventRegistry:", url.toString().replace(this.config.apiKey, "***"))
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 300 },
      })
      if (!response.ok) throw new Error(`EventRegistry API error: ${response.status} ${response.statusText}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching from EventRegistry:", error)
      throw error
    }
  }

  normalizeArticle(article: EventRegistryArticle) {
      const getImageUrl = (article: EventRegistryArticle) => article.image || "/placeholder.png"

    const calculateBias = (article: EventRegistryArticle): "left" | "center" | "right" => {
      if (article.sentiment !== undefined) {
        if (article.sentiment < -0.1) return "left"
        if (article.sentiment > 0.1) return "right"
        return "center"
      }

      const sourceTitle = article.source.title.toLowerCase()
      if (sourceTitle.includes("cnn") || sourceTitle.includes("guardian") || sourceTitle.includes("huffpost"))
        return "left"
      if (sourceTitle.includes("fox") || sourceTitle.includes("breitbart") || sourceTitle.includes("newsmax"))
        return "right"
      return "center"
    }

    const generateBiasScores = (bias: "left" | "center" | "right") => {
      const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
      switch (bias) {
        case "left":
          return { left: rand(15, 25), center: rand(5, 12), right: rand(2, 6) }
        case "right":
          return { left: rand(2, 6), center: rand(5, 12), right: rand(15, 25) }
        default:
          return { left: rand(5, 12), center: rand(10, 20), right: rand(5, 12) }
      }
    }

    const bias = calculateBias(article)
    const id = base64url.encode(article.uri)

    const normalized = {
      id,
      originalUri: article.uri,
      title: article.title,
      content: article.body,
      image: getImageUrl(article),
      timestamp: this.formatTimestamp(article.dateTime),
      bias,
      biasScores: generateBiasScores(bias),
      category: article.categories?.[0]?.label || "General",
      excerpt: article.body?.substring(0, 150) + "..." || "",
      source: article.source.title,
      url: article.url,
    }

    articlesCache.set(id, normalized)
    return normalized
  }

  private formatTimestamp(dateTime: string): string {
    try {
      const date = new Date(dateTime)
      const now = new Date()
      const hoursDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      if (hoursDiff < 1) return "Just now"
      if (hoursDiff < 24) return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`
      const daysDiff = Math.floor(hoursDiff / 24)
      if (daysDiff === 1) return "1 day ago"
      if (daysDiff < 7) return `${daysDiff} days ago`
      return date.toLocaleDateString()
    } catch {
      return "Recently"
    }
  }
}

export async function fetchArticleById(articleId: string) {
  console.log("=== DEBUGGING ARTICLE FETCH ===")
  console.log("Requested article ID:", articleId)
  console.log("Cache size:", articlesCache.size)

  if (articlesCache.has(articleId)) {
    console.log("✅ Found article in cache")
    return articlesCache.get(articleId)
  }

  const apiKey = process.env.EVENTREGISTRY_API_KEY
  if (!apiKey) {
    console.error("EVENTREGISTRY_API_KEY not set")
    return getMockArticle(articleId, "Missing API key")
  }

  const client = new NewsAPIClient({ apiKey, baseUrl: "https://eventregistry.org" })

  try {
    const response = await client.getArticles({ sortBy: "date", articlesCount: 50 })
    const normalized = response.articles.results.map((a) => client.normalizeArticle(a))

    if (articlesCache.has(articleId)) {
      return articlesCache.get(articleId)
    }

    if (normalized.length > 0) {
      const fallback = normalized[0]
      fallback.id = articleId
      articlesCache.set(articleId, fallback)
      return fallback
    }

    return getMockArticle(articleId, "No articles found")
  } catch (error) {
    console.error("Error fetching article:", error)
    return getMockArticle(articleId, "API error")
  }
}

export async function fetchRelatedArticles(articleId: string, limit = 6) {
  const apiKey = process.env.EVENTREGISTRY_API_KEY

  if (!apiKey) {
    console.error("EVENTREGISTRY_API_KEY environment variable is not set")
    return []
  }

  const client = new NewsAPIClient({
    apiKey,
    baseUrl: "https://eventregistry.org",
  })

  try {
    // Fetch recent articles as potential related ones
    const response = await client.getArticles({
      sortBy: "date",
      articlesCount: limit + 5, // extra to exclude current
    })

    return response.articles.results
      .map((article) => client.normalizeArticle(article))
      .filter((article) => article.id !== articleId)
      .slice(0, limit)
  } catch (error) {
    console.error("Error fetching related articles:", error)
    return []
  }
}


export async function fetchNewsData() {
  const apiKey = process.env.EVENTREGISTRY_API_KEY

  if (!apiKey) {
    console.error("EVENTREGISTRY_API_KEY environment variable is not set")
    return getEmptyNewsData()
  }

  const client = new NewsAPIClient({
    apiKey,
    baseUrl: "https://eventregistry.org",
  })

  try {
    console.log("Starting to fetch news data from EventRegistry...")

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateStart = yesterday.toISOString().split("T")[0]
    const dateEnd = today.toISOString().split("T")[0]

    const [
      recentNewsResponse,
      politicsNewsResponse,
      businessNewsResponse,
      sportsNewsResponse,
      usNewsResponse,
      conflictNewsResponse,
    ] = await Promise.allSettled([
      client.getArticles({
        sortBy: "date",
        articlesCount: 15,
        dateStart,
        dateEnd,
      }),
      client.getArticles({
        keyword: "politics OR election OR government OR congress OR senate",
        articlesCount: 8,
        sortBy: "rel",
      }),
      client.getArticles({
        keyword: "business OR economy OR finance OR stock OR market",
        articlesCount: 6,
        sortBy: "rel",
      }),
      client.getArticles({
        keyword: "sports OR football OR basketball OR baseball OR soccer",
        articlesCount: 6,
        sortBy: "rel",
      }),
      client.getArticles({
        sourceLocationUri: "http://en.wikipedia.org/wiki/United_States",
        articlesCount: 8,
        sortBy: "date",
      }),
      client.getArticles({
        keyword: "Israel OR Palestine OR Gaza OR conflict OR war",
        articlesCount: 4,
        sortBy: "rel",
      }),
    ])

    const normalize = (response: PromiseSettledResult<EventRegistryResponse>) =>
      response.status === "fulfilled"
        ? response.value.articles.results.map((a) => client.normalizeArticle(a))
        : []

    const recentNews = normalize(recentNewsResponse)
    const politicsNews = normalize(politicsNewsResponse)
    const businessNews = normalize(businessNewsResponse)
    const sportsNews = normalize(sportsNewsResponse)
    const localNews = normalize(usNewsResponse)
    const israelConflict = normalize(conflictNewsResponse)

    console.log(`Successfully fetched news data:
      - Recent: ${recentNews.length} articles
      - Politics: ${politicsNews.length}
      - Business: ${businessNews.length}
      - Sports: ${sportsNews.length}
      - Local: ${localNews.length}
      - Conflict: ${israelConflict.length}`)

    return {
      recentNews: recentNews.slice(0, 10),
      featuredStories: recentNews.slice(0, 1),
      sidebarNews: recentNews.slice(1, 3),
      localNews: localNews.slice(0, 8),
      politicsNews: politicsNews.slice(0, 8),
      israelConflict: israelConflict.slice(0, 4),
      businessNews: businessNews.slice(0, 4),
      sportsNews: sportsNews.slice(0, 4),
      moreNewsItems: recentNews.slice(5, 10).map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        timestamp: item.timestamp,
        category: item.category,
      })),
      socialAccounts: [
        { name: "Cricket", followers: "2.1M", verified: true },
        { name: "America", followers: "1.8M", verified: true },
        { name: "Football", followers: "3.2M", verified: true },
        { name: "India", followers: "5.1M", verified: true },
        { name: "USA", followers: "4.3M", verified: true },
        { name: "Brooklyn", followers: "892K", verified: false },
        { name: "Sam Altman", followers: "1.2M", verified: true },
      ],
    }
  } catch (error) {
    console.error("Error fetching news data:", error)
    return getEmptyNewsData()
  }
}

function getEmptyNewsData() {
  return {
    recentNews: [],
    featuredStories: [],
    sidebarNews: [],
    localNews: [],
    politicsNews: [],
    israelConflict: [],
    businessNews: [],
    sportsNews: [],
    moreNewsItems: [],
    socialAccounts: [
      { name: "Cricket", followers: "2.1M", verified: true },
      { name: "America", followers: "1.8M", verified: true },
      { name: "Football", followers: "3.2M", verified: true },
      { name: "India", followers: "5.1M", verified: true },
      { name: "USA", followers: "4.3M", verified: true },
      { name: "Brooklyn", followers: "892K", verified: false },
      { name: "Sam Altman", followers: "1.2M", verified: true },
    ],
  }
}


function getMockArticle(id: string, reason: string) {
  return {
    id,
    title: `Sample Article (${reason})`,
    content: "This is a mock article used when real data is unavailable.",
    image: "/placeholder.png",
    timestamp: "Recently",
    bias: "center" as const,
    biasScores: { left: 5, center: 15, right: 5 },
    category: "General",
    excerpt: "Mock article content...",
    source: "System",
    url: "#",
  }
}
