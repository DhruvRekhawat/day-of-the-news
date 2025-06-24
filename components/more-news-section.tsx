import Image from "next/image"
import { Button } from "@/components/ui/button"

interface NewsItem {
  id: string
  title: string
  image: string
  timestamp: string
  category: string
}

interface MoreNewsSectionProps {
  news: NewsItem[]
}

export function MoreNewsSection({ news }: MoreNewsSectionProps) {
  if (!news?.length) return null

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">More News</h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          See all
        </a>
      </div>

      <div className="space-y-4 mb-6">
        {news.map((item) => (
          <article key={item.id} className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover  group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{item.category}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{item.timestamp}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" className="px-8">
          View More News
        </Button>
      </div>
    </section>
  )
}
