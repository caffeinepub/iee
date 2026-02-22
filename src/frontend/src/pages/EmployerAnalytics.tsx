import { useGetMyJobPostings, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Clock, Users } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function EmployerAnalytics() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: jobs, isLoading } = useGetMyJobPostings();

  useEffect(() => {
    if (userProfile && userProfile.role !== 'employer') {
      navigate({ to: '/' });
    }
  }, [userProfile, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalJobs = jobs?.length || 0;
  const completedJobs = jobs?.filter((j) => j.isCompleted).length || 0;
  const completionRate = totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(1) : '0';

  // Skill-based reliability scores (simulated)
  const skillReliabilityData = [
    { skill: 'Masonry', avgReliability: 4.5 },
    { skill: 'Plumbing', avgReliability: 4.2 },
    { skill: 'Electrician', avgReliability: 4.7 },
    { skill: 'Carpentry', avgReliability: 4.3 },
    { skill: 'Painting', avgReliability: 4.1 },
  ];

  // Job completion trends (simulated monthly data)
  const completionTrends = [
    { month: 'Jan', rate: 75 },
    { month: 'Feb', rate: 80 },
    { month: 'Mar', rate: 85 },
    { month: 'Apr', rate: 82 },
    { month: 'May', rate: 88 },
    { month: 'Jun', rate: 90 },
  ];

  // Time-to-fill by skill (simulated)
  const timeToFillData = [
    { skill: 'Masonry', avgDays: 2.5 },
    { skill: 'Plumbing', avgDays: 1.8 },
    { skill: 'Electrician', avgDays: 3.2 },
    { skill: 'Carpentry', avgDays: 2.1 },
    { skill: 'Painting', avgDays: 1.5 },
  ];

  // Worker retention (simulated)
  const retentionRate = 85;

  // Top performers (simulated)
  const topPerformers = [
    { name: 'Worker W1', reliability: 4.9, completedJobs: 45 },
    { name: 'Worker W2', reliability: 4.8, completedJobs: 42 },
    { name: 'Worker W3', reliability: 4.7, completedJobs: 38 },
    { name: 'Worker W4', reliability: 4.6, completedJobs: 35 },
    { name: 'Worker W5', reliability: 4.5, completedJobs: 32 },
  ];

  const COLORS = ['oklch(0.65 0.15 30)', 'oklch(0.60 0.12 120)', 'oklch(0.55 0.10 60)', 'oklch(0.70 0.14 90)', 'oklch(0.58 0.11 45)'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Workforce Analytics</h1>
        <p className="text-muted-foreground text-lg">Performance insights and metrics for your workforce</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Completion Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completionRate}%</p>
            <p className="text-sm text-muted-foreground mt-1">{completedJobs} of {totalJobs} jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Avg Time to Fill</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2.2</p>
            <p className="text-sm text-muted-foreground mt-1">days per job</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Worker Retention</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{retentionRate}%</p>
            <p className="text-sm text-muted-foreground mt-1">repeat workers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Avg Reliability</CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">4.5</p>
            <p className="text-sm text-muted-foreground mt-1">out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Reliability Score by Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillReliabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="avgReliability" fill="oklch(0.65 0.15 30)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Completion Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={completionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="oklch(0.60 0.12 120)" strokeWidth={2} name="Completion Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Time to Fill by Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeToFillData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="skill" type="category" />
                <Tooltip />
                <Bar dataKey="avgDays" fill="oklch(0.55 0.10 60)" name="Days" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((worker, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{worker.name}</p>
                      <p className="text-sm text-muted-foreground">{worker.completedJobs} jobs completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{worker.reliability}</p>
                    <p className="text-xs text-muted-foreground">reliability</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
