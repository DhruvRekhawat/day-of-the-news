// app/api/articles/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NewsApiClient } from '@/lib/fetch-news'; // Using our dedicated client
import { startOfToday } from 'date-fns';
import { headers } from 'next/headers';

// This line tells Next.js to treat this route as a dynamic API endpoint.
export const dynamic = "force-dynamic";

const newsClient = new NewsApiClient({ apiKey: process.env.EVENTREGISTRY_API_KEY! });

const USAGE_LIMITS = {
  LOGGED_OUT: 1,
  FREE: 5,
  PREMIUM: 100, // Premium users get a higher limit
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('id'); // This is your base64url-encoded ID from the URL
  const topic = searchParams.get('topic');

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })
  const userId = session?.user?.id;
  const userRole = session?.user?.role ?? 'FREE';

  // --- 1. Determine Usage Limit and Current Usage ---
  let limit = USAGE_LIMITS.LOGGED_OUT;
  if (userId) {
    limit = userRole === 'PREMIUM' ? USAGE_LIMITS.PREMIUM : USAGE_LIMITS.FREE;
  }

  const today = startOfToday();
  const dailyInteractions = userId
    ? await prisma.interaction.count({
        where: { userId, viewedAt: { gte: today } },
      })
    : 0; // Logged-out users are handled client-side for this example

  const canView = dailyInteractions < limit;

  // --- 2. Handle Fetching a Single Article ---
  if (articleId) {
    if (!canView && userId) { // Enforce limit for logged-in users
      return new NextResponse(
        JSON.stringify({
          error: 'Daily usage limit reached',
          limit,
          currentUsage: dailyInteractions,
        }),
        { status: 429 }
      );
    }
    try {
      // ✅ NO parseInt() here. `articleId` is already the base64url-encoded string.
      // Make sure your Prisma `Article` model `id` field can store this string.
      // If it's currently an Int, you need to change it to String in your schema.
      // The `id` field you're using for prisma needs to match the `id` generated in normalizeArticle.
      
      let article = await prisma.article.findUnique({ where: { id: articleId } });

      // If not in DB, fetch from API, then save it
      if (!article) {
        const rawArticle = await newsClient.fetchArticleById(articleId); // Pass the string ID
        
        // Ensure the ID type matches what Prisma expects for 'id' field.
        // `rawArticle.id` should already be the base64url-encoded string.
        article = await prisma.article.create({ data: rawArticle }); 
      }

      // Track interaction for logged-in users
      if (userId) {
        await prisma.interaction.create({
          data: { userId, articleId: article.id }, // Use article.id which is the base64url string
        }).catch((e) => {
           console.warn("Failed to log interaction (might be duplicate):", e.message);
        });
      }

      return NextResponse.json(article);

    } catch (error: any) { // Type 'any' for error for now for flexibility
      console.error("Error fetching single article:", error);
      if (error.message.includes('Article not found')) { // Check message from NewsApiClient
         return new NextResponse('Article not found', { status: 404 });
      }
      return new NextResponse('Internal Server Error while fetching article', { status: 500 });
    }
  }

  // --- 3. Handle Fetching a List of Articles (by Topic or Headlines) ---
  try {
    let articles = [];
    if (topic) {
      articles = await newsClient.fetchArticlesByTopic(topic);
    } else {
      articles = await newsClient.fetchIndianHeadlines();
    }
    // For lists, we don't block, we just return the data.
    // The frontend will be responsible for blocking access to the article *detail* page.
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching article list:", error);
    return new NextResponse('Could not fetch articles', { status: 500 });
  }
}