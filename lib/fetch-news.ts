// lib/news-client.ts

import base64url from "base64url";

// A mock client for demonstration. Replace with your actual NewsAPI.ai SDK or fetch calls.
// The structure of the responses should match your actual API provider.
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

  async fetchArticles(params: URLSearchParams): Promise<any[]> {
    const url = new URL(`${this.baseUrl}/article/getArticles`);
    params.append("apiKey", this.apiKey);
    params.append("resultType", "articles");
    url.search = params.toString();

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`News API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.articles.results.map(this.normalizeArticle);
  }

  async fetchArticleById(id: string): Promise<any> {
    const articleUri = base64url.decode(id);
    console.log(articleUri);
    // Use getArticle endpoint with POST and JSON body
    const url = `${this.baseUrl}/article/getArticle`;
    const body = JSON.stringify({
      apiKey: this.apiKey,
      articleUri: articleUri,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      next: { revalidate: 3600 },
    });
    // console.log("hello", res);
    if (!res.ok) throw new Error(`News API error: ${res.statusText}`);
    const json = await res.json();

    const articleUrl = Object.keys(json)[0];
    if (!articleUri || !json[articleUri].info) {
      throw new Error("Article not found");
    }

    return this.normalizeArticle(json[articleUri].info);
  }

  async fetchIndianHeadlines(): Promise<any[]> {
    const params = new URLSearchParams({
      sourceLocationUri: "http://en.wikipedia.org/wiki/India",
      articlesSortBy: "date",
      articlesCount: "20",
    });
    return this.fetchArticles(params);
  }

  async fetchGlobalConflicts(): Promise<any[]> {
    const params = new URLSearchParams({
      conceptUri: "http://en.wikipedia.org/wiki/War",
      articlesSortBy: "rel",
      articlesCount: "20",
    });
    return this.fetchArticles(params);
  }

  async fetchArticlesByTopic(topic: string): Promise<any[]> {
    const params = new URLSearchParams({
      keyword: topic,
      articlesSortBy: "rel",
      articlesCount: "20",
    });
    return this.fetchArticles(params);
  }
}
