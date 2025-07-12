import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { fetchFromApi } from "@/lib/api-client";
import { UsageLimitNotifier } from "@/components/ussage-limit-notifier"; 
import { ArticleContent } from "@/components/article-content";
import { BiasReport } from "@/components/bias-report";
import { RelatedArticles } from "@/components/related-articles";
import { RelatedTopics } from "@/components/related-topics";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Fetch data from your API
  const article = await fetchFromApi(`articles?id=${id}`);
  
  // Render the notifier component if the API returns a usage limit error
  if (article?.error) {
    return (
      <div className="min-h-screen text-gray-900 dark:text-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <UsageLimitNotifier limit={article.limit} />
        </main>
        <Footer />
      </div>
    );
  }
  
  // Trigger 404 if the article isn't found for any other reason
  if (!article) {
    notFound();
  }
  
  // Fetch related articles only if the main article was successfully fetched
  const relatedArticles = await fetchFromApi('articles');
  const filteredRelated = relatedArticles?.filter((a: any) => a.id !== article.id) || [];

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="col-span-1 lg:col-span-8">
            <ArticleContent article={article} />
            {filteredRelated.length > 0 && <RelatedArticles articles={filteredRelated} />}
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
  );
}