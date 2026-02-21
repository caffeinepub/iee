import { Badge } from './ui/badge';
import { Award } from 'lucide-react';
import { ExperienceLevel } from '../backend';

interface ExperienceLevelBadgeProps {
  level: ExperienceLevel;
}

export default function ExperienceLevelBadge({ level }: ExperienceLevelBadgeProps) {
  const getLevelConfig = (level: ExperienceLevel): { label: string; color: string } => {
    switch (level) {
      case 'novice':
        return { label: 'Novice (0-2 years)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'intermediate':
        return { label: 'Intermediate (2-5 years)', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'expert':
        return { label: 'Expert (5+ years)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  const config = getLevelConfig(level);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${config.color} font-semibold`}>
      <Award className="h-4 w-4" />
      <span>{config.label}</span>
    </div>
  );
}
