import { useGetMyJobPostings } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Briefcase, Users, CheckCircle, TrendingUp } from 'lucide-react';

export default function EmployerDashboard() {
  const { data: jobs, isLoading } = useGetMyJobPostings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter((j) => !j.isCompleted).length || 0;
  const totalWorkers = jobs?.reduce((sum, j) => sum + j.assignedWorkers.length, 0) || 0;
  const completedJobs = jobs?.filter((j) => j.isCompleted).length || 0;
  const completionRate = totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(1) : '0';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
        <p className="text-muted-foreground">Overview of your workforce and job postings</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalJobs}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeJobs}</p>
            <p className="text-xs text-muted-foreground mt-1">Currently open</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workers</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalWorkers}</p>
            <p className="text-xs text-muted-foreground mt-1">Assigned to jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">{completedJobs} completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {!jobs || jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No jobs posted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{job.jobDescription}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.assignedWorkers.length}/{Number(job.workerCount)} workers assigned
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹{job.wageAmount}</p>
                      <p className="text-xs text-muted-foreground">{job.duration} days</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/employer/jobs/create"
                className="block p-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Post New Job</p>
                    <p className="text-sm opacity-90">Create a new job posting</p>
                  </div>
                </div>
              </a>

              <a
                href="/employer/jobs"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">View All Jobs</p>
                    <p className="text-sm text-muted-foreground">Manage your job postings</p>
                  </div>
                </div>
              </a>

              <a
                href="/employer/attendance"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Scan Attendance</p>
                    <p className="text-sm text-muted-foreground">Check-in/out workers</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
