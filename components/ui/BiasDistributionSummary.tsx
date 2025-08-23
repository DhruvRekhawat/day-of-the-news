
interface BiasDistributionSummaryProps {
  events: any[];
  className?: string;
}

export function BiasDistributionSummary({ events, className = '' }: BiasDistributionSummaryProps) {
  // Calculate bias distribution from all events
  const biasCounts = events.reduce((acc, event) => {
    event.articles.forEach((article: any) => {
      if (article.biasAnalysis?.status === 'COMPLETED') {
        const direction = article.biasAnalysis.biasDirection;
        acc[direction] = (acc[direction] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  // Group into left, center, right
  const leftCount = (biasCounts.FAR_LEFT || 0) + (biasCounts.LEFT || 0) + (biasCounts.CENTER_LEFT || 0);
  const centerCount = biasCounts.CENTER || 0;
  const rightCount = (biasCounts.CENTER_RIGHT || 0) + (biasCounts.RIGHT || 0) + (biasCounts.FAR_RIGHT || 0);
  const unknownCount = biasCounts.UNKNOWN || 0;

  const total = leftCount + centerCount + rightCount + unknownCount;

  if (total === 0) {
    return null;
  }

  // Calculate percentages for the visual bar
  const leftPercentage = total > 0 ? (leftCount / total) * 100 : 0;
  const centerPercentage = total > 0 ? (centerCount / total) * 100 : 0;
  const rightPercentage = total > 0 ? (rightCount / total) * 100 : 0;

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Bias Distribution</h3>
      
      {/* Visual Bias Bar Chart */}
      <div className="mb-4">
        <div className="flex h-6 overflow-hidden border">
          <div 
            className="bg-red-600 flex items-center justify-center"
            style={{ width: `${leftPercentage}%` }}
          >
            {leftPercentage > 10 && (
              <span className="text-white text-xs font-medium">
                {Math.round(leftPercentage)}%
              </span>
            )}
          </div>
          <div 
            className="bg-gray-200 flex items-center justify-center"
            style={{ width: `${centerPercentage}%` }}
          >
            {centerPercentage > 10 && (
              <span className="text-gray-700 text-xs font-medium">
                {Math.round(centerPercentage)}%
              </span>
            )}
          </div>
          <div 
            className="bg-blue-600 flex items-center justify-center"
            style={{ width: `${rightPercentage}%` }}
          >
            {rightPercentage > 10 && (
              <span className="text-white text-xs font-medium">
                {Math.round(rightPercentage)}%
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Left</span>
          <span>Center</span>
          <span>Right</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{leftCount}</div>
          <div className="text-sm text-gray-600">Left</div>
          <div className="text-xs text-gray-500">
            {total > 0 ? Math.round((leftCount / total) * 100) : 0}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{centerCount}</div>
          <div className="text-sm text-gray-600">Center</div>
          <div className="text-xs text-gray-500">
            {total > 0 ? Math.round((centerCount / total) * 100) : 0}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{rightCount}</div>
          <div className="text-sm text-gray-600">Right</div>
          <div className="text-xs text-gray-500">
            {total > 0 ? Math.round((rightCount / total) * 100) : 0}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{unknownCount}</div>
          <div className="text-sm text-gray-600">Unknown</div>
          <div className="text-xs text-gray-500">
            {total > 0 ? Math.round((unknownCount / total) * 100) : 0}%
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500 text-center">
        Total: {total} articles analyzed
      </div>
    </div>
  );
}
