// lib/news-client.ts

import base64url from "base64url";

export class NewsApiClient {
  private apiKey: string;
  private baseUrl = "https://eventregistry.org/api/v1";

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  // Normalizes the raw article data into our application's format
  private normalizeArticle(article: any) {
    const id = base64url.encode(article.uri);
    return {
      id,
      originalUri: article.uri,
      title: article.title,
      content: article.body,
      excerpt: article.body?.substring(0, 150) + "..." || "",
      url: article.url,
      image: article.image || null,
      source: article.source.title,
      category: article.categories?.[0]?.label || "General",
      publishedAt: new Date(article.dateTime),
    };
  }

  // Normalizes event data
  private normalizeEvent(event: any) {
    return {
      eventUri: event.uri,
      title: event.title,
      category: event.categories?.[0]?.label || "General",
      summary: event.summary,
      image: event.image || null,
      publishedAt: new Date(event.dateTime),
    };
  }

  // Fetch events with their related articles
  async fetchEvents(params: URLSearchParams): Promise<{ event: any; articles: any[] }[]> {
    const url = new URL(`${this.baseUrl}/event/getEvents`);
    params.append("apiKey", this.apiKey);
    params.append("resultType", "events");
    params.append("_t", Date.now().toString());
    url.search = params.toString();

    console.log(`[NewsAPI] Making events request to: ${url.toString().replace(this.apiKey, '***')}`);
    const response = await fetch(url.toString(), {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[NewsAPI] Received ${data.events?.results?.length || 0} events`);
    
    const events = data.events?.results || [];
    const eventsWithArticles: { event: any; articles: any[] }[] = [];

    // For each event, fetch its articles
    for (const event of events) {
      try {
        const eventWithArticles = await this.fetchEventWithArticles(event.uri);
        eventsWithArticles.push(eventWithArticles);
      } catch (error) {
        console.error(`[NewsAPI] Error fetching articles for event ${event.uri}:`, error);
        // Continue with other events even if one fails
      }
    }

    return eventsWithArticles;
  }

  // Fetch a specific event with all its articles
  async fetchEventWithArticles(eventUri: string): Promise<{ event: any; articles: any[] }> {
    const url = `${this.baseUrl}/event/getEvent`;
    const body = JSON.stringify({
      apiKey: this.apiKey,
      eventUri,
      resultType: "articles",
      articlesSortBy: "date",
      articlesCount: 10,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`News API error: ${res.statusText}`);
    const data = await res.json();

    if (!data.event) {
      throw new Error("Event not found");
    }

    return {
      event: this.normalizeEvent(data.event),
      articles: (data.articles?.results || []).map(this.normalizeArticle.bind(this)),
    };
  }

  // Fetch individual article by ID (for backward compatibility)
  async fetchArticleById(id: string): Promise<any> {
    const articleUri = base64url.decode(id);
    console.log(articleUri);
    
    const url = `${this.baseUrl}/article/getArticle`;
    const body = JSON.stringify({
      apiKey: this.apiKey,
      articleUri: articleUri,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`News API error: ${res.statusText}`);
    const json = await res.json();

    if (!articleUri || !json[articleUri].info) {
      throw new Error("Article not found");
    }

    return this.normalizeArticle(json[articleUri].info);
  }

  // Fetch Indian events
  async fetchIndianEvents(): Promise<{ event: any; articles: any[] }[]> {
    const params = new URLSearchParams({
      sourceLocationUri: "http://en.wikipedia.org/wiki/India",
      eventsSortBy: "date",
      eventsCount: "10",
    });
    return this.fetchEvents(params);
  }

  // Fetch global conflict events
  async fetchGlobalConflictEvents(): Promise<{ event: any; articles: any[] }[]> {
    const params = new URLSearchParams({
      conceptUri: "http://en.wikipedia.org/wiki/War",
      eventsSortBy: "rel",
      eventsCount: "10",
    });
    return this.fetchEvents(params);
  }

  // Fetch events by topic
  async fetchEventsByTopic(topic: string): Promise<{ event: any; articles: any[] }[]> {
    const params = new URLSearchParams({
      keyword: topic,
      eventsSortBy: "rel",
      eventsCount: "10",
    });
    return this.fetchEvents(params);
  }

  // Fetch trending events
  async fetchTrendingEvents(): Promise<{ event: any; articles: any[] }[]> {
    // Get trending concepts first
    const trendingUrl = `${this.baseUrl}/trendingConcepts?apiKey=${this.apiKey}&sourceLocationUri=country/IN&conceptType=person,org,loc&_t=${Date.now()}`;
    const trendingRes = await fetch(trendingUrl, {
      cache: 'no-store',
    });
    
    if (!trendingRes.ok) throw new Error(`Trending API error: ${trendingRes.statusText}`);
  
    const trendingData = await trendingRes.json();
    const concepts = trendingData?.concepts || [];
  
    if (!concepts.length) return [];
  
    // Get top 10 concept URIs
    const conceptUris = concepts.slice(0, 10).map((c: any) => c.uri);
  
    // Build params for fetching related events
    const params = new URLSearchParams({
      conceptUri: conceptUris.join(","),
      eventsSortBy: "date",
      eventsCount: "10",
    });
  
    return this.fetchEvents(params);
  }
}


