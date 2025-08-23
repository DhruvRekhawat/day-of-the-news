import Image from "next/image"
import { BiasBar } from "@/components/ui/BiasBar"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  image: string
  timestamp: string
  bias: "left" | "center" | "right"
  excerpt?: string
}

interface PoliticsSectionProps {
  news: NewsItem[]
}

export function PoliticsSection({ news }: PoliticsSectionProps) {
  if (!news?.length) return null

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Politics</h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          See all
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.map((item) => (
          <article key={item.id} className="group cursor-pointer">
            <div className="relative h-48 mb-3">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover  group-hover:scale-105 transition-transform duration-200"
                unoptimized
              />
            </div>
            <Link href={`/article/${item.id}`}>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer">
                {item.title}
              </h3>
            </Link>
            {item.excerpt && <p className="text-sm text-gray-600 dark:text-gray-200 mb-3 line-clamp-2">{item.excerpt}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {item.timestamp}
              </span>
              <BiasBar
                leftPercentage={item.bias === "left" ? 100 : 0}
                centerPercentage={item.bias === "center" ? 100 : 0}
                rightPercentage={item.bias === "right" ? 100 : 0}
                height="h-1"
                className="w-12"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
