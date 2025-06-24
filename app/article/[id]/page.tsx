import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleContent } from "@/components/article-content"
import { BiasReport } from "@/components/bias-report"
import { RelatedArticles } from "@/components/related-articles"
import { RelatedTopics } from "@/components/related-topics"
import { fetchArticleById, fetchRelatedArticles } from "@/lib/fetch-news"
import { notFound } from "next/navigation"

interface ArticlePageProps {
  params: {
    id: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    // Fetch the main article and related articles
    const [article, relatedArticles] = await Promise.all([fetchArticleById(params.id), fetchRelatedArticles(params.id)])

    if (!article) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Main Article Content */}
            <div className="col-span-8">
              <ArticleContent article={article} />
              {relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles} />}
            </div>

            {/* Right Sidebar */}
            <div className="col-span-4">
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
    console.error("Error loading article:", error)
    notFound()
  }
}
