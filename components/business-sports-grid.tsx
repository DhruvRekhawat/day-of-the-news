import Image from "next/image"
import { BiasBar } from "@/components/ui/BiasBar"

interface NewsItem {
  id: string
  title: string
  image: string
  timestamp: string
  bias: "left" | "center" | "right"
}

interface BusinessSportsGridProps {
  businessNews: NewsItem[]
  sportsNews: NewsItem[]
}

export function BusinessSportsGrid({ businessNews, sportsNews }: BusinessSportsGridProps) {
  if (!businessNews?.length && !sportsNews?.length) return null

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Section */}
        {businessNews?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Business</h2>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                See all
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessNews.map((item) => (
                <article key={item.id} className="group cursor-pointer">
                  <div className="relative h-32 mb-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
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
          </div>
        )}

        {/* Sports Section */}
        {sportsNews?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Sports</h2>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                See all
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sportsNews.map((item) => (
                <article key={item.id} className="group cursor-pointer">
                  <div className="relative h-32 mb-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
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
          </div>
        )}
      </div>
    </section>
  )
}
