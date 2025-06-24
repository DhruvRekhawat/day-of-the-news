import { cn } from "@/lib/utils"

interface SimpleBiasIndicatorProps {
  bias: "left" | "center" | "right"
  size?: "xs" | "sm" | "md"
}

export function SimpleBiasIndicator({ bias, size = "sm" }: SimpleBiasIndicatorProps) {
  const getBiasPosition = (bias: string) => {
    switch (bias) {
      case "left":
        return "20%"
      case "center":
        return "50%"
      case "right":
        return "80%"
      default:
        return "50%"
    }
  }

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case "left":
        return "bg-blue-600"
      case "right":
        return "bg-red-600"
      case "center":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const sizeClasses = {
    xs: { bar: "h-0.5 w-8", indicator: "w-1.5 h-1.5" },
    sm: { bar: "h-1 w-10", indicator: "w-2 h-2" },
    md: { bar: "h-1 w-12", indicator: "w-2.5 h-2.5" },
  }

  return (
    <div className="relative">
      {/* Gradient background bar */}
      <div
        className={cn("rounded-full", sizeClasses[size].bar)}
        style={{
          background: "linear-gradient(to right, #3b82f6 0%, #6b7280 50%, #ef4444 100%)",
        }}
      />

      {/* Bias indicator dot */}
      <div
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border border-white shadow-sm",
          getBiasColor(bias),
          sizeClasses[size].indicator,
        )}
        style={{ left: getBiasPosition(bias) }}
      />
    </div>
  )
}
