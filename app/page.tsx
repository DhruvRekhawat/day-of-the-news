import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StickyCategories } from "@/components/sticky-categories";
import { EventsGrid } from "@/components/events-grid";
import { fetchFromApi } from "@/lib/api-client";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch events data by calling our own API endpoints in parallel
  const [
    trendingEvents,
    indiaEvents,
    politicsEvents,
    globalConflictEvents,
    businessEvents,
    sportsEvents,
  ] = await Promise.all([
    fetchFromApi('events?trending=true&limit=6'), // Trending events
    fetchFromApi('events?topic=india&limit=6'), // Indian events
    fetchFromApi('events?topic=politics&limit=6'),
    fetchFromApi('events?topic=global-conflicts&limit=6'),
    fetchFromApi('events?topic=business&limit=6'),
    fetchFromApi('events?topic=sports&limit=6'),
  ]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <StickyCategories />
      <main className="container mx-auto px-4 py-6">
        {/* Trending Events Section */}
        {trendingEvents?.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Trending Stories</h2>
              <p className="text-muted-foreground">
                Multiple perspectives on today&apos;s top stories
              </p>
            </div>
            <EventsGrid trending={true} limit={6} showTopic={false} />
          </section>
        )}

        {/* Indian Events Section */}
        {indiaEvents?.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">India Headlines</h2>
              <p className="text-muted-foreground">
                Latest news from India with multiple sources
              </p>
            </div>
            <EventsGrid topic="india" limit={6} />
          </section>
        )}

        {/* Politics Events Section */}
        {politicsEvents?.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Politics</h2>
              <p className="text-muted-foreground">
                Political news from various perspectives
              </p>
            </div>
            <EventsGrid topic="politics" limit={6} />
          </section>
        )}

        {/* Global Conflicts Events Section */}
        {globalConflictEvents?.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Global Conflicts</h2>
              <p className="text-muted-foreground">
                International conflict coverage from multiple sources
              </p>
            </div>
            <EventsGrid topic="global-conflicts" limit={6} />
          </section>
        )}

        {/* Business & Sports Grid */}
        {(businessEvents?.length > 0 || sportsEvents?.length > 0) && (
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Business Events */}
              {businessEvents?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Business</h2>
                    <p className="text-muted-foreground">
                      Business news with multiple sources
                    </p>
                  </div>
                  <EventsGrid topic="business" limit={3} />
                </div>
              )}

              {/* Sports Events */}
              {sportsEvents?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Sports</h2>
                    <p className="text-muted-foreground">
                      Sports coverage from various outlets
                    </p>
                  </div>
                  <EventsGrid topic="sports" limit={3} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* More Events Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">More Stories</h2>
            <p className="text-muted-foreground">
              Additional news with multiple perspectives
            </p>
          </div>
          <EventsGrid limit={12} />
        </section>
      </main>
      <Footer />
    </div>
  );
}