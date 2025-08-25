import { BiasAnalysisStatus, BiasDirection } from '../../lib/generated/prisma';

interface BiasIndicatorProps {
  biasAnalysis?: {
    biasDirection: BiasDirection;
    biasStrength: number;
    confidence: number;
    status: BiasAnalysisStatus;
    reasoning?: string;
  } | null;
  showDetails?: boolean;
  className?: string;
}

const biasColors: Record<BiasDirection, string> = {
  FAR_LEFT: 'bg-blue-600',
  LEFT: 'bg-blue-500',
  CENTER_LEFT: 'bg-zinc-400',
  CENTER: 'bg-zinc-500',
  CENTER_RIGHT: 'bg-zinc-400',
  RIGHT: 'bg-red-500',
  FAR_RIGHT: 'bg-red-600',
  UNKNOWN: 'bg-gray-400',
};

const biasLabels: Record<BiasDirection, string> = {
  FAR_LEFT: 'Far Left',
  LEFT: 'Left',
  CENTER_LEFT: 'Center-Left',
  CENTER: 'Center',
  CENTER_RIGHT: 'Center-Right',
  RIGHT: 'Right',
  FAR_RIGHT: 'Far Right',
  UNKNOWN: 'Unknown',
};

const statusColors: Record<BiasAnalysisStatus, string> = {
  PENDING: 'bg-gray-400',
  PROCESSING: 'bg-yellow-400',
  COMPLETED: 'bg-green-400',
  FAILED: 'bg-red-400',
};

const statusLabels: Record<BiasAnalysisStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Analyzing...',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export function BiasIndicator({ biasAnalysis, showDetails = false, className = '' }: BiasIndicatorProps) {
  if (!biasAnalysis) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}>
        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
        No Analysis
      </div>
    );
  }

  const { biasDirection, biasStrength, confidence, status } = biasAnalysis;

  if (status !== 'COMPLETED') {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} text-white ${className}`}>
        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
        {statusLabels[status]}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${biasColors[biasDirection]} text-white ${className}`}>
      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
      {biasLabels[biasDirection]}
      {showDetails && (
        <div className="ml-2 text-xs opacity-75">
          • Strength: {biasStrength}/5 • Confidence: {Math.round(confidence * 100)}%
        </div>
      )}
    </div>
  );
}

export function BiasStrengthBar({ strength, className = '' }: { strength: number; className?: string }) {
  const filledBars = Math.min(Math.max(strength, 1), 5);
  
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-2 h-2 rounded-full ${
            bar <= filledBars ? 'bg-current' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export function BiasConfidenceIndicator({ confidence, className = '' }: { confidence: number; className?: string }) {
  const percentage = Math.round(confidence * 100);
  let color = 'text-gray-500';
  
  if (confidence >= 0.8) color = 'text-green-600';
  else if (confidence >= 0.6) color = 'text-yellow-600';
  else if (confidence >= 0.4) color = 'text-orange-600';
  else color = 'text-red-600';
  
  return (
    <span className={`text-xs font-medium ${color} ${className}`}>
      {percentage}% confidence
    </span>
  );
}
