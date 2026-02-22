import { BadgeLevel } from '../backend';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface VerificationBadgeProps {
  badgeLevel: BadgeLevel;
  completedJobs: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function VerificationBadge({ badgeLevel, completedJobs, size = 'md' }: VerificationBadgeProps) {
  if (badgeLevel === 'none') {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const badgeImages = {
    bronze: '/assets/generated/badge-bronze.dim_128x128.png',
    silver: '/assets/generated/badge-silver.dim_128x128.png',
    gold: '/assets/generated/badge-gold.dim_128x128.png',
  };

  const badgeLabels = {
    bronze: 'Bronze Badge - 10+ jobs completed',
    silver: 'Silver Badge - 50+ jobs completed',
    gold: 'Gold Badge - 100+ jobs completed',
  };

  const badgeImage = badgeImages[badgeLevel as keyof typeof badgeImages];
  const badgeLabel = badgeLabels[badgeLevel as keyof typeof badgeLabels];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1">
            <img
              src={badgeImage}
              alt={`${badgeLevel} badge`}
              className={`${sizeClasses[size]} object-contain`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{badgeLabel}</p>
          <p className="text-xs text-muted-foreground">{completedJobs} jobs completed</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
