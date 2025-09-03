"use client"

import { EventActions } from "@/components/event-actions";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { SocialShare } from "./social-share";

interface BiasAnalysis {
  bias: "left" | "center" | "right";
  biasScores: {
    left: number;
    center: number;
    right: number;
  };
}

interface Article {
  id: string;
  originalUri: string;
  title: string;
  content: string;
  excerpt: string;
  url: string;
  image: string;
  source: string;
  category: string;
  publishedAt: string;
  aiSummary: string;
  aiBiasReport: BiasAnalysis;
  createdAt: string;
  updatedAt: string;
}

interface ArticleContentProps {
  article: Article;
  aggregatedBiasScores?: {
    left: number;
    center: number;
    right: number;
  };
  eventHeader?: {
    isTrending?: boolean;
    category: string;
    topic?: string;
    alternativeSourcesCount: number;
    eventId: string;
    initialBookmarkCount: number;
    initialLikeCount: number;
  };
}

export function ArticleContent({ article, eventHeader }: ArticleContentProps) {
  const formatContent = (content: string) => {
    // Split content into bullet points if it contains bullet-like formatting
    const sentences = content
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0);
    return sentences
      .map((sentence) => sentence.trim())
      .filter((s) => s.length > 20);
  };

  const contentPoints = formatContent(article.aiSummary);

  // // Extract bias data with fallbacks
  // const biasData = article.aiBiasReport || {
  //   bias: "center",
  //   biasScores: { left: 0, center: 1, right: 0 },
  // };

  console.log(article);

  return (
    <article>
      {/* Article Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight font-mono">
          {article.title}
        </h1>
        {/* Event Header */}
        {eventHeader && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {eventHeader.isTrending && (
                  <Badge variant="destructive">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Trending
                  </Badge>
                )}
                <Badge variant="secondary">{eventHeader.category}</Badge>
                {eventHeader.topic && (
                  <Badge variant="outline">{eventHeader.topic}</Badge>
                )}
                <Badge variant="outline">+{eventHeader.alternativeSourcesCount} sources</Badge>
              </div>

              <div className="flex items-center gap-4">
                <EventActions 
                  eventId={eventHeader.eventId}
                  initialBookmarkCount={eventHeader.initialBookmarkCount}
                  initialLikeCount={eventHeader.initialLikeCount}
                />
                <SocialShare 
                  title={article.title}
                  excerpt={article.excerpt}
                  url={article.url}
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Article Content */}
      <div className="prose max-w-none">
        {contentPoints.length > 0 ? (
          <ul className="space-y-4">
            {contentPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-800 dark:text-gray-100 leading-relaxed">
                  {point}.
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {article.aiSummary}
          </div>
        )}
      </div>


    </article>
  );
}