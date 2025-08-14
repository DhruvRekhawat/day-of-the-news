// app/api/articles/route.ts
// This is the main API route handler for fetching articles. It supports two modes:
// 1. Fetching a single article by ID 
// 2. Fetching a list of articles by topic

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewsApiClient } from "@/lib/fetch-news"; // Using our dedicated client
// Import AI functions
import { startOfToday } from "date-fns";
import { headers } from "next/headers";
import { analyzeBias, generateSummary } from "@/lib/openai-client";

// This line tells Next.js to treat this route as a dynamic API endpoint.
export const dynamic = "force-dynamic";

const newsClient = new NewsApiClient({
  apiKey: process.env.EVENTREGISTRY_API_KEY!,
});

const USAGE_LIMITS = {
  LOGGED_OUT: 100,
  FREE: 5,
  PREMIUM: 100, // Premium users get a higher limit
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("id");
  const topic = searchParams.get("topic");

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;
  const userRole = session?.user?.role ?? "FREE";

  let limit = USAGE_LIMITS.LOGGED_OUT;
  if (userId) {
    limit = userRole === "PREMIUM" ? USAGE_LIMITS.PREMIUM : USAGE_LIMITS.FREE;
  }

  const today = startOfToday();
  const dailyInteractions = userId
    ? await prisma.interaction.count({
        where: { userId, viewedAt: { gte: today } },
      })
    : 0;

  const canView = dailyInteractions < limit;

  // --- Handle Fetching a Single Article ---
  if (articleId) {
    if (!canView && userId) {
      return new NextResponse(
        JSON.stringify({
          error: "Daily usage limit reached",
          limit,
          currentUsage: dailyInteractions,
        }),
        { status: 429 }
      );
    }
    let article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      console.log(`[API] Article not found in Prisma for id: ${articleId}`);
      try {
        console.log(
          `[API] Attempting to fetch article from external API for id: ${articleId}`
        );
        const rawArticle = await newsClient.fetchArticleById(articleId);
        console.log(
          `[API] External API response for id ${articleId}:`,
          rawArticle
        );

        if (!rawArticle) {
          console.log(
            `[API] External API did not return the article for id: ${articleId}`
          );
          return new NextResponse(
            JSON.stringify({ error: "Article not found from external" }),
            { status: 404 }
          );
        }

        console.log(
          `[API] Generating AI summary and bias analysis for article: ${articleId}`
        );

        // Generate AI summary and bias analysis
        const [aiSummary, biasAnalysis] = await Promise.all([
          generateSummary(
            rawArticle.content || rawArticle.excerpt || rawArticle.title
          ),
          analyzeBias(
            rawArticle.content || rawArticle.excerpt || rawArticle.title
          ),
        ]);

        console.log(
          `[API] AI Summary generated: ${aiSummary.substring(0, 50)}...`
        );
        console.log(`[API] AI Bias analysis:`, {
          bias: biasAnalysis.bias,
          scores: biasAnalysis.biasScores,
        });

        const prismaArticle = {
          id: rawArticle.id,
          originalUri: rawArticle.originalUri,
          title: rawArticle.title,
          content: rawArticle.content,
          excerpt: rawArticle.excerpt,
          url: rawArticle.url,
          image: rawArticle.image ?? null,
          source: rawArticle.source,
          category: rawArticle.category,
          publishedAt: new Date(rawArticle.publishedAt),
          aiSummary: aiSummary || null,
          // Store the complete bias analysis object
          aiBiasReport: biasAnalysis as any,
          // If you have separate fields for bias classification and scores:
          // aiBias: biasAnalysis.bias,
          // aiBiasScores: biasAnalysis.biasScores,
        };
        console.log(
          `[API] Creating article in Prisma with data:`,
          prismaArticle
        );

        article = await prisma.article.create({ data: prismaArticle });
        console.log(
          `[API] Article created in Prisma with AI analysis: ${article.id}`
        );
      } catch (error: any) {
        console.error(
          `[API] Error fetching/creating article for id ${articleId}:`,
          error
        );
        return new NextResponse(
          JSON.stringify({ error: error.message || "Article not found" }),
          { status: 404 }
        );
      }
    }

    // Track interaction for logged-in users
    if (userId) {
      await prisma.interaction
        .create({
          data: { userId, articleId: article.id },
        })
        .catch((e) => {
          console.warn(
            "Failed to log interaction (might be duplicate):",
            e.message
          );
        });
    }

    return NextResponse.json(article);
  }

  // --- Handle Fetching a List of Articles ---
  try {
    console.log(`[API] Fetching articles for topic: ${topic || 'headlines'} at ${new Date().toISOString()}`);
    let articles = [];
    if (topic) {
      const eventsWithArticles = await newsClient.fetchEventsByTopic(topic);
      articles = eventsWithArticles.flatMap(event => event.articles);
    } else {
      const eventsWithArticles = await newsClient.fetchIndianEvents();
      articles = eventsWithArticles.flatMap(event => event.articles);
    }
    console.log(`[API] Fetched ${articles.length} articles for topic: ${topic || 'headlines'}`);
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching article list:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not fetch articles" }),
      { status: 500 }
    );
  }
}
