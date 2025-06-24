import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleContent } from "@/components/article-content"
import { BiasReport } from "@/components/bias-report"
import { RelatedArticles } from "@/components/related-articles"
import { RelatedTopics } from "@/components/related-topics"
import { fetchArticleById, fetchRelatedArticles } from "@/lib/fetch-news"
import { notFound } from "next/navigation"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const { id } = await params

    const [article, relatedArticles] = await Promise.all([
      fetchArticleById(id),
      fetchRelatedArticles(id),
    ])

    console.log("✅ Article fetched:", article ? "Yes" : "No")
    console.log("🧩 Related articles count:", relatedArticles.length)

    if (!article) {
      console.warn("❌ Article is null, triggering 404")
      notFound()
    }

    return (
      <div className="min-h-screen text-gray-900 dark:text-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="col-span-1 lg:col-span-8">
              <ArticleContent article={article} />
              {relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles} />}
            </div>
            <div className="col-span-1 lg:col-span-4 mt-8 lg:mt-0">
              <div className="space-y-6">
                <BiasReport article={article} />
                <RelatedTopics />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error in ArticlePage:", error)
    notFound()
  }
}
