import { SimpleBiasIndicator } from "./simple-bias-indicator"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NewsImage } from "./news-image"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  image: string
  timestamp: string
  bias: "left" | "center" | "right"
  category?: string
  excerpt?: string
}

interface SocialAccount {
  name: string
  followers: string
  verified: boolean
}

interface HeroSectionProps {
  recentNews: NewsItem[]
  featuredStories: NewsItem[]
  sidebarNews: NewsItem[]
  socialAccounts: SocialAccount[]
}

export function HeroSection({ recentNews, featuredStories, sidebarNews, socialAccounts }: HeroSectionProps) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-8">
      {/* Left Sidebar - Recent News */}
      <div className="col-span-3">
        <div className="bg-white">
          <h2 className="text-lg font-bold mb-4 text-red-600">RECENT NEWS</h2>
          <div className="space-y-4">
            {recentNews?.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 leading-tight mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                      <SimpleBiasIndicator bias={item.bias} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-6">
        {featuredStories?.[0] && (
          <div className="relative">
            <div className="relative h-96 mb-4">
              <NewsImage
                src={featuredStories[0].image || "/placeholder.png"}
                alt={featuredStories[0].title}
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <Link href={`/article/${featuredStories[0].id}`}>
                  <h1 className="text-2xl font-bold mb-2 leading-tight hover:text-blue-200 transition-colors cursor-pointer">
                    {featuredStories[0].title}
                  </h1>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">{featuredStories[0].timestamp}</span>
                  <SimpleBiasIndicator bias={featuredStories[0].bias} size="md" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Stories */}
        <div className="grid grid-cols-2 gap-4">
          {recentNews?.slice(1, 3).map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative h-48 mb-3">
                <NewsImage
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <Link href={`/article/${item.id}`}>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors cursor-pointer">
                  {item.title}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{item.timestamp}</span>
                <SimpleBiasIndicator bias={item.bias} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="col-span-3">
        {/* Uncovered Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-blue-600">UNCOVERED</h2>
          <p className="text-sm text-gray-600 mb-4">Discover stories that others are missing</p>
          {sidebarNews?.map((item) => (
            <div key={item.id} className="mb-4">
              <div className="relative h-32 mb-2">
                <NewsImage src={item.image || "/placeholder.png"} alt={item.title} className="rounded-lg" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{item.timestamp}</span>
                <SimpleBiasIndicator bias={item.bias} size="sm" />
              </div>
            </div>
          ))}
        </div>

        {/* Social Accounts */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Following</h3>
          <div className="space-y-2">
            {socialAccounts?.map((account) => (
              <div key={account.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <span className="text-sm font-medium">{account.name}</span>
                  {account.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
