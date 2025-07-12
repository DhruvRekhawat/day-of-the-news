// app/api/cron/update-articles/route.ts

import { NextResponse } from 'next/server';
import { NewsApiClient } from '@/lib/fetch-news';
import { prisma } from '@/lib/prisma';
import { generateSummary, analyzeBias } from '@/lib/openai-client';

const newsClient = new NewsApiClient({ apiKey: process.env.EVENTREGISTRY_API_KEY! });

export async function POST() {
  try {
    const headlines = await newsClient.fetchIndianHeadlines();

    for (const article of headlines) {
      const summary = await generateSummary(article.content);
      const bias = await analyzeBias(article.content);

      await prisma.article.upsert({
        where: { id: article.id },
        update: { ...article, summary, bias },
        create: { ...article, summary, bias },
      });
    }

    return NextResponse.json({ success: true, message: 'Articles updated' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return new NextResponse('Error updating articles', { status: 500 });
  }
}