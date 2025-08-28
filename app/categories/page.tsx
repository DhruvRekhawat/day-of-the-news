import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StickyCategories } from "@/components/sticky-categories";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoriesPage() {
  // Get all unique categories
  const categories = await prisma.event.findMany({
    select: {
      category: true,
    },
    where: {
      category: {
        not: null,
      },
    },
    distinct: ['category'],
    orderBy: {
      category: 'asc',
    },
  });

  // Get all unique topics
  const topics = await prisma.event.findMany({
    select: {
      topic: true,
    },
    where: {
      topic: {
        not: null,
      },
    },
    distinct: ['topic'],
    orderBy: {
      topic: 'asc',
    },
  });

  const categoryList = categories.map(c => c.category).filter(Boolean);
  const topicList = topics.map(t => t.topic).filter(Boolean);

  console.log(categoryList);
  console.log(topicList);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <StickyCategories />
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Categories & Topics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse news by categories and topics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories Section */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Categories</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse news by general categories
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryList.map((category) => (
                <Link
                  key={category}
                  href={`/category/${encodeURIComponent(category || '')}`}
                  className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {category}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View all {category?.toLowerCase() || 'category'} news
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Topics Section */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Topics</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse news by specific topics
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topicList.map((topic) => (
                <Link
                  key={topic}
                  href={`/topic/${encodeURIComponent(topic || '')}`}
                  className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {topic}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View all {topic?.toLowerCase() || 'topic'} news
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              href="/category/politics"
              className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              <h3 className="font-semibold text-red-800 dark:text-red-200">Politics</h3>
            </Link>
            <Link
              href="/category/business"
              className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
            >
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Business</h3>
            </Link>
            <Link
              href="/category/sports"
              className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
            >
              <h3 className="font-semibold text-green-800 dark:text-green-200">Sports</h3>
            </Link>
            <Link
              href="/category/technology"
              className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
            >
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Technology</h3>
            </Link>
            <Link
              href="/topic/india"
              className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-lg text-center hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors"
            >
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">India</h3>
            </Link>
            <Link
              href="/topic/global-conflicts"
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Global Conflicts</h3>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
