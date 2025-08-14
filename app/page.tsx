import { BusinessSportsGrid } from "@/components/business-sports-grid";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { IsraelHamasSection } from "@/components/israel-hamas-section";
import { MoreNewsSection } from "@/components/more-news-section";
import { PoliticsSection } from "@/components/politics-section";
import { StickyCategories } from "@/components/sticky-categories";
import { fetchFromApi } from "@/lib/api-client";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch all data by calling our own API endpoints in parallel

  const [
    recentNews,
    politicsNews,
    globalConflicts,
    businessNews,
    sportsNews,
  ] = await Promise.all([
    fetchFromApi('articles?topic=india'), // Gets general headlines
    fetchFromApi('articles?topic=politics'),
    fetchFromApi('articles?topic=global-conflicts'),
    fetchFromApi('articles?topic=business'),
    fetchFromApi('articles?topic=sports'),
  ]);


  // Use default empty arrays if a fetch fails
  const featuredStories = recentNews?.slice(0, 1) || []; // Pass as an array
  const sidebarNews = recentNews?.slice(1, 3) || [];
  const moreNewsItems = recentNews?.slice(5, 10) || [];
  const socialAccounts = [
    {
      name: "Sports Central",
      followers: "2.5M",
      verified: true,
    },
    {
      name: "Politics Daily",
      followers: "1.8M", 
      verified: true,
    },
    {
      name: "Business News",
      followers: "1.2M",
      verified: true,
    },
    {
      name: "Tech Updates",
      followers: "900K",
      verified: true,
    },
    {
      name: "Entertainment Weekly",
      followers: "3.1M",
      verified: true,
    },
    {
      name: "Science Today",
      followers: "750K",
      verified: true,
    },
    {
      name: "World Affairs",
      followers: "1.5M",
      verified: true,
    }
  ];

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 ">
      <Header />
      <StickyCategories></StickyCategories>
      <main className="container mx-auto px-4 py-6">
        <HeroSection
          recentNews={recentNews || []}
          featuredStories={featuredStories} // Reverted to featuredStories
          sidebarNews={sidebarNews}
          socialAccounts={socialAccounts}
        />

        {politicsNews?.length > 0 && <PoliticsSection news={politicsNews} />}
        {globalConflicts?.length > 0 && <IsraelHamasSection news={globalConflicts} />}
        {(businessNews?.length > 0 || sportsNews?.length > 0) && (
          <BusinessSportsGrid businessNews={businessNews || []} sportsNews={sportsNews || []} />
        )}
        {moreNewsItems?.length > 0 && <MoreNewsSection news={moreNewsItems} />}
      </main>
      <Footer />
    </div>
  );
}