import { AlternativeSourcesDropdown } from "@/components/alternative-sources-dropdown"
import { ArticleContent } from "@/components/article-content"
import { EventAISummary } from "@/components/event-ai-summary"
import { EventBiasChart } from "@/components/event-bias-chart"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SimilarNewsArticles } from "@/components/similar-news-articles"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { TrendingUp } from "lucide-react"
import { notFound } from "next/navigation"

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      articles: {
        include: {
          article: {
            include: {
              _count: {
                select: {
                  interactions: true,
                  Bookmark: true,
                  Like: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  // Get the main article (first one) and alternative sources
  const mainArticle = event.articles[0]?.article
  const alternativeSources = event.articles.slice(1).map(ea => ea.article)

  if (!mainArticle) {
    notFound()
  }

  // Get bias data for the main article
  const biasData = mainArticle.aiBiasReport as any || {
    bias: "center",
    biasScores: { left: 0, center: 1, right: 0 }
  }

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
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
                         {/* Event Header */}
             <div className="mb-6">
               <div className="flex items-center gap-2 mb-4">
                 {event.isTrending && (
                   <Badge variant="destructive">
                     <TrendingUp className="w-4 h-4 mr-1" />
                     Trending
                   </Badge>
                 )}
                 <Badge variant="secondary">{event.category}</Badge>
                 {event.topic && (
                   <Badge variant="outline">{event.topic}</Badge>
                 )}
                 <Badge variant="outline">+{alternativeSources.length} sources</Badge>
               </div>
             </div>

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
               aiBiasReport: biasData,
               createdAt: mainArticle.createdAt.toISOString(),
               updatedAt: mainArticle.updatedAt.toISOString()
             }} />

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

                         {/* Alternative Sources Dropdown */}
             <div className="mt-8">
               <AlternativeSourcesDropdown sources={alternativeSources} />
             </div>

            {/* Similar News Articles */}
             <div className="mt-8">
               <SimilarNewsArticles 
                 articles={transformedSimilarArticles}
                 eventTitle={event.title}
               />
             </div>

          </div>

          {/* Sidebar - Bias Chart */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <EventBiasChart biasData={biasData} />

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
