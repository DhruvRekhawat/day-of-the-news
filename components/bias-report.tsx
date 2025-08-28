"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
  aiBiasReport: BiasAnalysis;
}

interface BiasReportProps {
  article: Article;
}

export function BiasReport({ article }: BiasReportProps) {
  // Extract bias data with fallbacks
  const biasData = article.aiBiasReport || {
    bias: "center",
    biasScores: { left: 0, center: 1, right: 0 },
  };
  const { bias, biasScores } = biasData;

  // Calculate percentages for bias distribution (scores should already sum to 1)
  const total = biasScores.left + biasScores.center + biasScores.right;

  const chartData = [
    {
      name: "Left",
      value: Math.round((biasScores.left / total) * 100),
      rawValue: biasScores.left,
      color: "#ef4444", // Red for left
    },
    {
      name: "Center",
      value: Math.round((biasScores.center / total) * 100),
      rawValue: biasScores.center,
      color: "#6b7280", // Grey for center
    },
    {
      name: "Right",
      value: Math.round((biasScores.right / total) * 100),
      rawValue: biasScores.right,
      color: "#3b82f6", // Blue for right
    },
  ];

  // Filter out zero values for cleaner pie chart
  const nonZeroData = chartData.filter((item) => item.value > 0);

  const factualityScore = 85; // Mock factuality score
  const ownershipScore = 92; // Mock ownership transparency score

  // Get dominant bias for highlighting
  const dominantBias = bias;

  return (
    <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg">
      {/* Bias Report */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          BIAS REPORT
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          AI-powered sentiment analysis based on article content
        </p>

        {/* Overall Bias Badge */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Overall Classification:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                dominantBias === "left"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : dominantBias === "right"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {dominantBias}
            </span>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={nonZeroData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {nonZeroData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={
                      entry.name.toLowerCase() === dominantBias
                        ? "#000"
                        : "none"
                    }
                    strokeWidth={
                      entry.name.toLowerCase() === dominantBias ? 0 : 0
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-none ${
                    item.name.toLowerCase() === dominantBias
                      ? "ring-2 ring-gray-400"
                      : ""
                  }`}
                  style={{ backgroundColor: item.color }}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    item.name.toLowerCase() === dominantBias
                      ? "font-bold text-gray-900 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm ${
                    item.name.toLowerCase() === dominantBias
                      ? "font-bold text-gray-900 dark:text-gray-100"
                      : "font-medium text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.value}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({item.rawValue.toFixed(2)})
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Confidence Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Analysis Confidence:
            </span>
            <span
              className={`text-sm font-bold ${
                Math.max(...Object.values(biasScores)) > 0.7
                  ? "text-green-600 dark:text-green-400"
                  : Math.max(...Object.values(biasScores)) > 0.5
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {Math.max(...Object.values(biasScores)) > 0.7
                ? "High"
                : Math.max(...Object.values(biasScores)) > 0.5
                ? "Medium"
                : "Low"}
            </span>
          </div>
        </div>
      </div>

      {/* Factuality */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          FACTUALITY
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Estimated accuracy based on source reliability
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-500 dark:bg-blue-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${factualityScore}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {factualityScore}%
          </span>
        </div>
      </div>

      {/* Ownership */}
      <div>
        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          SOURCE TRANSPARENCY
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Ownership and funding transparency score
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-purple-500 dark:bg-purple-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${ownershipScore}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {ownershipScore}%
          </span>
        </div>
      </div>
    </div>
  );
}
