import { BiasBar } from "@/components/ui/BiasBar";

interface BiasIndicatorProps {
  bias: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function SimpleBiasIndicator({
  bias,
  size = "md",
  showLabel = false,
}: BiasIndicatorProps) {
  // Helper function to convert bias to percentages for BiasBar
  const getBiasPercentages = (bias: string) => {
    switch (bias) {
      case "left":
        return { left: 100, center: 0, right: 0 };
      case "center":
        return { left: 0, center: 100, right: 0 };
      case "right":
        return { left: 0, center: 0, right: 100 };
      default:
        return { left: 33, center: 34, right: 33 };
    }
  };

  const sizeClasses = {
    sm: { height: "h-1", width: "w-12" },
    md: { height: "h-1.5", width: "w-16" },
    lg: { height: "h-2", width: "w-20" },
  };

  const biasPercentages = getBiasPercentages(bias);

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className={sizeClasses[size].width}>
        <BiasBar
          leftPercentage={biasPercentages.left}
          centerPercentage={biasPercentages.center}
          rightPercentage={biasPercentages.right}
          height={sizeClasses[size].height}
          showLabels={false}
        />
      </div>

      {/* Optional label */}
      {showLabel && (
        <span className="text-xs text-gray-600 dark:text-gray-200 font-medium">
          {bias.charAt(0).toUpperCase() + bias.slice(1)}
        </span>
      )}
    </div>
  );
}
