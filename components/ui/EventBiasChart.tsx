"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BiasAnalysisStatus, BiasDirection } from '@/lib/generated/prisma';

interface BiasAnalysis {
  biasDirection: BiasDirection;
  biasStrength: number;
  confidence: number;
  status: BiasAnalysisStatus;
  reasoning?: string | null;
}

interface EventBiasChartProps {
  articles: Array<{
    biasAnalysis?: BiasAnalysis | null;
    source: string;
  }>;
  title?: string;
}

export function EventBiasChart({ articles, title = "Bias Distribution" }: EventBiasChartProps) {
  // Calculate bias distribution from articles
  const biasCounts = articles.reduce((acc, article) => {
    if (article.biasAnalysis?.status === 'COMPLETED') {
      const direction = article.biasAnalysis.biasDirection;
      acc[direction] = (acc[direction] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Group into left, center, right
  const leftCount = (biasCounts.FAR_LEFT || 0) + (biasCounts.LEFT || 0) + (biasCounts.CENTER_LEFT || 0);
  const centerCount = biasCounts.CENTER || 0;
  const rightCount = (biasCounts.CENTER_RIGHT || 0) + (biasCounts.RIGHT || 0) + (biasCounts.FAR_RIGHT || 0);
  const unknownCount = biasCounts.UNKNOWN || 0;

  const total = leftCount + centerCount + rightCount + unknownCount;

  // Group articles by bias category for source display
  const leftSources = articles.filter(article => 
    article.biasAnalysis?.status === 'COMPLETED' && 
    ['FAR_LEFT', 'LEFT', 'CENTER_LEFT'].includes(article.biasAnalysis.biasDirection)
  ).map(article => article.source);

  const centerSources = articles.filter(article => 
    article.biasAnalysis?.status === 'COMPLETED' && 
    article.biasAnalysis.biasDirection === 'CENTER'
  ).map(article => article.source);

  const rightSources = articles.filter(article => 
    article.biasAnalysis?.status === 'COMPLETED' && 
    ['CENTER_RIGHT', 'RIGHT', 'FAR_RIGHT'].includes(article.biasAnalysis.biasDirection)
  ).map(article => article.source);

  if (total === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center">No bias data available</p>
      </div>
    );
  }

  const chartData = [
    {
      name: "Left",
      value: leftCount,
      percentage: Math.round((leftCount / total) * 100),
      color: "#3b82f6", // Blue for left
    },
    {
      name: "Center", 
      value: centerCount,
      percentage: Math.round((centerCount / total) * 100),
      color: "#71717a", // Zinc for center
    },
    {
      name: "Right",
      value: rightCount,
      percentage: Math.round((rightCount / total) * 100),
      color: "#ef4444", // Red for right
    },
    {
      name: "Unknown",
      value: unknownCount,
      percentage: Math.round((unknownCount / total) * 100),
      color: "#6b7280", // Gray for unknown
    },
  ].filter(item => item.value > 0);

  // Get dominant bias
  const dominantBias = chartData.reduce((prev, current) => 
    (prev.value > current.value) ? prev : current
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].payload.percentage}% ({payload[0].value} articles)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      
      {/* Overall Bias Badge */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Dominant Perspective:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              dominantBias.name === "Left"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : dominantBias.name === "Right"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : dominantBias.name === "Center"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            {dominantBias.name}
          </span>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>

      {/* Source Names by Bias Category */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Sources by Bias Category
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {/* Left Sources */}
          <div className="text-center">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
              L {Math.round((leftCount / total) * 100)}%
            </div>
            <div className="space-y-1">
              {leftSources.slice(0, 5).map((source, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1">
                  {source}
                </div>
              ))}
              {leftSources.length > 5 && (
                <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full px-2 py-1">
                  +{leftSources.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Center Sources */}
          <div className="text-center">
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              C {Math.round((centerCount / total) * 100)}%
            </div>
            <div className="space-y-1">
              {centerSources.slice(0, 5).map((source, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-zinc-50 dark:bg-zinc-900/20 rounded px-2 py-1">
                  {source}
                </div>
              ))}
              {centerSources.length > 5 && (
                <div className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/30 rounded-full px-2 py-1">
                  +{centerSources.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Right Sources */}
          <div className="text-center">
            <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
              R {Math.round((rightCount / total) * 100)}%
            </div>
            <div className="space-y-1">
              {rightSources.slice(0, 5).map((source, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 rounded px-2 py-1">
                  {source}
                </div>
              ))}
              {rightSources.length > 5 && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-full px-2 py-1">
                  +{rightSources.length - 5} more
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total: {total} articles analyzed
          </p>
        </div>
      </div>

      {/* Coming Soon Cards */}
      <div className="mt-6 space-y-4">
        {/* Factuality Card */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Factuality</h4>
            <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">Coming Soon</span>
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Detailed factuality analysis of the coverage will be available soon.
          </p>
        </div>

        {/* Ownership Card */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ownership</h4>
            <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">Coming Soon</span>
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Media ownership and funding transparency data will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
