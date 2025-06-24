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
  categories?: Array<{
    uri: string
    label: string
  }>
  concepts?: Array<{
    uri: string
    label: string
    score: number
  }>
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

export class NewsAPIClient {
  private config: EventRegistryConfig

  constructor(config: EventRegistryConfig) {
    this.config = config
  }

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

    // Add required parameters
    url.searchParams.append("apiKey", this.config.apiKey)
    url.searchParams.append("resultType", "articles")
    url.searchParams.append("articlesCount", (params.articlesCount || 50).toString())
    url.searchParams.append("lang", params.lang || "eng")

    // Add optional parameters
    if (params.keyword) {
      url.searchParams.append("keyword", params.keyword)
    }

    if (params.conceptUri) {
      url.searchParams.append("conceptUri", params.conceptUri)
    }

    if (params.categoryUri) {
      url.searchParams.append("categoryUri", params.categoryUri)
    }

    if (params.sourceLocationUri) {
      url.searchParams.append("sourceLocationUri", params.sourceLocationUri)
    }

    if (params.sortBy) {
      url.searchParams.append("sortBy", params.sortBy)
    }

    if (params.dateStart) {
      url.searchParams.append("dateStart", params.dateStart)
    }

    if (params.dateEnd) {
      url.searchParams.append("dateEnd", params.dateEnd)
    }

