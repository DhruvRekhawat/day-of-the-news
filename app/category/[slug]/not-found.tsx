import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StickyCategories } from "@/components/sticky-categories";
import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <StickyCategories />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              The category you&apos;re looking for doesn&apos;t exist or has no news articles.
            </p>
            <div className="space-y-4">
              <Link 
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Homepage
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Try browsing our main categories:</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  <Link href="/category/politics" className="text-blue-600 hover:underline">Politics</Link>
                  <Link href="/category/business" className="text-blue-600 hover:underline">Business</Link>
                  <Link href="/category/sports" className="text-blue-600 hover:underline">Sports</Link>
                  <Link href="/category/technology" className="text-blue-600 hover:underline">Technology</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
