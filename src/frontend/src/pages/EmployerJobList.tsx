import { useNavigate } from '@tanstack/react-router';
import { useGetMyJobPostings } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Briefcase, Users, DollarSign, Clock, MapPin } from 'lucide-react';

export default function EmployerJobList() {
  const navigate = useNavigate();
  const { data: jobs, isLoading } = useGetMyJobPostings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Job Postings</h1>
          <p className="text-muted-foreground">Manage your job listings and view applications</p>
        </div>
        <Button size="lg" onClick={() => navigate({ to: '/employer/jobs/create' })}>
          Post New Job
        </Button>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <img
              src="/assets/generated/no-jobs-illustration.dim_400x300.png"
              alt="No jobs"
              className="w-64 mx-auto mb-6 opacity-50"
            />
            <p className="text-muted-foreground mb-4">You haven't posted any jobs yet.</p>
            <Button onClick={() => navigate({ to: '/employer/jobs/create' })}>Post Your First Job</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{job.jobDescription}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skillLabels[skill] || skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant={job.isCompleted ? 'default' : 'outline'}>
                    {job.isCompleted ? 'Completed' : 'Active'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Wage</p>
                      <p className="font-semibold">₹{job.wageAmount}/day</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{job.duration} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Workers</p>
                      <p className="font-semibold">
                        {job.assignedWorkers.length}/{Number(job.workerCount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Shift</p>
                      <p className="font-semibold">{job.shiftTiming}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: `/employer/jobs/${job.id}/candidates` })}
                  >
                    View Candidates
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
