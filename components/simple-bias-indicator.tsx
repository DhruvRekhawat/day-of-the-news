import { cn } from "@/lib/utils";

interface BiasScores {
  left: number;
  center: number;
  right: number;
}

interface SimpleBiasIndicatorProps {
  bias: "left" | "center" | "right";
  size?: "xs" | "sm" | "md";
  biasScores?: BiasScores; // Optional for enhanced visualization
  showPercentage?: boolean; // Optional to show percentage on hover/display
}

export function SimpleBiasIndicator({
  bias,
  size = "sm",
  biasScores,
  showPercentage = false,
}: SimpleBiasIndicatorProps) {
  const getBiasPosition = (bias: string, scores?: BiasScores) => {
    if (scores) {
      // Calculate position based on actual scores for more accurate positioning
      const leftWeight = scores.left;
      const centerWeight = scores.center;
      const rightWeight = scores.right;

      // Weighted position calculation
      const position = leftWeight * 20 + centerWeight * 50 + rightWeight * 80;
      return `${Math.max(10, Math.min(90, position))}%`;
    }

    // Fallback to original positioning
    switch (bias) {
      case "left":
        return "20%";
      case "center":
        return "50%";
      case "right":
        return "80%";
      default:
        return "50%";
    }
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case "left":
        return "bg-red-600 border-red-300"; // Updated to match ArticleContent
      case "right":
        return "bg-blue-600 border-blue-300";
      case "center":
        return "bg-gray-600 border-gray-300";
      default:
        return "bg-gray-600 border-gray-300";
    }
  };

  const getBiasPercentage = (bias: string, scores?: BiasScores) => {
    if (!scores) return null;

    const percentage = Math.round(scores[bias as keyof BiasScores] * 100);
    return `${percentage}%`;
  };

  const sizeClasses = {
    xs: { bar: "h-0.5 w-8", indicator: "w-1.5 h-1.5", text: "text-xs" },
    sm: { bar: "h-1 w-10", indicator: "w-2 h-2", text: "text-xs" },
    md: { bar: "h-1.5 w-16", indicator: "w-3 h-3", text: "text-sm" },
  };

  return (
    <div className="relative group">
      {/* Enhanced gradient background bar */}
      <div
        className={cn(
          "rounded-full relative overflow-hidden",
          sizeClasses[size].bar
        )}
        style={{
          background:
            "linear-gradient(to right, #ef4444 0%, #6b7280 50%, #3b82f6 100%)",
        }}
      >
        {/* Optional: Show bias score distribution as overlay */}
        {biasScores && (
          <div className="absolute inset-0 flex h-full">
            <div
              className="bg-red-500/30"
              style={{ width: `${biasScores.left * 100}%` }}
            />
            <div
              className="bg-gray-500/30"
              style={{ width: `${biasScores.center * 100}%` }}
            />
            <div
              className="bg-blue-500/30"
              style={{ width: `${biasScores.right * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Enhanced bias indicator dot */}
      <div
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border-2 shadow-lg transition-all duration-200 group-hover:scale-110",
          getBiasColor(bias),
          sizeClasses[size].indicator
        )}
        style={{ left: getBiasPosition(bias, biasScores) }}
      />

      {/* Optional percentage display */}
      {showPercentage && biasScores && (
        <div
          className={cn(
            "absolute -top-6 transform -translate-x-1/2 bg-black/75 text-white px-1.5 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap",
            sizeClasses[size].text
          )}
          style={{ left: getBiasPosition(bias, biasScores) }}
        >
          {bias.toUpperCase()}: {getBiasPercentage(bias, biasScores)}
        </div>
      )}

      {/* Accessibility labels */}
      <span className="sr-only">
        Political bias: {bias}
        {biasScores && ` (${getBiasPercentage(bias, biasScores)})`}
      </span>
    </div>
  );
}
