import { SimpleBiasIndicator } from "./simple-bias-indicator"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Left Sidebar - Recent News - Hidden on mobile, shown on large screens */}
      <div className="hidden lg:block lg:col-span-3">
        <div className="">
          <h2 className="text-lg font-bold mb-4 text-red-600">RECENT NEWS</h2>
          <div className="space-y-4">
            {recentNews?.slice(0, 10).map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight mb-2">{item.title}</h3>
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
      <div className="col-span-1 lg:col-span-6">
        {featuredStories?.[0] && (
          <div className="relative mb-6">
            <div className="relative h-64 sm:h-80 lg:h-96 overflow-clip">
              <img
                src={featuredStories[0].image || "/placeholder.png"}
                alt={featuredStories[0].title}
                className=" h-64 sm:h-80 lg:h-96"
                
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent " />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <Link href={`/article/${featuredStories[0].id}`}>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 leading-tight hover:text-blue-200 transition-colors cursor-pointer">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 lg:mb-0">
          {recentNews?.slice(1, 3).map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative h-40 sm:h-48 mb-3 overflow-clip">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <Link href={`/article/${item.id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-red-600 transition-colors cursor-pointer text-sm sm:text-base">
                  {item.title}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-500">{item.timestamp}</span>
                <SimpleBiasIndicator bias={item.bias} size="sm" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent News for Mobile - Show below main content on small screens */}
        <div className="block lg:hidden mt-8">
          <h2 className="text-lg font-bold mb-4 text-red-600">RECENT NEWS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentNews?.slice(3, 7).map((item) => (
              <div key={item.id} className="border border-gray-100  p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight mb-2">{item.title}</h3>
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

      {/* Right Sidebar */}
      <div className="col-span-1 lg:col-span-3 mt-8 lg:mt-0">
        {/* Uncovered Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 text-blue-600">UNCOVERED</h2>
          <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">Discover stories that others are missing</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {sidebarNews?.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="relative h-32 mb-2 overflow-clip grid place-items-center">
                  <img src={item.image || "/placeholder.png"} alt={item.title} className=" object-cover "/>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.timestamp}</span>
                  <SimpleBiasIndicator bias={item.bias} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Accounts */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Following</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            {socialAccounts?.map((account) => (
              <div key={account.name} className="flex items-center justify-between p-2 hover:bg-gray-50 ">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <span className="text-sm font-medium truncate">{account.name}</span>
                  {account.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
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
