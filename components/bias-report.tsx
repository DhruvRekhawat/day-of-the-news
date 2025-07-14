"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Article {
  id: string;
  title: string;
  bias: "left" | "center" | "right";
  biasScores: {
    left: number;
    center: number;
    right: number;
  };
}

interface BiasReportProps {
  article: Article;
}

export function BiasReport({ article }: BiasReportProps) {
  // Calculate percentages for bias distribution
  const total =
    article.biasScores?.left +
    article.biasScores?.center +
    article.biasScores?.right;
  const biasData = [
    {
      name: "Left",
      value: Math.round((article?.biasScores?.left / total) * 100),
      color: "#3b82f6",
    },
    {
      name: "Center",
      value: Math.round((article?.biasScores?.center / total) * 100),
      color: "#6b7280",
    },
    {
      name: "Right",
      value: Math.round((article?.biasScores?.right / total) * 100),
      color: "#ef4444",
    },
  ];

  const factualityScore = 85; // Mock factuality score
  const ownershipScore = 92; // Mock ownership transparency score

  return (
    <div className="bg-gray-50  p-6">
      {/* Bias Report */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          BIAS REPORT
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
          News Sentiment based on 82 resources
        </p>

        {/* Pie Chart */}
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={biasData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {biasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {biasData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full`}
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-sm font-bold">{item.value}%</span>
            </div>
          ))}
        </div>

        {/* Source Count */}
        {/* <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Total News Source</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{total}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Left Aligned News</div>
              <div className="text-2xl font-bold text-blue-600">{article.biasScores.left}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Center Aligned News</div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-200">{article.biasScores.center}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Right Aligned News</div>
              <div className="text-2xl font-bold text-red-600">{article.biasScores.right}</div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Factuality */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          FACTUALITY
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-200 mb-3">
          Accuracy of Data from different sources
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${factualityScore}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span className="text-sm font-bold text-blue-600">
            {factualityScore}%
          </span>
        </div>
      </div>

      {/* Ownership */}
      <div>
        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          OWNERSHIP
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-200 mb-3">
          Accuracy of Data from different sources
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${ownershipScore}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span className="text-sm font-bold text-purple-600">
            {ownershipScore}%
          </span>
        </div>
      </div>
    </div>
  );
}
