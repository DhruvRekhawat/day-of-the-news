"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, TrendingUp } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Article {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  image?: string | null
  excerpt: string
}

interface Event {
  id: string
  title: string
  category: string
  topic?: string | null
  isTrending: boolean
  summary?: string | null
  image?: string | null
  publishedAt: string
  articles: Article[]
}

interface EventCardProps {
  event: Event
  showTopic?: boolean
}

export function EventCard({ event, showTopic = true }: EventCardProps) {
  // Get the main article (first one) and alternative sources
  const mainArticle = event.articles[0]
  const alternativeSources = event.articles.slice(1, 4) // Show up to 3 alternative sources

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {event.isTrending && (
                <Badge variant="destructive" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {event.category}
              </Badge>
              {showTopic && event.topic && (
                <Badge variant="outline" className="text-xs">
                  {event.topic}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">
              <Link 
                href={`/article/${mainArticle.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {event.title}
              </Link>
            </CardTitle>
          </div>
          {event.image && (
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Main article */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600">
                {mainArticle.source}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(mainArticle.publishedAt), { addSuffix: true })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-6 px-2"
            >
              <Link href={mainArticle.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {mainArticle.excerpt}
          </p>
        </div>

        {/* Alternative sources */}
        {alternativeSources.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Alternative Sources</span>
              <Badge variant="outline" className="text-xs">
                {alternativeSources.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {alternativeSources.map((article) => (
                <div key={article.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-600 truncate">
                        {article.source}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-1 text-xs">
                      {article.title}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-6 px-2 ml-2"
                  >
                    <Link href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event summary if available */}
        {event.summary && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.summary}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
