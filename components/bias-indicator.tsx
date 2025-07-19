import { cn } from "@/lib/utils";

interface BiasIndicatorProps {
  bias: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function BiasIndicator({
  bias,
  size = "md",
  showLabel = false,
}: BiasIndicatorProps) {
  const getBiasPosition = (bias: string) => {
    switch (bias) {
      case "left":
        return "15%"; // Position on the left side
      case "center":
        return "50%"; // Position in the center
      case "right":
        return "85%"; // Position on the right side
      default:
        return "50%";
    }
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case "left":
        return "bg-blue-500";
      case "right":
        return "bg-red-500";
      case "center":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBiasLabel = (bias: string) => {
    switch (bias) {
      case "left":
        return "Left";
      case "right":
        return "Right";
      case "center":
        return "Center";
      default:
        return "Unknown";
    }
  };

  const sizeClasses = {
    sm: { bar: "h-1 w-12", indicator: "w-2 h-2" },
    md: { bar: "h-1.5 w-16", indicator: "w-2.5 h-2.5" },
    lg: { bar: "h-2 w-20", indicator: "w-3 h-3" },
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      {/* Horizontal bias bar */}
      <div className="relative">
        {/* Background bar */}
        <div
          className={cn("bg-gray-200 rounded-full", sizeClasses[size].bar)}
        />

        {/* Left section (blue) */}
        <div
          className="absolute top-0 left-0 bg-blue-500 rounded-l-full h-full"
          style={{ width: "33.33%" }}
        />

        {/* Right section (red) */}
        <div
          className="absolute top-0 right-0 bg-red-500 rounded-r-full h-full"
          style={{ width: "33.33%" }}
        />

        {/* Center dividers */}
        <div
          className="absolute top-0 h-full w-px "
          style={{ left: "33.33%" }}
        />
        <div
          className="absolute top-0 h-full w-px "
          style={{ left: "66.66%" }}
        />

        {/* Bias indicator dot */}
        <div
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow-sm",
            getBiasColor(bias),
            sizeClasses[size].indicator
          )}
          style={{ left: getBiasPosition(bias) }}
        />
      </div>

      {/* Optional label */}
      {showLabel && (
        <span className="text-xs text-gray-600 dark:text-gray-200 font-medium">
          {getBiasLabel(bias)}
        </span>
      )}
    </div>
  );
}
