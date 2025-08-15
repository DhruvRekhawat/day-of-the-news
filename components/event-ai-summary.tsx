'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface EventAISummaryProps {
  eventId: string
  eventTitle: string
  articles: Array<{
    article: {
      content: string
      excerpt: string
      title: string
    }
  }>
  initialAiSummary?: string | null
}

export function EventAISummary({ eventId, eventTitle, articles, initialAiSummary }: EventAISummaryProps) {
  const [aiSummary, setAiSummary] = useState<string | null>(initialAiSummary || null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateAISummary = async () => {
      if (aiSummary || isGenerating) return

      setIsGenerating(true)
      setError(null)

      try {
        // Call the server-side API to generate AI summary
        const response = await fetch(`/api/events/${eventId}/generate-summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to generate AI summary')
        }

        const data = await response.json()
        
        if (data.success && data.aiSummary) {
          setAiSummary(data.aiSummary)
        } else {
          throw new Error(data.error || 'Failed to generate AI summary')
        }
      } catch (err) {
        console.error('Error generating AI summary:', err)
        setError('Failed to generate AI summary')
      } finally {
        setIsGenerating(false)
      }
    }

    generateAISummary()
  }, [eventId, aiSummary, isGenerating])

  if (isGenerating) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-blue-600 mb-2">AI Summary</h3>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating AI summary...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-red-600 mb-2">AI Summary</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (aiSummary) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-blue-600 mb-2">AI Summary</h3>
        <p className="text-lg text-muted-foreground">{aiSummary}</p>
      </div>
    )
  }

  return null
}
