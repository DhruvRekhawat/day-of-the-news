"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, TrendingUp } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { BiasIndicator } from "@/components/ui/BiasIndicator"
import { BiasAnalysisStatus, BiasDirection } from "@/lib/generated/prisma"

interface Article {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  image?: string | null
  excerpt: string
  category: string
  biasAnalysis?: {
    biasDirection: BiasDirection
    biasStrength: number
    confidence: number
    status: BiasAnalysisStatus
    reasoning?: string
  } | null
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

interface EventArticleCardProps {
  event: Event
  showTopic?: boolean
  variant?: "default" | "featured" | "sidebar"
}

export function EventArticleCard({ event, showTopic = true, variant = "default" }: EventArticleCardProps) {
  // Get the main article (first one) - this is what we display as the "article"
  const mainArticle = event.articles[0]
  const alternativeSourcesCount = event.articles.length - 1

  if (variant === "sidebar") {
    return (
      <div className="border-b border-border pb-4 last:border-b-0">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            <Link href={`/event/${event.id}`}>
              <h3 className="text-sm font-medium text-foreground leading-tight mb-2">
                {event.title}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(event.publishedAt), { addSuffix: true })}
              </span>
              <div className="flex items-center space-x-2">
                <BiasIndicator 
                  biasAnalysis={mainArticle.biasAnalysis}
                  className="text-xs"
                />
                {alternativeSourcesCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{alternativeSourcesCount} sources
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "featured") {
    return (
      <div className="relative">
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-clip">
          <img
            src={event.image || mainArticle.image || "/placeholder.png"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <Link href={`/event/${event.id}`}>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 leading-tight hover:text-blue-200 transition-colors cursor-pointer">
                {event.title}
              </h1>
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">
                {formatDistanceToNow(new Date(event.publishedAt), { addSuffix: true })}
              </span>
              <div className="flex items-center space-x-2">
                <BiasIndicator 
                  biasAnalysis={mainArticle.biasAnalysis}
                  className="text-xs"
                />
                {alternativeSourcesCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    +{alternativeSourcesCount} sources
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
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
              {alternativeSourcesCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{alternativeSourcesCount} sources
                </Badge>
              )}
            </div>
            <Link href={`/event/${event.id}`}>
              <h3 className="text-lg font-semibold leading-tight hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
            </Link>
          </div>
          {(event.image || mainArticle.image) && (
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={event.image || mainArticle.image || ""}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600">
                {mainArticle.source}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(mainArticle.publishedAt), { addSuffix: true })}
              </span>
              <BiasIndicator 
                biasAnalysis={mainArticle.biasAnalysis}
                className="text-xs"
              />
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
            {event.summary || mainArticle.excerpt}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
