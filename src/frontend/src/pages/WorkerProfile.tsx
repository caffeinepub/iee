import { useGetMyWorkerProfile, useGetVerifiedWorker } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MapPin, Star, TrendingUp, Briefcase } from 'lucide-react';
import WorkerQRCode from '../components/WorkerQRCode';
import VerificationBadge from '../components/VerificationBadge';

export default function WorkerProfile() {
  const { data: profile, isLoading } = useGetMyWorkerProfile();
  const { data: verifiedWorker } = useGetVerifiedWorker(profile?.id);

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold">{profile.name}</h1>
            {verifiedWorker && verifiedWorker.badgeLevel !== 'none' && (
              <VerificationBadge
                badgeLevel={verifiedWorker.badgeLevel}
                completedJobs={Number(verifiedWorker.completedJobs)}
                size="lg"
              />
            )}
          </div>
          <p className="text-muted-foreground">Worker Profile</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reliability Score
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{profile.reliabilityScore.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
              <Star className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{profile.rating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">Average rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Jobs
              </CardTitle>
              <Briefcase className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{Number(profile.completedJobs)}</p>
              <p className="text-xs text-muted-foreground mt-1">Total jobs</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mobile Number</p>
                <p className="font-medium">{profile.mobileNumber}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Wage Range</p>
                <p className="font-medium">
                  ₹{profile.wageRange.min} - ₹{profile.wageRange.max} per day
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    {profile.coordinates.latitude.toFixed(4)}, {profile.coordinates.longitude.toFixed(4)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Availability</p>
                <Badge variant={profile.isAvailable ? 'default' : 'secondary'}>
                  {profile.isAvailable ? 'Available' : 'Not Available'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.skills.map((skillData, index) => (
                  <div key={`${skillData.skill}-${index}`} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold capitalize">
                        {skillData.skill.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <Badge variant="outline" className="capitalize">
                        {skillData.experienceLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Number(skillData.yearsOfExperience)} years of experience
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>QR Code for Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WorkerQRCode workerId={profile.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
