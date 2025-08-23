
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

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Bias Distribution</h3>
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
