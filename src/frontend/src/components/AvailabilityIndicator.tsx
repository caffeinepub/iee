import { useState } from 'react';
import { useGetWorkerAvailability } from '../hooks/useQueries';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import AvailabilityCalendar from './AvailabilityCalendar';

interface AvailabilityIndicatorProps {
  workerId: string;
}

export default function AvailabilityIndicator({ workerId }: AvailabilityIndicatorProps) {
  const { data: availability } = useGetWorkerAvailability(workerId);
  const [expanded, setExpanded] = useState(false);

  if (!availability || availability.length === 0) {
    return null;
  }

  const availableDays = availability.filter((day) => day.available).length;
  const totalDays = availability.length;
  const availabilityPercentage = (availableDays / totalDays) * 100;

  let statusColor = 'text-green-600 dark:text-green-400';
  let statusBg = 'bg-green-100 dark:bg-green-900';
  let statusText = 'Mostly Available';

  if (availabilityPercentage < 30) {
    statusColor = 'text-red-600 dark:text-red-400';
    statusBg = 'bg-red-100 dark:bg-red-900';
    statusText = 'Limited Availability';
  } else if (availabilityPercentage < 70) {
    statusColor = 'text-yellow-600 dark:text-yellow-400';
    statusBg = 'bg-yellow-100 dark:bg-yellow-900';
    statusText = 'Partial Availability';
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${statusBg}`}>
          <img
            src="/assets/generated/icon-calendar.dim_64x64.png"
            alt="Calendar"
            className="w-5 h-5"
          />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${statusColor}`}>{statusText}</p>
          <p className="text-xs text-muted-foreground">
            {availableDays} of {totalDays} days available
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      {expanded && (
        <div className="mt-2">
          <AvailabilityCalendar workerId={workerId} availability={availability} editable={false} />
        </div>
      )}
    </div>
  );
}
