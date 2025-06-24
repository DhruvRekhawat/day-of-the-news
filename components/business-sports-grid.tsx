import Image from "next/image"
import { SimpleBiasIndicator } from "./simple-bias-indicator"

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
              <h2 className="text-2xl font-bold text-gray-900">Business</h2>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
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
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{item.timestamp}</span>
                    <SimpleBiasIndicator bias={item.bias} size="sm" />
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
              <h2 className="text-2xl font-bold text-gray-900">Sports</h2>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
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
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{item.timestamp}</span>
                    <SimpleBiasIndicator bias={item.bias} size="sm" />
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
