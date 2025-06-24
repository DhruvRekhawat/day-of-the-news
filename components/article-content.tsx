import { SimpleBiasIndicator } from "./simple-bias-indicator"
import { Button } from "@/components/ui/button"
import { Share2, Bookmark, MessageCircle, ThumbsUp } from "lucide-react"

interface Article {
  id: string
  title: string
  content: string
  image?: string
  timestamp: string
  bias: "left" | "center" | "right"
  source: string
  url: string
  author?: string
  category: string
  biasScores: {
    left: number
    center: number
    right: number
  }
}

interface ArticleContentProps {
  article: Article
}

export function ArticleContent({ article }: ArticleContentProps) {
  const formatContent = (content: string) => {
    // Split content into bullet points if it contains bullet-like formatting
    const sentences = content.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0)
    return sentences.map((sentence) => sentence.trim()).filter((s) => s.length > 20)
  }

  const contentPoints = formatContent(article.content)

  return (
    <article className="bg-white">
      {/* Article Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

        {/* Bias Indicators */}
        <div className="flex items-center space-x-8 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">LEFT</span>
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{article.biasScores.left}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">CENTER</span>
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{article.biasScores.center}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">RIGHT</span>
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{article.biasScores.right}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-auto">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose max-w-none">
        {contentPoints.length > 0 ? (
          <ul className="space-y-4">
            {contentPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-800 leading-relaxed">{point}.</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">{article.content}</div>
        )}
      </div>

      {/* Article Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Source: {article.source}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{article.timestamp}</span>
            {article.author && (
              <>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">By {article.author}</span>
              </>
            )}
          </div>
          <SimpleBiasIndicator bias={article.bias} size="md" />
        </div>
      </div>
    </article>
  )
}
