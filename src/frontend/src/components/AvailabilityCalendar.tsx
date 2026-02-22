import { DayAvailability } from '../backend';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AvailabilityCalendarProps {
  workerId: string;
  availability: DayAvailability[];
  editable?: boolean;
  onUpdate?: (dayIndex: number, available: boolean) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityCalendar({
  availability,
  editable = false,
  onUpdate,
}: AvailabilityCalendarProps) {
  if (!availability || availability.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No availability data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="/assets/generated/icon-calendar.dim_64x64.png" alt="Calendar" className="w-6 h-6" />
          Weekly Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {availability.slice(0, 7).map((day, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                day.available
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
              } ${editable ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => editable && onUpdate && onUpdate(index, !day.available)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    day.available ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="font-medium">{DAYS[index]}</span>
              </div>
              <div className="text-sm">
                {day.available ? (
                  <span className="text-green-700 dark:text-green-300 font-medium">Available</span>
                ) : (
                  <span className="text-red-700 dark:text-red-300 font-medium">Unavailable</span>
                )}
                {day.timeRange && (
                  <span className="ml-2 text-muted-foreground">
                    ({day.timeRange[0]} - {day.timeRange[1]})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {editable && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Click on any day to toggle availability
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
