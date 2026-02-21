import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyWorkerProfile, useUpdateWorkerAvailability } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import WorkerQRCode from '../components/WorkerQRCode';
import ReliabilityScoreBadge from '../components/ReliabilityScoreBadge';
import ExperienceLevelBadge from '../components/ExperienceLevelBadge';
import { Star, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { useEffect } from 'react';

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: workerProfile, isLoading } = useGetMyWorkerProfile();
  const updateAvailability = useUpdateWorkerAvailability();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!workerProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No worker profile found.</p>
            <Button onClick={() => navigate({ to: '/worker/register' })}>Create Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      await updateAvailability.mutateAsync({
        workerId: workerProfile.id,
        isAvailable: checked,
      });
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const skillLabels: Record<string, string> = {
    masonry: 'Masonry',
    plumbing: 'Plumbing',
    electrician: 'Electrician',
    carpentry: 'Carpentry',
    painting: 'Painting',
    roofing: 'Roofing',
    flooring: 'Flooring',
    tiling: 'Tiling',
    welding: 'Welding',
    generalLabor: 'General Labor',
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">View and manage your worker profile</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/generated/worker-icon.dim_128x128.png"
                    alt="Worker"
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-2xl">{workerProfile.name}</CardTitle>
                    <p className="text-muted-foreground">Worker ID: {workerProfile.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="availability">Available</Label>
                  <Switch
                    id="availability"
                    checked={workerProfile.isAvailable}
                    onCheckedChange={handleAvailabilityToggle}
                    disabled={updateAvailability.isPending}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-semibold">{workerProfile.rating.toFixed(1)} / 5.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Jobs</p>
                    <p className="font-semibold">{Number(workerProfile.completedJobs)}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Reliability Score</p>
                <ReliabilityScoreBadge score={workerProfile.reliabilityScore} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Experience Level</p>
                <ExperienceLevelBadge level={workerProfile.experienceLevel} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {workerProfile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skillLabels[skill] || skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Wage Range</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    ₹{workerProfile.wageRange.min} - ₹{workerProfile.wageRange.max} per day
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Mobile Number</p>
                <p className="font-semibold">{workerProfile.mobileNumber}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkerQRCode workerId={workerProfile.id} />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Show this QR code to employers for attendance check-in
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
