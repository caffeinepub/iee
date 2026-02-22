import { useNavigate } from '@tanstack/react-router';
import { useGetMyJobPostings } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Briefcase, Users, DollarSign, Clock, MapPin, Upload } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Job Postings</h1>
          <p className="text-muted-foreground text-lg">Manage your active and completed jobs</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate({ to: '/employer/bulk-upload' })} variant="outline" size="default">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => navigate({ to: '/employer/jobs/create' })} size="default">
            <Briefcase className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <img
              src="/assets/generated/no-jobs-illustration.dim_400x300.png"
              alt="No jobs"
              className="mx-auto mb-6 w-64 h-48 object-contain"
            />
            <h3 className="text-2xl font-semibold mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground mb-6">Create your first job posting to start hiring workers</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate({ to: '/employer/jobs/create' })} size="lg">
                Create Job
              </Button>
              <Button onClick={() => navigate({ to: '/employer/bulk-upload' })} variant="outline" size="lg">
                Bulk Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{job.jobDescription}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skillLabels[skill.skill] || skill.skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant={job.isCompleted ? 'default' : 'outline'} className="text-base px-3 py-1">
                    {job.isCompleted ? 'Completed' : 'Active'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Wage</p>
                      <p className="font-semibold">₹{job.wageAmount}</p>
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
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold text-xs">
                        {job.location.latitude.toFixed(2)}, {job.location.longitude.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => navigate({ to: '/employer/attendance' })}>
                    View Details
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
