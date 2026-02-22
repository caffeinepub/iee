import { useGetSystemMetrics, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const { data: metrics, isLoading: metricsLoading } = useGetSystemMetrics();

  useEffect(() => {
    if (!adminCheckLoading && !isAdmin) {
      navigate({ to: '/' });
    }
  }, [isAdmin, adminCheckLoading, navigate]);

  if (adminCheckLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Prepare subscription tier data for pie chart
  const tierData = metrics?.revenueMetrics.subscriptionTierDistribution.map((tier) => {
    const [name, percentage] = tier.split(': ');
    return { name, value: parseFloat(percentage) };
  }) || [];

  const COLORS = ['oklch(0.65 0.15 30)', 'oklch(0.60 0.12 120)', 'oklch(0.55 0.10 60)'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">System-wide metrics and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Total Workers</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number(metrics?.totalWorkersRegistered || 0)}</p>
            <p className="text-sm text-muted-foreground mt-1">registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Active Employers</CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number(metrics?.activeEmployersCount || 0)}</p>
            <p className="text-sm text-muted-foreground mt-1">companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Job Fill Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics?.jobFillRate.toFixed(1) || 0}%</p>
            <p className="text-sm text-muted-foreground mt-1">{Number(metrics?.totalJobsPosted || 0)} jobs posted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Revenue Volume</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{metrics?.revenueMetrics.totalTransactionVolume.toFixed(0) || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">total transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Fill Rate Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics?.monthlyFillRates || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="fillRate" stroke="oklch(0.65 0.15 30)" strokeWidth={2} name="Fill Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Retention Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {metrics?.retentionMetrics.map((retention, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{retention.periodDays} Day Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Worker Retention</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{ width: `${retention.workerRetention}%` }}
                      ></div>
                    </div>
                    <p className="text-lg font-bold">{retention.workerRetention.toFixed(1)}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Employer Retention</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-3">
                      <div
                        className="bg-secondary h-3 rounded-full"
                        style={{ width: `${retention.employerRetention}%` }}
                      ></div>
                    </div>
                    <p className="text-lg font-bold">{retention.employerRetention.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Metrics (Simulation)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Total Transaction Volume</p>
              <p className="text-3xl font-bold">₹{metrics?.revenueMetrics.totalTransactionVolume.toFixed(2) || 0}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Average Revenue per Job</p>
              <p className="text-3xl font-bold">₹{metrics?.revenueMetrics.averageRevenuePerJob.toFixed(2) || 0}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              ⚠️ SIMULATION MODE - No actual payments are processed. These metrics are for demonstration purposes only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
