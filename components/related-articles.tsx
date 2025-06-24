import Image from "next/image"
import Link from "next/link"
import { SimpleBiasIndicator } from "./simple-bias-indicator"

interface RelatedArticle {
  id: string
  title: string
  image?: string
  timestamp: string
  source: string
  bias: "left" | "center" | "right"
  excerpt?: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles.length) return null

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">24</span>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-200">Show all 24 sources</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>AI Generated Text</span>
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <article key={article.id} className="flex space-x-4 group">
            <div className="relative w-32 h-24 flex-shrink-0">
              <Image
                src={article.image || "/placeholder.svg?height=96&width=128"}
                alt={article.title}
                fill
                className="object-cover  group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex-1">
              <Link href={`/article/${article.id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </Link>
              {article.excerpt && <p className="text-sm text-gray-600 dark:text-gray-200 mb-3 line-clamp-2">{article.excerpt}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{article.source}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{article.timestamp}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SimpleBiasIndicator bias={article.bias} size="sm" />
                  <Link
                    href={`/article/${article.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
