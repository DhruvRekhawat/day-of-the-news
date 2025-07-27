// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import _ from 'lodash';
import { prisma } from "@/lib/prisma";


// interface SearchFilters {
//   category?: string;
//   source?: string;
//   dateFrom?: string;
//   dateTo?: string;
//   limit?: number;
//   offset?: number;
// }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ 
        results: [], 
        total: 0, 
        message: 'Query parameter is required' 
      }, { status: 400 });
    }

    // Build base where clause
    const baseWhere: any = {};
    
    if (category) {
      baseWhere.category = {
        contains: category,
        mode: 'insensitive'
      };
    }
    
    if (source) {
      baseWhere.source = {
        contains: source,
        mode: 'insensitive'
      };
    }
    
    if (dateFrom || dateTo) {
      baseWhere.publishedAt = {};
      if (dateFrom) {
        baseWhere.publishedAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        baseWhere.publishedAt.lte = new Date(dateTo);
      }
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    // Create OR conditions for full-text search
    const searchConditions = searchTerms.map(term => ({
      OR: [
        {
          title: {
            contains: term,
            mode: 'insensitive' as const
          }
        },
        {
          content: {
            contains: term,
            mode: 'insensitive' as const
          }
        },
        {
          excerpt: {
            contains: term,
            mode: 'insensitive' as const
          }
        },
        {
          aiSummary: {
            contains: term,
            mode: 'insensitive' as const
          }
        }
      ]
    }));

    // Combine base filters with search conditions
    const whereClause = {
      ...baseWhere,
      AND: searchConditions
    };

    // Execute search query
    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: whereClause,
        orderBy: {
          publishedAt: 'desc'
        },
        skip: offset,
        take: limit,
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          url: true,
          image: true,
          source: true,
          category: true,
          publishedAt: true,
          aiSummary: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.article.count({
        where: whereClause
      })
    ]);

    // Calculate relevance scores using Lodash
    const resultsWithScores = articles.map((article: { title: string; excerpt: string; content: string; aiSummary: any; category: string; source: string; }) => {
      let relevanceScore = 0;
      const matchedFields: string[] = [];

      // Title matches (highest weight)
      const titleMatches = searchTerms.filter(term => 
        article.title.toLowerCase().includes(term)
      );
      if (titleMatches.length > 0) {
        relevanceScore += titleMatches.length * 10;
        matchedFields.push('title');
      }

      // Excerpt matches (medium-high weight)
      const excerptMatches = searchTerms.filter(term => 
        article.excerpt.toLowerCase().includes(term)
      );
      if (excerptMatches.length > 0) {
        relevanceScore += excerptMatches.length * 5;
        matchedFields.push('excerpt');
      }

      // Content matches (medium weight)
      const contentMatches = searchTerms.filter(term => 
        article.content.toLowerCase().includes(term)
      );
      if (contentMatches.length > 0) {
        relevanceScore += contentMatches.length * 2;
        matchedFields.push('content');
      }

      // AI Summary matches (medium weight)
      if (article.aiSummary) {
        const summaryMatches = searchTerms.filter(term => 
          article.aiSummary!.toLowerCase().includes(term)
        );
        if (summaryMatches.length > 0) {
          relevanceScore += summaryMatches.length * 4;
          matchedFields.push('aiSummary');
        }
      }

      // Category matches (lower weight)
      if (searchTerms.some(term => article.category.toLowerCase().includes(term))) {
        relevanceScore += 7;
        matchedFields.push('category');
      }

      // Source matches (lower weight)
      if (searchTerms.some(term => article.source.toLowerCase().includes(term))) {
        relevanceScore += 6;
        matchedFields.push('source');
      }

    return {
        ...article,
        relevanceScore,
        matchedFields: _.uniq(matchedFields)
      };
    });

    // Sort by relevance score (descending) and then by published date (descending)
    const sortedResults = _.orderBy(
      resultsWithScores,
      ['relevanceScore', 'publishedAt'],
      ['desc', 'desc']
    );

    // Filter out results with 0 relevance score
    const filteredResults = sortedResults.filter(result => result.relevanceScore > 0);

    return NextResponse.json({ 
      results: filteredResults, 
      total: totalCount,
      returned: filteredResults.length
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}