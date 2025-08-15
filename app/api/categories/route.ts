import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all unique categories
    const categories = await prisma.event.findMany({
      select: {
        category: true,
      },
      where: {
        category: {
          not: null,
        },
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    // Get all unique topics
    const topics = await prisma.event.findMany({
      select: {
        topic: true,
      },
      where: {
        topic: {
          not: null,
        },
      },
      distinct: ['topic'],
      orderBy: {
        topic: 'asc',
      },
    });

    return NextResponse.json({
      categories: categories.map(c => c.category).filter(Boolean),
      topics: topics.map(t => t.topic).filter(Boolean),
    });
  } catch (error) {
    console.error('Error fetching categories and topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories and topics' },
      { status: 500 }
    );
  }
}
