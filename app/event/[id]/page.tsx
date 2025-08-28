import { AlternativeSourcesDropdown } from "@/components/alternative-sources-dropdown"
import { ArticleContent } from "@/components/article-content"
import { EventAISummary } from "@/components/event-ai-summary"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SimilarNewsArticles } from "@/components/similar-news-articles"
import { EventBiasChart } from "@/components/ui/EventBiasChart"
import { EventBiasTabs } from "@/components/ui/EventBiasTabs"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type BiasDirection = 'FAR_LEFT' | 'LEFT' | 'CENTER_LEFT' | 'CENTER' | 'CENTER_RIGHT' | 'RIGHT' | 'FAR_RIGHT' | 'UNKNOWN';
type BiasAnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

interface EventPageProps {
  params: Promise<{ id: string }>
}

// Generate metadata for the event page
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      articles: {
        include: {
          article: true,
        },
      },
    },
  })

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested news event could not be found.',
    }
  }

  const mainArticle = event.articles[0]?.article
  const description = event.summary || mainArticle?.title || 'Latest news coverage with bias analysis from multiple sources.'
  
  return {
    title: event.title,
    description: description.length > 160 ? description.substring(0, 157) + '...' : description,
    keywords: [event.category, event.topic, 'news', 'bias analysis', 'media coverage'].filter((keyword): keyword is string => Boolean(keyword)),
    openGraph: {
      title: event.title,
      description: description,
      type: 'article',
      url: `https://dayofthenews.com/event/${id}`,
      images: event.image ? [
        {
          url: event.image,
          width: 1200,
          height: 630,
          alt: event.title,
        }
      ] : undefined,
      publishedTime: event.publishedAt.toISOString(),
      modifiedTime: event.publishedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: description,
      images: event.image ? [event.image] : undefined,
    },
    alternates: {
      canonical: `https://dayofthenews.com/event/${id}`,
    },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
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
              biasAnalysis: true,
            },
          },
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  // Generate structured data for the event
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": event.title,
    "description": event.summary || event.title,
    "image": event.image ? [event.image] : undefined,
    "datePublished": event.publishedAt.toISOString(),
    "dateModified": event.publishedAt.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Day of the News"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Day of the News",
      "logo": {
        "@type": "ImageObject",
        "url": "https://dayofthenews.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://dayofthenews.com/event/${id}`
    },
    "articleSection": event.category,
    "keywords": [event.category, event.topic, "news", "bias analysis"].filter(Boolean).join(", "),
    "about": [
      {
        "@type": "Thing",
        "name": event.category
      }
    ]
  };

  // Fallback bias analysis function (20% left, 60% center, 20% right)
  const getFallbackBiasAnalysis = (source: string) => {
    const sourceHash = source.split('').reduce((a, b) => {
      a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
      return a;
    }, 0);
    
    const normalizedHash = Math.abs(sourceHash) % 100;
    
    if (normalizedHash < 20) {
      return {
        biasDirection: 'LEFT',
        biasStrength: 3,
        confidence: 0.6,
        status: 'COMPLETED',
        reasoning: 'Fallback classification based on source'
      };
    } else if (normalizedHash < 80) {
      return {
        biasDirection: 'CENTER',
        biasStrength: 2,
        confidence: 0.7,
        status: 'COMPLETED',
        reasoning: 'Fallback classification based on source'
      };
    } else {
      return {
        biasDirection: 'RIGHT',
        biasStrength: 3,
        confidence: 0.6,
        status: 'COMPLETED',
        reasoning: 'Fallback classification based on source'
      };
    }
  };

  // Get the main article (first one) and alternative sources
  const mainArticle = event.articles[0]?.article
  const alternativeSources = event.articles.slice(1).map(ea => ({
    id: ea.article.id,
    title: ea.article.title,
    url: ea.article.url,
    source: ea.article.source,
    publishedAt: ea.article.publishedAt,
    biasAnalysis: ea.article.biasAnalysis ? {
      biasDirection: ea.article.biasAnalysis.biasDirection,
      biasStrength: ea.article.biasAnalysis.biasStrength,
      confidence: ea.article.biasAnalysis.confidence,
      status: ea.article.biasAnalysis.status,
      reasoning: ea.article.biasAnalysis.reasoning || undefined,
    } : {
      ...getFallbackBiasAnalysis(ea.article.source),
      biasDirection: getFallbackBiasAnalysis(ea.article.source).biasDirection as BiasDirection,
      status: getFallbackBiasAnalysis(ea.article.source).status as BiasAnalysisStatus,
    },
  }))

  if (!mainArticle) {
    notFound()
  }

  // Function to convert database bias analysis to proper bias scores
  const convertBiasAnalysisToScores = (biasAnalysis: any) => {
    const { biasDirection, biasStrength } = biasAnalysis;
    const strength = Math.min(biasStrength / 5, 1); // Normalize strength to 0-1 range
    
    let left = 0, center = 0, right = 0;
    
    switch (biasDirection) {
      case 'FAR_LEFT':
        left = 0.9;
        center = 0.1;
        right = 0;
        break;
      case 'LEFT':
        left = 0.7;
        center = 0.3;
        right = 0;
        break;
      case 'CENTER_LEFT':
        left = 0.6;
        center = 0.4;
        right = 0;
        break;
      case 'CENTER':
        left = 0.1;
        center = 0.8;
        right = 0.1;
        break;
      case 'CENTER_RIGHT':
        left = 0;
        center = 0.4;
        right = 0.6;
        break;
      case 'RIGHT':
        left = 0;
        center = 0.3;
        right = 0.7;
        break;
      case 'FAR_RIGHT':
        left = 0;
        center = 0.1;
        right = 0.9;
        break;
      default:
        left = 0.1;
        center = 0.8;
        right = 0.1;
    }
    
    // Apply strength multiplier to make the bias more or less pronounced
    const baseCenter = center;
    center = center * (1 - strength * 0.5);
    
    if (left > 0) {
      left = left + (baseCenter - center) * 0.8;
    }
    if (right > 0) {
      right = right + (baseCenter - center) * 0.8;
    }
    
    // Normalize to ensure sum is 1
    const total = left + center + right;
    return {
      left: left / total,
      center: center / total,
      right: right / total
    };
  };

  // Transform articles to include bias analysis
  const transformedArticles = event.articles.map(ea => {
    const articleBiasAnalysis = ea.article.biasAnalysis || {
      ...getFallbackBiasAnalysis(ea.article.source),
      biasDirection: getFallbackBiasAnalysis(ea.article.source).biasDirection as BiasDirection,
      status: getFallbackBiasAnalysis(ea.article.source).status as BiasAnalysisStatus,
    };
    
    return {
      ...ea.article,
      biasAnalysis: articleBiasAnalysis,
      // Add aiBiasReport for compatibility with chart components
      aiBiasReport: {
        bias: articleBiasAnalysis.biasDirection === 'LEFT' || articleBiasAnalysis.biasDirection === 'FAR_LEFT' || articleBiasAnalysis.biasDirection === 'CENTER_LEFT' ? 'left' : 
              articleBiasAnalysis.biasDirection === 'RIGHT' || articleBiasAnalysis.biasDirection === 'FAR_RIGHT' || articleBiasAnalysis.biasDirection === 'CENTER_RIGHT' ? 'right' : 'center',
        biasScores: convertBiasAnalysisToScores(articleBiasAnalysis)
      }
    };
  });

  // Get bias data for the main article
  const biasData = mainArticle.biasAnalysis || getFallbackBiasAnalysis(mainArticle.source)

  // Calculate aggregated bias distribution from all articles (same logic as pie chart)
  const biasCounts = event.articles.reduce((acc, ea) => {
    const articleBiasAnalysis = ea.article.biasAnalysis || getFallbackBiasAnalysis(ea.article.source);
    if (articleBiasAnalysis.status === 'COMPLETED') {
      const direction = articleBiasAnalysis.biasDirection;
      acc[direction] = (acc[direction] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Group into left, center, right (same logic as pie chart)
  const leftCount = (biasCounts.FAR_LEFT || 0) + (biasCounts.LEFT || 0) + (biasCounts.CENTER_LEFT || 0);
  const centerCount = biasCounts.CENTER || 0;
  const rightCount = (biasCounts.CENTER_RIGHT || 0) + (biasCounts.RIGHT || 0) + (biasCounts.FAR_RIGHT || 0);
  const unknownCount = biasCounts.UNKNOWN || 0;

  const total = leftCount + centerCount + rightCount + unknownCount;

  // Calculate percentages for aggregated bias bar
  const aggregatedBiasScores = {
    left: total > 0 ? leftCount / total : 0,
    center: total > 0 ? centerCount / total : 0,
    right: total > 0 ? rightCount / total : 0
  };

  // Fetch similar articles (for now, we'll use articles from the same category)
  // In a real implementation, you'd want to use semantic similarity or topic matching
  const similarArticles = await prisma.article.findMany({
    where: {
      category: mainArticle.category,
      id: { not: mainArticle.id },
    },
    take: 6,
    orderBy: { publishedAt: 'desc' },
  })

  // Transform similar articles to match the expected interface
  const transformedSimilarArticles = similarArticles.map(article => ({
    id: article.id,
    title: article.title,
    image: article.image || '/placeholder.png',
    publishedAt: article.publishedAt,
    source: article.source,
    bias: (article.aiBiasReport as any)?.bias || "center",
    excerpt: article.excerpt,
    url: article.url,
  }))

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            {/* Main Article */}
            <ArticleContent article={{
              id: mainArticle.id,
              originalUri: mainArticle.originalUri,
              title: mainArticle.title,
              content: mainArticle.content,
              excerpt: mainArticle.excerpt || '',
              url: mainArticle.url,
              image: mainArticle.image || '/placeholder.png',
              source: mainArticle.source,
              category: mainArticle.category,
              publishedAt: mainArticle.publishedAt.toISOString(),
              aiSummary: mainArticle.aiSummary || '',
              aiBiasReport: {
                bias: biasData.biasDirection === 'LEFT' || biasData.biasDirection === 'FAR_LEFT' || biasData.biasDirection === 'CENTER_LEFT' ? 'left' : 
                      biasData.biasDirection === 'RIGHT' || biasData.biasDirection === 'FAR_RIGHT' || biasData.biasDirection === 'CENTER_RIGHT' ? 'right' : 'center',
                biasScores: convertBiasAnalysisToScores(biasData)
              },
              createdAt: mainArticle.createdAt.toISOString(),
              updatedAt: mainArticle.updatedAt.toISOString()
            }} 
            aggregatedBiasScores={aggregatedBiasScores}
            eventHeader={{
              isTrending: event.isTrending,
              category: event.category || '',
              topic: event.topic || undefined,
              alternativeSourcesCount: alternativeSources.length,
              eventId: event.id,
              initialBookmarkCount: event._count.bookmarks,
              initialLikeCount: event._count.likes
            }}
            />

            {/* Event Summary and AI Summary */}
            <div className="mt-8">
              {event.summary && !event.aiSummary && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">Event Summary</h2>
                  <p className="text-lg text-muted-foreground">{event.summary}</p>
                </div>
              )}
              <EventAISummary
                eventId={event.id}
                eventTitle={event.title}
                articles={event.articles}
                initialAiSummary={event.aiSummary}
              />
            </div>

            {/* Bias Chart - Mobile View (appears after AI summary) */}
            <div className="mt-8 lg:hidden">
              <EventBiasChart articles={transformedArticles} />
            </div>

            {/* Alternative Sources Dropdown */}
            <div className="mt-8">
              <AlternativeSourcesDropdown sources={alternativeSources} />
            </div>

            {/* Event Bias Tabs */}
            <div className="mt-8">
              <EventBiasTabs articles={transformedArticles} />
            </div>

            {/* Similar News Articles */}
            <div className="mt-8">
              <SimilarNewsArticles 
                articles={transformedSimilarArticles}
                eventTitle={event.title}
              />
            </div>
          </div>

          {/* Sidebar - Bias Chart (Desktop only) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Bias Chart - Desktop View */}
              <div className="hidden lg:block">
                <EventBiasChart articles={transformedArticles} />
              </div>

              {/* Event Metadata */}
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Event Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Published:</span>
                    <span className="ml-2">{formatDistanceToNow(new Date(event.publishedAt), { addSuffix: true })}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2">{event.category}</span>
                  </div>
                  {event.topic && (
                    <div>
                      <span className="text-muted-foreground">Topic:</span>
                      <span className="ml-2">{event.topic}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Total Sources:</span>
                    <span className="ml-2">{event.articles.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bookmarks:</span>
                    <span className="ml-2">{event._count.bookmarks}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Likes:</span>
                    <span className="ml-2">{event._count.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}