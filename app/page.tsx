import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { LocalNewsSection } from "@/components/local-news-section"
import { PoliticsSection } from "@/components/politics-section"
import { IsraelHamasSection } from "@/components/israel-hamas-section"
import { BusinessSportsGrid } from "@/components/business-sports-grid"
import { MoreNewsSection } from "@/components/more-news-section"
import { Footer } from "@/components/footer"
import { fetchNewsData } from "@/lib/fetch-news"

export default async function HomePage() {
  // Fetch real news data from EventRegistry API
  const newsData = await fetchNewsData()

  const {
    recentNews,
    featuredStories,
    sidebarNews,
    localNews,
    politicsNews,
    israelConflict,
    businessNews,
    sportsNews,
    moreNewsItems,
    socialAccounts,
  } = newsData

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 ">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <HeroSection
          recentNews={recentNews}
          featuredStories={featuredStories}
          sidebarNews={sidebarNews}
          socialAccounts={socialAccounts}
        />

        {localNews?.length > 0 && <LocalNewsSection news={localNews} />}
        {politicsNews?.length > 0 && <PoliticsSection news={politicsNews} />}
        {israelConflict?.length > 0 && <IsraelHamasSection news={israelConflict} />}
        {(businessNews?.length > 0 || sportsNews?.length > 0) && (
          <BusinessSportsGrid businessNews={businessNews} sportsNews={sportsNews} />
        )}
        {moreNewsItems?.length > 0 && <MoreNewsSection news={moreNewsItems} />}
      </main>
      <Footer />
    </div>
  )
}
