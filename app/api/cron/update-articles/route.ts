// app/api/cron/update-articles/route.ts

import { NextResponse } from 'next/server';
import { NewsApiClient } from '@/lib/fetch-news';
import { prisma } from '@/lib/prisma';

const newsClient = new NewsApiClient({ apiKey: process.env.EVENTREGISTRY_API_KEY! });

export async function POST(request: Request) {
  try {
    const headlines = await newsClient.fetchIndianHeadlines();

    for (const article of headlines) {
      // We will now simply store the article with its excerpt as the summary.
      // The full AI analysis will be done on-demand.
      await prisma.article.upsert({
        where: { id: article.id },
        update: { ...article, aiSummary: article.excerpt },
        create: { ...article, aiSummary: article.excerpt },
      });
    }

    return NextResponse.json({ success: true, message: 'Articles updated' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return new NextResponse('Error updating articles', { status: 500 });
  }
}