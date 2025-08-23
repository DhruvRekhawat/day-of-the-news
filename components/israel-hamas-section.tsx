import Image from "next/image"
import { BiasBar } from "@/components/ui/BiasBar"

interface NewsItem {
  id: string
  title: string
  image: string
  timestamp: string
  bias: "left" | "center" | "right"
  excerpt?: string
}

interface IsraelHamasSectionProps {
  news: NewsItem[]
}

export function IsraelHamasSection({ news }: IsraelHamasSectionProps) {
  if (!news?.length) return null

  const [mainStory, ...otherStories] = news

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Israel-Hamas Conflict</h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          See all
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Story */}
        {mainStory && (
          <article className="group cursor-pointer">
            <div className="relative h-64 mb-4">
              <Image
                src={mainStory.image || "/placeholder.svg"}
                alt={mainStory.title}
                fill
                className="object-cover  group-hover:scale-105 transition-transform duration-200"
                unoptimized
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-red-600 transition-colors">
              {mainStory.title}
            </h3>
            {mainStory.excerpt && <p className="text-gray-600 dark:text-gray-200 mb-3">{mainStory.excerpt}</p>}
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">
                {mainStory.timestamp}
              </span>
              <BiasBar
                leftPercentage={mainStory.bias === "left" ? 100 : 0}
                centerPercentage={mainStory.bias === "center" ? 100 : 0}
                rightPercentage={mainStory.bias === "right" ? 100 : 0}
                height="h-2"
                className="w-16"
              />
            </div>
          </article>
        )}

        {/* Other Stories */}
        <div className="space-y-4">
          {otherStories.slice(0, 10).map((item) => (
            <article key={item.id} className="flex space-x-4 group cursor-pointer">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover  group-hover:scale-105 transition-transform duration-200"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                  {item.title}
                </h4>
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
