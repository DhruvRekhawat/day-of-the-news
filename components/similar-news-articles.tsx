import Image from "next/image";
import Link from "next/link";
import { BiasBar } from "@/components/ui/BiasBar";
import { formatDistanceToNow } from "date-fns";

interface SimilarArticle {
  id: string;
  title: string;
  image?: string;
  publishedAt: Date;
  source: string;
  bias: "left" | "center" | "right";
  excerpt?: string;
  url: string;
}

interface SimilarNewsArticlesProps {
  articles: SimilarArticle[];
  eventTitle: string;
}

export function SimilarNewsArticles({ articles }: SimilarNewsArticlesProps) {
  if (!articles.length) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Similar News Articles
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>AI Generated</span>
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative h-48">
              <Image
                src={article.image || "/placeholder.png"}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4">
              <Link href={`/article/${article.id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </Link>
              {article.excerpt && (
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </span>
                <BiasBar
                  leftPercentage={article.bias === "left" ? 100 : 0}
                  centerPercentage={article.bias === "center" ? 100 : 0}
                  rightPercentage={article.bias === "right" ? 100 : 0}
                  height="h-1"
                  className="w-12"
                />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={`/article/${article.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read Full Article →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

