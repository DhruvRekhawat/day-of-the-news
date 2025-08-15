import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleContent } from "@/components/article-content"
import { RelatedArticles } from "@/components/related-articles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, TrendingUp } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { EventAISummary } from "@/components/event-ai-summary"

interface EventPageProps {
  params: { id: string }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
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
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              <EventAISummary
                eventId={event.id}
                eventTitle={event.title}
                articles={event.articles}
                initialAiSummary={event.aiSummary}
              />
              {event.summary && !event.aiSummary && (
                <p className="text-lg text-muted-foreground mb-4">{event.summary}</p>
              )}
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
              aiBiasReport: mainArticle.aiBiasReport as any || {
                bias: "center",
                biasScores: { left: 0, center: 1, right: 0 }
              },
              createdAt: mainArticle.createdAt.toISOString(),
              updatedAt: mainArticle.updatedAt.toISOString()
            }} />
          </div>

          {/* Sidebar - Alternative Sources */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h2 className="text-xl font-bold mb-4">Alternative Sources</h2>
              <div className="space-y-4">
                {alternativeSources.map((article) => (
                  <div key={article.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm leading-tight">
                        <Link 
                          href={`/article/${article.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-6 px-2 flex-shrink-0"
                      >
                        <Link href={article.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-blue-600">{article.source}</span>
                      <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))}
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles - TODO: Implement related articles fetching */}
        {/* <div className="mt-12">
          <RelatedArticles currentArticleId={mainArticle.id} />
        </div> */}
      </main>
      <Footer />
    </div>
  )
}
