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

  if (total === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
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
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
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
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : dominantBias.name === "Right"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
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

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total: {total} articles analyzed
          </p>
        </div>
      </div>
    </div>
  );
}
