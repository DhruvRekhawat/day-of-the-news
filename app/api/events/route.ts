import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { queueBiasAnalysis } from "@/lib/queue"

export async function GET(request: NextRequest) {
  // Add cache control headers to prevent caching
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic")
    const trending = searchParams.get("trending") === "true"
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Build the where clause
    const where: any = {}
    
    if (topic) {
      where.topic = topic
    }
    
    if (trending) {
      where.isTrending = true
    }

    // Fetch events with their articles and bias analysis
    const events = await prisma.event.findMany({
      where,
      include: {
        _count: {
          select: {
            bookmarks: true,
            likes: true,
          },
        },
        articles: {
          include: {
            article: {
              include: {
                _count: {
                  select: {
                    interactions: true,
                  },
                },
                biasAnalysis: true, // Include bias analysis for articles
              },
            },
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    // Transform the data and queue bias analysis for articles without it
    const transformedEvents = await Promise.all(
      events.map(async (event) => {
        const articlesWithBias = await Promise.all(
          event.articles.map(async (ea) => {
            const article = ea.article;
            
            // Queue bias analysis if it doesn't exist or failed
            if (!article.biasAnalysis || article.biasAnalysis.status === 'FAILED') {
              try {
                await queueBiasAnalysis(article.id, 'normal');
              } catch (error) {
                console.warn(`Failed to queue bias analysis for article ${article.id}:`, error);
              }
            }
            
            return {
              ...article,
              interactionCount: article._count.interactions,
              biasAnalysis: article.biasAnalysis,
              _count: undefined, // Remove the _count object
            };
          })
        );
        
        // Calculate event-level bias distribution
        const biasDistribution = calculateBiasDistribution(articlesWithBias);
        
        return {
          id: event.id,
          eventUri: event.eventUri,
          title: event.title,
          category: event.category,
          topic: event.topic,
          isTrending: event.isTrending,
          summary: event.summary,
          image: event.image,
          publishedAt: event.publishedAt,
          bookmarkCount: event._count.bookmarks,
          likeCount: event._count.likes,
          articles: articlesWithBias,
          biasDistribution,
        };
      })
    );

    return NextResponse.json({
      success: true,
      events: transformedEvents,
      total: events.length,
    })
  } catch (error) {
    console.error("[API] Error fetching events:", error)
    return new NextResponse("Error fetching events", { status: 500 })
  }
}

function calculateBiasDistribution(articles: any[]) {
  const distribution = { 
    FAR_LEFT: 0, 
    LEFT: 0, 
    CENTER_LEFT: 0, 
    CENTER: 0, 
    CENTER_RIGHT: 0, 
    RIGHT: 0, 
    FAR_RIGHT: 0, 
    UNKNOWN: 0,
    PENDING: 0,
    PROCESSING: 0,
    FAILED: 0
  };
  
  articles.forEach(article => {
    if (article.biasAnalysis) {
      const status = article.biasAnalysis.status;
      const direction = article.biasAnalysis.biasDirection;
      
      if (status === 'COMPLETED') {
        if (direction in distribution) {
          distribution[direction as keyof typeof distribution]++;
        }
      } else {
        if (status in distribution) {
          distribution[status as keyof typeof distribution]++;
        }
      }
    } else {
      distribution.PENDING++;
    }
  });
  
  return distribution;
}
