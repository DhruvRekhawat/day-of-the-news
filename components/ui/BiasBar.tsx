interface BiasBarProps {
  leftPercentage: number;
  centerPercentage: number;
  rightPercentage: number;
  height?: string;
  showLabels?: boolean;
  className?: string;
}

export function BiasBar({ 
  leftPercentage, 
  centerPercentage, 
  rightPercentage, 
  height = "h-2", 
  showLabels = false,
  className = '' 
}: BiasBarProps) {
  return (
    <div className={className}>
      <div className={`flex ${height} overflow-hidden`}>
        <div 
          className="bg-red-600 flex items-center justify-center"
          style={{ width: `${leftPercentage}%` }}
        >
          {showLabels && leftPercentage > 10 && (
            <span className="text-white text-xs font-medium">
              {Math.round(leftPercentage)}%
            </span>
          )}
        </div>
        <div 
          className="bg-gray-200 flex items-center justify-center"
          style={{ width: `${centerPercentage}%` }}
        >
          {showLabels && centerPercentage > 10 && (
            <span className="text-gray-700 text-xs font-medium">
              {Math.round(centerPercentage)}%
            </span>
          )}
        </div>
        <div 
          className="bg-blue-600 flex items-center justify-center"
          style={{ width: `${rightPercentage}%` }}
        >
          {showLabels && rightPercentage > 10 && (
            <span className="text-white text-xs font-medium">
              {Math.round(rightPercentage)}%
            </span>
          )}
        </div>
      </div>
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Left</span>
          <span>Center</span>
          <span>Right</span>
        </div>
      )}
    </div>
  );
}
