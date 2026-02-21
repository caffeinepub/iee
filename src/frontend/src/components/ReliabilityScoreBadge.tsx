import { Badge } from './ui/badge';
import { TrendingUp } from 'lucide-react';

interface ReliabilityScoreBadgeProps {
  score: number;
}

export default function ReliabilityScoreBadge({ score }: ReliabilityScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 3.5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`px-4 py-2 rounded-lg border-2 ${getScoreColor(score)} font-semibold flex items-center gap-2`}>
        <TrendingUp className="h-4 w-4" />
        <span>{score.toFixed(1)} / 5.0</span>
      </div>
      <span className="text-sm text-muted-foreground">{getScoreLabel(score)}</span>
    </div>
  );
}
