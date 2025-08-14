"use client"

import { useEffect, useState } from "react"
import { EventCard } from "./event-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

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

interface EventsGridProps {
  topic?: string
  trending?: boolean
  limit?: number
  showTopic?: boolean
}

export function EventsGrid({ 
  topic, 
  trending = false, 
  limit = 20, 
  showTopic = true 
}: EventsGridProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const fetchEvents = async (reset = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: reset ? "0" : offset.toString(),
      })

      if (topic) {
        params.append("topic", topic)
      }

      if (trending) {
        params.append("trending", "true")
      }

      const response = await fetch(`/api/events?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()
      
      if (reset) {
        setEvents(data.events)
        setOffset(limit)
      } else {
        setEvents(prev => [...prev, ...data.events])
        setOffset(prev => prev + limit)
      }

      setHasMore(data.events.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents(true)
  }, [topic, trending])

  const loadMore = () => {
    fetchEvents(false)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchEvents(true)} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No events found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            showTopic={showTopic}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button 
            onClick={loadMore} 
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