    try {
      console.log("Fetching from EventRegistry:", url.toString().replace(this.config.apiKey, "***"))

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for better performance
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      })

      if (!response.ok) {
        throw new Error(`EventRegistry API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching from EventRegistry:", error)
      throw error
    }
  }

  // Enhanced normalize method with better image and bias handling
  normalizeArticle(article: EventRegistryArticle) {
    const getImageUrl = (article: EventRegistryArticle): string => {
      if (article.image) {
        return article.image
      }
      // Fallback to placeholder
      return "/placeholder.svg?height=200&width=300"
    }

    const calculateBias = (article: EventRegistryArticle): "left" | "center" | "right" => {
      // Use sentiment if available
      if (article.sentiment !== undefined) {
        if (article.sentiment < -0.1) return "left"
        if (article.sentiment > 0.1) return "right"
        return "center"
      }

      // Use source-based bias detection (simplified)
      const sourceTitle = article.source.title.toLowerCase()

      // Left-leaning sources
      if (
        sourceTitle.includes("cnn") ||
        sourceTitle.includes("msnbc") ||
        sourceTitle.includes("guardian") ||
        sourceTitle.includes("huffington")
      ) {
        return "left"
      }

      // Right-leaning sources
      if (
        sourceTitle.includes("fox") ||
        sourceTitle.includes("breitbart") ||
        sourceTitle.includes("daily wire") ||
        sourceTitle.includes("newsmax")
      ) {
        return "right"
      }

      // Default to center
      return "center"
    }

    // Generate mock bias scores for demonstration
    const generateBiasScores = (bias: "left" | "center" | "right") => {
      switch (bias) {
        case "left":
          return {
            left: Math.floor(Math.random() * 10) + 15,
            center: Math.floor(Math.random() * 8) + 5,
            right: Math.floor(Math.random() * 5) + 2,
          }
        case "right":
          return {
            left: Math.floor(Math.random() * 5) + 2,
            center: Math.floor(Math.random() * 8) + 5,
            right: Math.floor(Math.random() * 10) + 15,
          }
        default:
          return {
            left: Math.floor(Math.random() * 8) + 5,
            center: Math.floor(Math.random() * 12) + 10,
            right: Math.floor(Math.random() * 8) + 5,
          }
      }
    }

    const bias = calculateBias(article)

    return {
      id: article.uri,
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
  }

  private formatTimestamp(dateTime: string): string {
    try {
      const date = new Date(dateTime)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) {
        return "Just now"
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays === 1) {
          return "1 day ago"
        } else if (diffInDays < 7) {
          return `${diffInDays} days ago`
        } else {
          return date.toLocaleDateString()
        }
      }
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Recently"
    }
  }
}

// Function to fetch individual article by ID
export async function fetchArticleById(articleId: string) {
  const apiKey = process.env.EVENTREGISTRY_API_KEY

  if (!apiKey) {
    console.error("EVENTREGISTRY_API_KEY environment variable is not set")
    return null
  }

  const client = new NewsAPIClient({
    apiKey,
    baseUrl: "https://eventregistry.org",
  })

  try {
    // For EventRegistry, we need to fetch articles and find the matching one
    // In a real implementation, you might want to store articles in a database
    // and fetch by ID directly
    const response = await client.getArticles({
      sortBy: "date",
      articlesCount: 100,
    })

    const article = response.articles.results.find((a) => a.uri === articleId)

    if (!article) {
      return null
    }

    return client.normalizeArticle(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

// Function to fetch related articles
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
    // Fetch recent articles as related articles
    const response = await client.getArticles({
      sortBy: "date",
      articlesCount: limit + 5, // Get a few extra to filter out the main article
    })

    return response.articles.results
      .filter((article) => article.uri !== articleId) // Exclude the main article
      .slice(0, limit)
      .map((article) => client.normalizeArticle(article))
  } catch (error) {
    console.error("Error fetching related articles:", error)
    return []
  }
}

// Main function to fetch all news data
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

    // Get today's date for recent news
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateStart = yesterday.toISOString().split("T")[0]
    const dateEnd = today.toISOString().split("T")[0]

    // Fetch different categories of news in parallel
    const [
      recentNewsResponse,
      politicsNewsResponse,
      businessNewsResponse,
      sportsNewsResponse,
      usNewsResponse,
      conflictNewsResponse,
    ] = await Promise.allSettled([
      // Recent news - sorted by date
      client.getArticles({
        sortBy: "date",
        articlesCount: 15,
        dateStart,
        dateEnd,
      }),

      // Politics news
      client.getArticles({
        keyword: "politics OR election OR government OR congress OR senate",
        articlesCount: 8,
        sortBy: "rel",
      }),

      // Business news
      client.getArticles({
        keyword: "business OR economy OR finance OR stock OR market",
        articlesCount: 6,
        sortBy: "rel",
      }),

      // Sports news
      client.getArticles({
        keyword: "sports OR football OR basketball OR baseball OR soccer",
        articlesCount: 6,
        sortBy: "rel",
      }),

      // US/Local news
      client.getArticles({
        sourceLocationUri: "http://en.wikipedia.org/wiki/United_States",
        articlesCount: 8,
        sortBy: "date",
      }),

      // Conflict/International news
      client.getArticles({
        keyword: "Israel OR Palestine OR Gaza OR conflict OR war",
        articlesCount: 4,
        sortBy: "rel",
      }),
    ])

    // Process successful responses
    const recentNews =
      recentNewsResponse.status === "fulfilled"
        ? recentNewsResponse.value.articles.results.map((article) => client.normalizeArticle(article))
        : []

    const politicsNews =
      politicsNewsResponse.status === "fulfilled"
        ? politicsNewsResponse.value.articles.results.map((article) => client.normalizeArticle(article))
        : []

    const businessNews =
      businessNewsResponse.status === "fulfilled"
        ? businessNewsResponse.value.articles.results.map((article) => client.normalizeArticle(article))
        : []

    const sportsNews =
      sportsNewsResponse.status === "fulfilled"
        ? sportsNewsResponse.value.articles.results.map((article) => client.normalizeArticle(article))
        : []

    const localNews =
      usNewsResponse.status === "fulfilled"
        ? usNewsResponse.value.articles.results.map((article) => client.normalizeArticle(article))
        : []

    const israelConflict =
      conflictNewsResponse.status === "fulfilled"
        ? conflictNewsResponse.value.articles.results.map((article) => client.normalizeArticle(article))
        : []

    console.log(`Successfully fetched news data:
      - Recent: ${recentNews.length} articles
      - Politics: ${politicsNews.length} articles  
      - Business: ${businessNews.length} articles
      - Sports: ${sportsNews.length} articles
      - Local: ${localNews.length} articles
      - Conflict: ${israelConflict.length} articles`)

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

// Fallback empty data structure
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
