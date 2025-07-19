import { SimpleBiasIndicator } from "./simple-bias-indicator";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, MessageCircle, ThumbsUp } from "lucide-react";

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
  title: string;
  content: string;
  image?: string;
  timestamp: string;
  aiBiasReport: BiasAnalysis;
  source: string;
  url: string;
  author?: string;
  category: string;
}

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  const formatContent = (content: string) => {
    // Split content into bullet points if it contains bullet-like formatting
    const sentences = content
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0);
    return sentences
      .map((sentence) => sentence.trim())
      .filter((s) => s.length > 20);
  };

  const contentPoints = formatContent(article.content);

  // Extract bias data with fallbacks
  const biasData = article.aiBiasReport || {
    bias: "center",
    biasScores: { left: 0, center: 1, right: 0 },
  };
  const { bias, biasScores } = biasData;

  console.log(article);

  return (
    <article className="">
      {/* Article Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight font-mono">
          {article.title}
        </h1>

        {/* Bias Indicators */}
        <div className="flex items-center space-x-8 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
                LEFT
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  bias === "left"
                    ? "bg-red-500 ring-2 ring-red-300"
                    : "bg-red-200"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    bias === "left" ? "text-white" : "text-red-700"
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
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  bias === "center"
                    ? "bg-gray-500 ring-2 ring-gray-300"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    bias === "center" ? "text-white" : "text-gray-700"
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
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  bias === "right"
                    ? "bg-blue-500 ring-2 ring-blue-300"
                    : "bg-blue-200"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    bias === "right" ? "text-white" : "text-blue-700"
                  }`}
                >
                  {Math.round((biasScores?.right || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Overall Bias Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
              Overall Bias:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                bias === "left"
                  ? "bg-red-100 text-red-800"
                  : bias === "right"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {bias}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-auto">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bias Analysis Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
              Bias Analysis:
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${(biasScores?.left || 0) * 100}%` }}
            />
            <div
              className="h-full bg-gray-500 transition-all duration-300"
              style={{ width: `${(biasScores?.center || 0) * 100}%` }}
            />
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(biasScores?.right || 0) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Left</span>
            <span>Center</span>
            <span>Right</span>
          </div>
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
            {article.content}
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
            <span className="text-sm text-gray-500">{article.timestamp}</span>
            {article.author && (
              <>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  By {article.author}
                </span>
              </>
            )}
          </div>
          <SimpleBiasIndicator bias={bias} size="md" />
        </div>
      </div>
    </article>
  );
}
