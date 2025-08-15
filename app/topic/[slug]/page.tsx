import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StickyCategories } from "@/components/sticky-categories";
import { EventArticleCard } from "@/components/event-article-card";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TopicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  
  // Decode the slug (handle URL encoding)
  const topic = decodeURIComponent(slug);
  
  // Fetch events for this topic
  const events = await prisma.event.findMany({
    where: { 
      topic: {
        equals: topic,
        mode: 'insensitive' // Case insensitive search
      }
    },
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
    take: 50, // Get more events for topic page
  });

  if (events.length === 0) {
    notFound();
  }

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
      _count: undefined,
    })),
  });

  const eventsArray = events.map(transformEvent);

  // Get featured story (first event)
  const featuredStory = eventsArray[0];
  const remainingEvents = eventsArray.slice(1);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <StickyCategories />
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 capitalize">{topic} News</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Latest news and updates about {topic.toLowerCase()} from multiple sources
          </p>
        </div>

        {/* Hero Section - Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Column - RECENT NEWS */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">RECENT {topic.toUpperCase()}</h2>
              <div className="space-y-3">
                {eventsArray.slice(0, 10).map((event: any, index: number) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 dark:bg-red-400 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <a href={`/event/${event.id}`}>
                        <h3 className="text-sm font-medium text-foreground leading-tight mb-1 hover:text-blue-600 transition-colors">
                          {event.title}
                        </h3>
                      </a>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">65%R</span>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <h2 className="text-lg font-bold mb-4 p-4 pb-0">TOP STORY</h2>
              {featuredStory && (
                <div className="p-4">
                  <EventArticleCard event={featuredStory} variant="featured" />
                  
                  {/* Bias Breakdown */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Coverage Bias</span>
                    </div>
                    <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '22%' }}></div>
                      <div className="h-full bg-gray-300" style={{ width: '28%' }}></div>
                      <div className="h-full bg-blue-500" style={{ width: '40%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-red-600">Left 22%</span>
                      <span className="text-gray-600">Center 28%</span>
                      <span className="text-blue-600">Right 40%</span>
                    </div>
                  </div>

                  {/* Additional Stories */}
                  <div className="mt-6 space-y-4">
                    {remainingEvents.slice(0, 2).map((event: any) => (
                      <div key={event.id} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={event.image || "/placeholder.png"}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <a href={`/event/${event.id}`}>
                              <h3 className="text-lg font-semibold leading-tight mb-2 hover:text-blue-600 transition-colors">
                                {event.title}
                              </h3>
                            </a>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {event.summary}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(event.publishedAt), { addSuffix: true })}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">24% Right</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Coverage: 14 sources</span>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-bold mb-2">UNCOVERED</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">News covered by both sides of the political spectrum.</p>
              
              {/* Coverage Balance Bar */}
              <div className="mb-4">
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '33%' }}></div>
                  <div className="h-full bg-gray-300" style={{ width: '34%' }}></div>
                  <div className="h-full bg-green-500" style={{ width: '33%' }}></div>
                </div>
              </div>

              <div className="space-y-4">
                {eventsArray.slice(2, 4).map((event: any) => (
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
                        <a href={`/event/${event.id}`}>
                          <h3 className="text-sm font-medium text-foreground leading-tight mb-1 hover:text-blue-600 transition-colors">
                            {event.title}
                          </h3>
                        </a>
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
                  {eventsArray.slice(10, 15).map((event: any) => (
                    <div key={event.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0">
                      <a href={`/event/${event.id}`}>
                        <h4 className="text-sm font-medium text-foreground leading-tight mb-1 hover:text-blue-600 transition-colors">
                          {event.title}
                        </h4>
                      </a>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(event.publishedAt), { addSuffix: true })}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {event.topic || event.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="col-span-1 lg:col-span-9">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">All {topic} News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {remainingEvents.slice(2).map((event: any) => (
                  <EventArticleCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
