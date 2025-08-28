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
  showLabels = true,
  className = '' 
}: BiasBarProps) {
  return (
    <div className={className}>
      <div className={`flex ${height} overflow-hidden`}>
        <div 
          className="bg-blue-600 flex items-center justify-center"
          style={{ width: `${leftPercentage}%` }}
        >
          {showLabels && leftPercentage > 10 && (
            <span className="text-white text-xs font-medium">
              {Math.round(leftPercentage)}%
            </span>
          )}
        </div>
        <div 
          className="bg-zinc-600 flex items-center justify-center"
          style={{ width: `${centerPercentage}%` }}
        >
          {showLabels && centerPercentage > 10 && (
            <span className="text-white text-xs font-medium">
              {Math.round(centerPercentage)}%
            </span>
          )}
        </div>
        <div 
          className="bg-red-600 flex items-center justify-center"
          style={{ width: `${rightPercentage}%` }}
        >
          {showLabels && rightPercentage > 10 && (
            <span className="text-white text-xs font-medium">
              {Math.round(rightPercentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
