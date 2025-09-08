"use client";

import React, { useState } from "react";
import { Toaster, toast } from "sonner";

type BiasDirection =
  | "FAR_LEFT"
  | "LEFT"
  | "CENTER_LEFT"
  | "CENTER"
  | "CENTER_RIGHT"
  | "RIGHT"
  | "FAR_RIGHT"
  | "UNKNOWN";
type BiasAnalysisStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  image?: string | null;
  biasAnalysis?: {
    biasDirection: BiasDirection;
    biasStrength: number;
    confidence: number;
    status: BiasAnalysisStatus;
    reasoning?: string | null;
  } | null;
}

interface EventBiasTabsProps {
  articles: Article[];
  className?: string;
}

type BiasTab = "left" | "center" | "right" | "unknown";

const biasTabMapping: Record<BiasDirection, BiasTab> = {
  FAR_LEFT: "left",
  LEFT: "left",
  CENTER_LEFT: "left",
  CENTER: "center",
  CENTER_RIGHT: "right",
  RIGHT: "right",
  FAR_RIGHT: "right",
  UNKNOWN: "unknown",
};

const tabLabels: Record<BiasTab, string> = {
  left: "Left",
  center: "Center",
  right: "Right",
  unknown: "Unknown",
};

const tabColors: Record<BiasTab, string> = {
  left: "text-blue-600 border-blue-600",
  center: "text-zinc-600 border-zinc-600",
  right: "text-red-600 border-red-600",
  unknown: "text-gray-600 border-gray-600",
};

export function EventBiasTabs({
  articles,
  className = "",
}: EventBiasTabsProps) {
  const [activeTab, setActiveTab] = useState<BiasTab>("center");
  const [userFeedback, setUserFeedback] = useState<Record<string, BiasTab>>({});

  // Group articles by bias
  const groupedArticles = articles.reduce(
    (acc, article) => {
      let tab: BiasTab = "unknown";

      if (article.biasAnalysis?.status === "COMPLETED") {
        tab = biasTabMapping[article.biasAnalysis.biasDirection];
      }

      if (!acc[tab]) {
        acc[tab] = [];
      }
      acc[tab].push(article);
      return acc;
    },
    {} as Record<BiasTab, Article[]>
  );

  // Filter out empty tabs and sort by preference
  const availableTabs: BiasTab[] = (
    ["center", "left", "right", "unknown"] as BiasTab[]
  ).filter(
    (tab: BiasTab) => groupedArticles[tab] && groupedArticles[tab].length > 0
  );

  // Set initial active tab to first available
  React.useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const handleFeedback = (articleId: string, bias: BiasTab) => {
    setUserFeedback(prev => ({
      ...prev,
      [articleId]: bias
    }));
    toast.success('Thank you for your feedback!');
  };

  if (availableTabs.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        No articles available for bias analysis
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-zinc-800 rounded-lg border dark:border-gray-700 ${className}`}>
      <Toaster position="bottom-right"  />
      {/* Tabs Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 px-6">
          {availableTabs.map((tab) => {
            const count = groupedArticles[tab].length;
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? `${tabColors[tab]} border-b-2`
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {tabLabels[tab]}
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {availableTabs.map((tab) => (
          <div key={tab} className={activeTab === tab ? "block" : "hidden"}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {tabLabels[tab]} Perspective
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {groupedArticles[tab].length} source
                {groupedArticles[tab].length !== 1 ? "s" : ""} with {tab} bias
              </p>
            </div>

            <div className="space-y-4">
              {groupedArticles[tab].map((article) => (
                <div
                  key={article.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-shadow bg-white dark:bg-zinc-800"
                >
                  <div className="flex items-start space-x-4">
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                          {article.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {article.source}
                        </span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          Read Article →
                        </a>
                      </div>
                      
                      {/* Feedback UI */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Do you think this article has:</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleFeedback(article.id, "left")}
                            className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                              userFeedback[article.id] === "left"
                                ? "bg-blue-100 border-blue-600 text-blue-600"
                                : "border-gray-300 hover:border-blue-600"
                            }`}
                          >
                            Left Bias
                          </button>
                          <button
                            onClick={() => handleFeedback(article.id, "center")}
                            className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                              userFeedback[article.id] === "center"
                                ? "bg-zinc-100 border-zinc-600 text-zinc-600"
                                : "border-gray-300 hover:border-zinc-600"
                            }`}
                          >
                            Center Bias
                          </button>
                          <button
                            onClick={() => handleFeedback(article.id, "right")}
                            className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                              userFeedback[article.id] === "right"
                                ? "bg-red-100 border-red-600 text-red-600"
                                : "border-gray-300 hover:border-red-600"
                            }`}
                          >
                            Right Bias
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
