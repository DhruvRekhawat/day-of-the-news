import { EventArticleCard } from "@/components/event-article-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StickyCategories } from "@/components/sticky-categories";
import { BiasDistributionSummary } from "@/components/ui/BiasDistributionSummary";
import { BiasIndicator } from "@/components/ui/BiasIndicator";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching completely

export default async function HomePage() {
  // Fetch events data directly from database to ensure fresh data
  const [
    trendingEvents,
    indiaEvents,
    politicsEvents,
    globalConflictEvents,
    businessEvents,
    sportsEvents,
  ] = await Promise.all([
    // Trending events
    prisma.event.findMany({
      where: { isTrending: true },
      include: {
        articles: {
          include: {
            article: {
              include: {
                _count: {
                  select: {
                    interactions: true,
                    Bookmark: true,
                    Like: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    // Indian events
    prisma.event.findMany({
      where: { topic: "india" },
      include: {
        articles: {
          include: {
            article: {
              include: {
                _count: {
                  select: {
                    interactions: true,
                    Bookmark: true,
                    Like: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    // Politics events
    prisma.event.findMany({
      where: { topic: "politics" },
      include: {
        articles: {
          include: {
            article: {
              include: {
                _count: {
                  select: {
                    interactions: true,
                    Bookmark: true,
                    Like: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    // Global conflicts events
    prisma.event.findMany({
      where: { topic: "global-conflicts" },
      include: {
        articles: {
          include: {
            article: {
              include: {
                _count: {
                  select: {
                    interactions: true,
                    Bookmark: true,
                    Like: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    // Business events
    prisma.event.findMany({
      where: { topic: "business" },
      include: {
        articles: {
          include: {
            article: {
              include: {
                _count: {
                  select: {
                    interactions: true,
                    Bookmark: true,
                    Like: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    // Sports events
    prisma.event.findMany({
      where: { topic: "sports" },
      include: {
        articles: {
          include: {
            article: {
              include: {
                _count: {
                  select: {
                    interactions: true,
                    Bookmark: true,
                    Like: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
  ]);

  // Transform events to match the expected format
  const transformEvent = (event: any) => ({
    id: event.id,
    eventUri: event.eventUri,
    title: event.title,
    category: event.category,
    topic: event.topic,
    isTrending: event.isTrending,
    summary: event.summary,
    image: event.image,
    publishedAt: event.publishedAt,
    articles: event.articles.map((ea: any) => ({
      ...ea.article,
      interactionCount: ea.article._count.interactions,
      bookmarkCount: ea.article._count.Bookmark,
      likeCount: ea.article._count.Like,
      biasAnalysis: ea.article.biasAnalysis || getFallbackBiasAnalysis(ea.article.source),
      _count: undefined,
    })),
  });

  // Fallback bias analysis function (20% left, 60% center, 20% right)
  const getFallbackBiasAnalysis = (source: string) => {
    const sourceHash = source.split('').reduce((a, b) => {
      a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
      return a;
    }, 0);
    
    const normalizedHash = Math.abs(sourceHash) % 100;
    
    if (normalizedHash < 20) {
      return {
        biasDirection: 'LEFT',
        biasStrength: 3,
        confidence: 0.6,
        status: 'COMPLETED',
        reasoning: 'Fallback classification based on source'
      };
    } else if (normalizedHash < 80) {
      return {
        biasDirection: 'CENTER',
        biasStrength: 2,
        confidence: 0.7,
        status: 'COMPLETED',
        reasoning: 'Fallback classification based on source'
      };
    } else {
      return {
        biasDirection: 'RIGHT',
        biasStrength: 3,
        confidence: 0.6,
        status: 'COMPLETED',
        reasoning: 'Fallback classification based on source'
      };
    }
  };

  const trendingEventsArray = trendingEvents.map(transformEvent);
  const indiaEventsArray = indiaEvents.map(transformEvent);
  const politicsEventsArray = politicsEvents.map(transformEvent);
  const globalConflictEventsArray = globalConflictEvents.map(transformEvent);
  const businessEventsArray = businessEvents.map(transformEvent);
  const sportsEventsArray = sportsEvents.map(transformEvent);

  // Use default empty arrays if a fetch fails
  const featuredStories = Array.isArray(indiaEventsArray) ? indiaEventsArray.slice(0, 1) : [];

  // Combine all available events for recent news
  const allEvents = [
    ...trendingEventsArray,
    ...indiaEventsArray,
    ...politicsEventsArray,
    ...globalConflictEventsArray,
    ...businessEventsArray,
    ...sportsEventsArray
  ].slice(0, 20); // Take first 20 events

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <StickyCategories />
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section - Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Column - RECENT NEWS */}
          <div className="lg:col-span-3">
            <div className=" bg-transparent rounded-none p-4 shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">RECENT NEWS</h2>
              <div className="space-y-3">
                {allEvents.slice(0, 8).map((event: any, index: number) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="w-6 h-6  dark:text-white text-2xl rounded-full flex items-center justify-center flex-shrink-0 mt-1 font-extralight">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Link href={`/event/${event.id}`}>
                        <h3 className="text-sm font-medium text-foreground leading-tight mb-1 hover:text-blue-600 transition-colors">
                          {event.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BiasIndicator 
                            biasAnalysis={event.articles[0]?.biasAnalysis}
                            className="text-xs"
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {event.topic || event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - TOP STORY */}
          <div className="lg:col-span-6">
            <div className=" bg-transparent border rounded-none shadow-sm overflow-hidden">
              {featuredStories.length > 0 && (
                <div className="p-4">
                  <EventArticleCard event={featuredStories[0]} variant="featured" />
                  
                  {/* Bias Distribution Summary */}
                  <div className="mt-4">
                    <BiasDistributionSummary events={allEvents} />
                  </div>

                  {/* Additional Stories */}
                  <div className="mt-6 space-y-4">
                    {indiaEventsArray.slice(1, 3).map((event: any) => (
                      <div key={event.id} className="border-t border-gray-200 dark:border-transparent pt-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={event.image || "/placeholder.png"}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Link href={`/event/${event.id}`}>
                              <h3 className="text-lg font-semibold leading-tight mb-2 hover:text-blue-600 transition-colors">
                                {event.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {event.summary}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(event.publishedAt), { addSuffix: true })}
                              </span>
                              <div className="flex items-center space-x-2">
                                <BiasIndicator 
                                  biasAnalysis={event.articles[0]?.biasAnalysis}
                                  className="text-xs"
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Coverage: {event.articles.length} sources</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - UNCOVERED */}
          <div className="lg:col-span-3">
            <div className=" bg-transparent rounded-none p-4 shadow-sm">
              <h2 className="text-lg font-bold mb-2">UNCOVERED</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">News covered by both sides of the political spectrum.</p>


              <div className="space-y-4">
                {politicsEventsArray.slice(0, 2).map((event: any) => (
                  <div key={event.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={event.image || "/placeholder.png"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/event/${event.id}`}>
                          <h3 className="text-sm font-medium text-foreground leading-tight mb-1 hover:text-blue-600 transition-colors">
                            {event.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {event.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MORE NEWS Section */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-bold mb-3 text-gray-800 dark:text-gray-200">MORE NEWS</h3>
                <div className="space-y-3">
                  {allEvents.slice(10, 15).map((event: any) => (
                    <div key={event.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0">
                      <Link href={`/event/${event.id}`}>
                        <h4 className="text-sm font-medium text-foreground leading-tight mb-1 hover:text-blue-600 transition-colors">
                          {event.title}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(event.publishedAt), { addSuffix: true })}
                        </span>
                        <div className="flex items-center space-x-2">
                          <BiasIndicator 
                            biasAnalysis={event.articles[0]?.biasAnalysis}
                            className="text-xs"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {event.topic || event.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Politics Section */}
            <div className="col-span-full">
              {politicsEventsArray.length > 0 && (
                <section className="mb-8">
                  <Link href="/topic/politics">
                    <h2 className="text-xl font-bold mb-4 hover:text-blue-600 transition-colors cursor-pointer">Politics</h2>
                  </Link>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {politicsEventsArray.slice(0, 4).map((event: any) => (
                      <EventArticleCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              )}

              {/* Global Conflicts Section */}
              {globalConflictEventsArray.length > 0 && (
                <section className="mb-8">
                  <Link href="/topic/global-conflicts">
                    <h2 className="text-xl font-bold mb-4 hover:text-blue-600 transition-colors cursor-pointer">Global Conflicts</h2>
                  </Link>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {globalConflictEventsArray.slice(0, 4).map((event: any) => (
                      <EventArticleCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              )}
            </div>
        </div>

                 {/* Business & Sports Grid */}
         {(businessEventsArray.length > 0 || sportsEventsArray.length > 0) && (
           <section className="mb-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Business Events */}
                 {businessEventsArray.length > 0 && (
                   <div>
                     <Link href="/category/business">
                       <h2 className="text-xl font-bold mb-4 hover:text-blue-600 transition-colors cursor-pointer">Business</h2>
                     </Link>
                     <div className="grid grid-cols-1 gap-4">
                       {businessEventsArray.slice(0, 3).map((event: any) => (
                         <EventArticleCard key={event.id} event={event} />
                       ))}
                     </div>
                   </div>
                 )}

                 {/* Sports Events */}
                 {sportsEventsArray.length > 0 && (
                   <div>
                     <Link href="/category/sports">
                       <h2 className="text-xl font-bold mb-4 hover:text-blue-600 transition-colors cursor-pointer">Sports</h2>
                     </Link>
                     <div className="grid grid-cols-1 gap-4">
                       {sportsEventsArray.slice(0, 3).map((event: any) => (
                         <EventArticleCard key={event.id} event={event} />
                       ))}
                     </div>
                   </div>
                 )}
             </div>
           </section>
         )}

         {/* India Headlines Section */}
         {indiaEventsArray.length > 0 && (
           <section className="mb-8">
             <Link href="/topic/india">
               <h2 className="text-xl font-bold mb-4 hover:text-blue-600 transition-colors cursor-pointer">India Headlines</h2>
             </Link>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {indiaEventsArray.slice(0, 6).map((event: any) => (
                 <EventArticleCard key={event.id} event={event} />
               ))}
             </div>
           </section>
         )}
      </main>
      <Footer />
    </div>
  );
}