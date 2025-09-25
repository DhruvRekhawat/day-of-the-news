import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { fetchFromApi } from "@/lib/api-client";
import { UsageLimitNotifier } from "@/components/ussage-limit-notifier";
import { ArticleContent } from "@/components/article-content";
import { BiasReport } from "@/components/bias-report";
import { RelatedArticles } from "@/components/related-articles";
import { RelatedTopics } from "@/components/related-topics";
import type { Metadata } from "next";

// This is the standard and correct way to type the props for this page.
interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the article page
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const article = await fetchFromApi(`articles?id=${id}`);
    
    if (!article || article.error) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      }
    }

    const description = article.description || article.title || 'Read this article with bias analysis and fact-checking from Day of the News.';
    
    return {
      title: article.title,
      description: description.length > 160 ? description.substring(0, 157) + '...' : description,
      keywords: [article.category, article.topic, 'news', 'bias analysis', 'fact checking'].filter(Boolean),
      openGraph: {
        title: article.title,
        description: description,
        type: 'article',
        url: `https://dayofthenews.com/article/${id}`,
        images: article.image ? [
          {
            url: article.image,
            width: 1200,
            height: 630,
            alt: article.title,
          }
        ] : undefined,
        publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
        authors: article.author ? [article.author] : undefined,
        siteName: 'Day of the News',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: description,
        images: article.image ? [article.image] : undefined,
      },
      alternates: {
        canonical: `https://dayofthenews.com/article/${id}`,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { id } = await params;

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
  const relatedArticles = await fetchFromApi("articles");
  const filteredRelated =
    relatedArticles?.filter((a: any) => a.id !== article.id) || [];

  // Generate structured data for the article
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description || article.title,
    "image": article.image ? [article.image] : undefined,
    "datePublished": article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString(),
    "dateModified": article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": article.author || "Day of the News"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Day of the News",
      "logo": {
        "@type": "ImageObject",
        "url": "https://dayofthenews.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://dayofthenews.com/article/${id}`
    },
    "articleSection": article.category || "News",
    "keywords": [article.category, article.topic, "news", "bias analysis"].filter(Boolean).join(", "),
    "about": [
      {
        "@type": "Thing",
        "name": article.category || "News"
      }
    ]
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="col-span-1 lg:col-span-8">
            <ArticleContent article={article} />
            {filteredRelated.length > 0 && (
              <RelatedArticles articles={filteredRelated} />
            )}
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