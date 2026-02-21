import { useGetAllJobPostings, useGetMyWorkerProfile } from '../hooks/useQueries';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { DollarSign, Clock, Users, MapPin } from 'lucide-react';

export default function JobDiscovery() {
  const { data: jobs, isLoading } = useGetAllJobPostings();
  const { data: workerProfile } = useGetMyWorkerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const skillLabels: Record<string, string> = {
    masonry: 'Masonry', plumbing: 'Plumbing', electrician: 'Electrician',
    carpentry: 'Carpentry', painting: 'Painting', roofing: 'Roofing',
    flooring: 'Flooring', tiling: 'Tiling', welding: 'Welding', generalLabor: 'General Labor',
  };

  const availableJobs = jobs?.filter(job => !job.isCompleted && job.assignedWorkers.length < Number(job.workerCount)) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Find Jobs</h1>
      {availableJobs.length === 0 ? (
        <Card><CardContent className="pt-6 text-center py-12">
          <img src="/assets/generated/no-jobs-illustration.dim_400x300.png" alt="No jobs" className="w-64 mx-auto mb-6 opacity-50" />
          <p className="text-muted-foreground">No jobs available at the moment.</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-6">
          {availableJobs.map(job => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{job.jobDescription}</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map(skill => (
                        <Badge key={skill} variant="secondary">{skillLabels[skill] || skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-muted-foreground">Wage</p><p className="font-semibold">₹{job.wageAmount}/day</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-muted-foreground">Duration</p><p className="font-semibold">{job.duration} days</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-muted-foreground">Positions</p><p className="font-semibold">{job.assignedWorkers.length}/{Number(job.workerCount)}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div><p className="text-sm text-muted-foreground">Shift</p><p className="font-semibold">{job.shiftTiming}</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
