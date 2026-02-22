import { useGetMyWorkerProfile, useGetWorkerAvailability, useUpdateWorkerAvailabilityWithPattern } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar } from 'lucide-react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useState, useEffect } from 'react';
import { AvailabilityRequest } from '../backend';
import { toast } from 'sonner';

export default function WorkerAvailability() {
  const { data: profile, isLoading: profileLoading } = useGetMyWorkerProfile();
  const { data: availability, isLoading: availabilityLoading } = useGetWorkerAvailability(profile?.id);
  const updateAvailability = useUpdateWorkerAvailabilityWithPattern();
  const [localAvailability, setLocalAvailability] = useState<boolean[]>([]);

  useEffect(() => {
    if (availability && availability.length > 0) {
      setLocalAvailability(availability.map((day) => day.available));
    }
  }, [availability]);

  if (profileLoading || availabilityLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading availability...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No profile found. Please register as a worker.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDayToggle = (dayIndex: number, available: boolean) => {
    const newAvailability = [...localAvailability];
    newAvailability[dayIndex] = available;
    setLocalAvailability(newAvailability);
  };

  const handleSave = async () => {
    if (!profile) return;

    const availabilityRequests: AvailabilityRequest[] = localAvailability.map((available, index) => ({
      dayIndex: BigInt(index),
      available,
      timeRange: undefined,
    }));

    try {
      await updateAvailability.mutateAsync({
        workerId: profile.id,
        availability: availabilityRequests,
      });
      toast.success('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const displayAvailability = localAvailability.map((available, index) => ({
    available,
    timeRange: availability?.[index]?.timeRange,
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/assets/generated/icon-calendar.dim_64x64.png"
              alt="Calendar"
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold">My Availability</h1>
          </div>
          <p className="text-muted-foreground">
            Set your weekly availability pattern to help employers find you
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Click on any day to toggle your availability for that day of the week</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Green indicates you are available, red indicates you are not available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>This pattern repeats weekly and helps employers schedule jobs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Remember to click "Save Changes" after updating your availability</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <AvailabilityCalendar
          workerId={profile.id}
          availability={displayAvailability}
          editable={true}
          onUpdate={handleDayToggle}
        />

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updateAvailability.isPending}
            size="lg"
            className="min-w-[200px]"
          >
            {updateAvailability.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
