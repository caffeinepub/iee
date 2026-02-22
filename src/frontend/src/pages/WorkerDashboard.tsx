import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyWorkerProfile, useGetAllJobPostings } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Briefcase, TrendingUp, CheckCircle, DollarSign, MapPin, Calendar, ArrowRight } from 'lucide-react';
import ExperienceLevelBadge from '../components/ExperienceLevelBadge';
import { useEffect } from 'react';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: workerProfile, isLoading: profileLoading } = useGetMyWorkerProfile();
  const { data: allJobs = [], isLoading: jobsLoading } = useGetAllJobPostings();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (profileLoading || jobsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
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

  const myApplications = allJobs.filter((job) => job.assignedWorkers.includes(workerProfile.id));
  const availableJobs = allJobs.filter((job) => !job.isCompleted);

  const matchingJobs = availableJobs.filter((job) => {
    return job.requiredSkills.some((reqSkill) =>
      workerProfile.skills.some((workerSkill) => workerSkill.skill === reqSkill.skill)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {workerProfile.name}!</h1>
        <p className="text-muted-foreground text-lg">Here's your activity overview</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Applications</p>
                <p className="text-3xl font-bold">{myApplications.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Jobs</p>
                <p className="text-3xl font-bold">{availableJobs.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed Jobs</p>
                <p className="text-3xl font-bold">{Number(workerProfile.completedJobs)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reliability Score</p>
                <p className="text-3xl font-bold">{workerProfile.reliabilityScore.toFixed(1)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recommended Jobs</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/worker/jobs' })}>
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {matchingJobs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No matching jobs available at the moment.</p>
            ) : (
              <div className="space-y-4">
                {matchingJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                    <h3 className="font-semibold text-lg mb-2">{job.jobDescription}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <ExperienceLevelBadge key={`${job.id}-skill-${idx}`} level={skill.experienceLevel} />
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${job.wageAmount}/day
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {job.duration} days
                      </span>
                    </div>
                    <Button size="sm" onClick={() => navigate({ to: '/worker/jobs' })}>
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {myApplications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet.</p>
                <Button onClick={() => navigate({ to: '/worker/jobs' })}>Browse Jobs</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.slice(0, 3).map((job) => (
                  <div key={job.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{job.jobDescription}</h3>
                      <Badge variant={job.isCompleted ? 'default' : 'secondary'}>
                        {job.isCompleted ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${job.wageAmount}/day
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location.latitude.toFixed(2)}, {job.location.longitude.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/worker/jobs' })}>
          <CardContent className="pt-6 text-center">
            <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Find Jobs</h3>
            <p className="text-sm text-muted-foreground">Browse and apply to available jobs</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/worker/profile' })}>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">My Profile</h3>
            <p className="text-sm text-muted-foreground">View and update your profile</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/worker/history' })}>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Work History</h3>
            <p className="text-sm text-muted-foreground">View your completed jobs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
