"use client"

import { TrendingUp } from "lucide-react";
import { BiasBar } from "@/components/ui/BiasBar";
import { Badge } from "@/components/ui/badge";
import { EventActions } from "@/components/event-actions";
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

export function ArticleContent({ article, aggregatedBiasScores, eventHeader }: ArticleContentProps) {
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

  // Extract bias data with fallbacks
  const biasData = article.aiBiasReport || {
    bias: "center",
    biasScores: { left: 0, center: 1, right: 0 },
  };
  const { bias, biasScores } = biasData;

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

        {/* Bias Indicators */}
        <div className="flex items-center space-x-8 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
                LEFT
              </span>
              <div
                className={`w-8 h-8 rounded-none flex items-center justify-center transition-all ${
                  bias === "left"
                    ? "bg-blue-500 ring-2 ring-blue-300"
                    : "bg-blue-200"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    bias === "left" ? "text-white" : "text-blue-700"
                  }`}
                >
                  {Math.round((biasScores?.left || 0) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
                CENTER
              </span>
              <div
                className={`w-8 h-8 rounded-none flex items-center justify-center transition-all ${
                  bias === "center"
                    ? "bg-zinc-500 ring-2 ring-zinc-300"
                    : "bg-zinc-200"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    bias === "center" ? "text-white" : "text-zinc-700"
                  }`}
                >
                  {Math.round((biasScores?.center || 0) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
                RIGHT
              </span>
              <div
                className={`w-8 h-8 rounded-none flex items-center justify-center transition-all ${
                  bias === "right"
                    ? "bg-red-500 ring-2 ring-red-300"
                    : "bg-red-200"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    bias === "right" ? "text-white" : "text-red-700"
                  }`}
                >
                  {Math.round((biasScores?.right || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bias Analysis Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
              Event Bias Distribution:
            </span>
          </div>
          <BiasBar
            leftPercentage={aggregatedBiasScores ? (aggregatedBiasScores.left * 100) : (biasScores?.left || 0) * 100}
            centerPercentage={aggregatedBiasScores ? (aggregatedBiasScores.center * 100) : (biasScores?.center || 0) * 100}
            rightPercentage={aggregatedBiasScores ? (aggregatedBiasScores.right * 100) : (biasScores?.right || 0) * 100}
            height="h-3"
            showLabels={true}
          />
        </div>
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

      {/* Article Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Source: {article.source}
            </span>
            <span className="text-sm text-gray-500">•</span>
          </div>
        </div>
      </div>
    </article>
  );
}