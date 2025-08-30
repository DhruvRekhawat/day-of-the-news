"use client"

import { useEffect, useState } from "react"

interface Topic {
  id: string
  name: string
  slug: string
  articleCount: number
}

export default function TestTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics/all')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTopics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch topics')
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Loading topics...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Topics in Database</h1>
      <p className="text-gray-600 mb-6">Total topics: {topics.length}</p>
      
      {topics.length === 0 ? (
        <p className="text-gray-500">No topics found in the database.</p>
      ) : (
        <div className="grid gap-4">
          {topics.map((topic) => (
            <div key={topic.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{topic.name}</h3>
              <p className="text-sm text-gray-600">Slug: {topic.slug}</p>
              <p className="text-sm text-gray-600">Articles: {topic.articleCount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
