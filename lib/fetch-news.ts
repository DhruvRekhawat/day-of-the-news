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
      title: event.title?.eng || event.title || "Untitled Event",
      category: event.categories?.[0]?.label || "General",
      summary: event.summary?.eng || event.summary || "",
      image: event.images?.[0] || null,
      publishedAt: new Date(event.eventDate || event.dateTime || new Date()),
    };
  }

  // Fetch events with their related articles (optimized with limits)
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

    // Limit to first 5 events to avoid timeout
    const limitedEvents = events.slice(0, 5);
    console.log(`[NewsAPI] Processing ${limitedEvents.length} events (limited from ${events.length})`);

    // Process events in parallel with concurrency limit
    const batchSize = 2; // Process 2 events at a time
    for (let i = 0; i < limitedEvents.length; i += batchSize) {
      const batch = limitedEvents.slice(i, i + batchSize);
      const batchPromises = batch.map(async (event: any) => {
        try {
          const eventWithArticles = await this.fetchEventWithArticles(event.uri);
          // Only add events that have articles
          if (eventWithArticles.articles.length > 0) {
            return eventWithArticles;
          }
        } catch (error) {
          console.error(`[NewsAPI] Error fetching articles for event ${event.uri}:`, error);
        }
        return null;
      });

      const batchResults = await Promise.all(batchPromises);
      eventsWithArticles.push(...batchResults.filter(Boolean));
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < limitedEvents.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`[NewsAPI] Successfully processed ${eventsWithArticles.length} events with articles`);
    return eventsWithArticles;
  }

  // Fetch events using metadata directly (simpler approach)
  async fetchEventsSimple(params: URLSearchParams): Promise<{ event: any; articles: any[] }[]> {
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
        // Only add events that have articles
        if (eventWithArticles.articles.length > 0) {
          eventsWithArticles.push(eventWithArticles);
        }
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

    if (!res.ok) {
      console.error(`[NewsAPI] HTTP error for event ${eventUri}: ${res.status} ${res.statusText}`);
      throw new Error(`News API error: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log(`[NewsAPI] Raw response for event ${eventUri}:`, JSON.stringify(data, null, 2));

    // Event Registry returns data in format: { 'eventUri': { articles: {...} } }
    const eventData = data[eventUri];
    if (!eventData) {
      console.error(`[NewsAPI] No event data returned for ${eventUri}:`, data);
      throw new Error("Event not found");
    }

    const articles = eventData.articles?.results || [];
    console.log(`[NewsAPI] Found ${articles.length} articles for event ${eventUri}`);

    // For events, we need to construct the event data from the articles
    // Use the first article to get event metadata
    const firstArticle = articles[0];
    if (!firstArticle) {
      throw new Error("No articles found for event");
    }

    // Create event data from the first article
    const event = {
      uri: eventUri,
      title: firstArticle.title,
      categories: firstArticle.categories,
      summary: firstArticle.body?.substring(0, 200) + "..." || "",
      image: firstArticle.image,
      dateTime: firstArticle.dateTime,
    };

    return {
      event: this.normalizeEvent(event),
      articles: articles.map(this.normalizeArticle.bind(this)),
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
      lang: "eng", // English language only
      eventsSortBy: "date",
      eventsCount: "10",
      // Exclude events from other countries
      excludeLocationUri: "http://en.wikipedia.org/wiki/United_States,http://en.wikipedia.org/wiki/United_Kingdom,http://en.wikipedia.org/wiki/China",
    });
    return this.fetchEvents(params);
  }

  // Fetch global conflict events
  async fetchGlobalConflictEvents(): Promise<{ event: any; articles: any[] }[]> {
    const params = new URLSearchParams({
      conceptUri: "http://en.wikipedia.org/wiki/War",
      sourceLocationUri: "http://en.wikipedia.org/wiki/India",
      lang: "eng", // English language only
      eventsSortBy: "rel",
      eventsCount: "10",
    });
    return this.fetchEvents(params);
  }

  // Fetch events by topic
  async fetchEventsByTopic(topic: string): Promise<{ event: any; articles: any[] }[]> {
    const params = new URLSearchParams({
      keyword: topic,
      sourceLocationUri: "http://en.wikipedia.org/wiki/India",
      lang: "eng", // English language only
      eventsSortBy: "rel",
      eventsCount: "10",
    });
    return this.fetchEvents(params);
  }

  // Fetch trending events
  async fetchTrendingEvents(): Promise<{ event: any; articles: any[] }[]> {
    // Get trending concepts first for India
    const trendingUrl = `${this.baseUrl}/trendingConcepts?apiKey=${this.apiKey}&sourceLocationUri=http://en.wikipedia.org/wiki/India&lang=eng&conceptType=person,org,loc&_t=${Date.now()}`;
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
      sourceLocationUri: "http://en.wikipedia.org/wiki/India",
      lang: "eng", // English language only
      eventsSortBy: "date",
      eventsCount: "10",
    });
  
    return this.fetchEvents(params);
  }
}


