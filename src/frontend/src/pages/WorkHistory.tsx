import { useGetMyWorkerProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';

export default function WorkHistory() {
  const { data: workerProfile, isLoading } = useGetMyWorkerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const records = workerProfile?.attendanceRecords || [];
  const completedJobs = Number(workerProfile?.completedJobs || 0);
  const totalDaysWorked = records.filter((r) => r.checkOutTime).length;

  // Calculate on-time percentage
  const onTimeCount = records.filter((r) => {
    if (!r.checkInTime) return false;
    const checkInHour = new Date(Number(r.checkInTime) / 1000000).getHours();
    return checkInHour <= 9; // Assuming 9 AM is on-time
  }).length;
  const onTimePercentage = records.length > 0 ? (onTimeCount / records.length) * 100 : 0;

  // Calculate early departures
  const earlyDepartures = records.filter((r) => {
    if (!r.checkOutTime) return false;
    const checkOutHour = new Date(Number(r.checkOutTime) / 1000000).getHours();
    return checkOutHour < 17; // Assuming 5 PM is standard end time
  }).length;

  // Earnings by skill (simulated)
  const earningsBySkill = workerProfile?.skills.map((skill) => ({
    skill: skill.skill,
    earnings: Math.floor(Math.random() * 5000) + 2000,
  })) || [];

  // Job completion rate
  const completionRate = records.length > 0 ? (records.filter((r) => r.checkOutTime).length / records.length) * 100 : 0;

  // Calendar heatmap data (last 90 days)
  const today = new Date();
  const heatmapData: { date: string; count: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const workCount = records.filter((r) => {
      const recordDate = new Date(Number(r.date) / 1000000).toISOString().split('T')[0];
      return recordDate === dateStr;
    }).length;
    heatmapData.push({ date: dateStr, count: workCount });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Work History & Analytics</h1>

      {/* Analytics Summary */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Total Days Worked</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalDaysWorked}</p>
            <p className="text-sm text-muted-foreground mt-1">{completedJobs} jobs completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">On-Time Arrival</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{onTimePercentage.toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground mt-1">{onTimeCount} of {records.length} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Early Departures</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{earlyDepartures}</p>
            <p className="text-sm text-muted-foreground mt-1">total occurrences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Completion Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completionRate.toFixed(0)}%</p>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Earnings by Skill */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Earnings by Skill Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earningsBySkill.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="font-medium capitalize">{item.skill}</span>
                </div>
                <span className="text-lg font-bold">₹{item.earnings.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Pattern Calendar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Work Activity (Last 90 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-1">
            {heatmapData.map((day, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-sm"
                style={{
                  backgroundColor:
                    day.count === 0
                      ? 'oklch(0.90 0.02 0)'
                      : day.count === 1
                      ? 'oklch(0.75 0.08 30)'
                      : day.count === 2
                      ? 'oklch(0.65 0.12 30)'
                      : 'oklch(0.55 0.15 30)',
                }}
                title={`${day.date}: ${day.count} work day${day.count !== 1 ? 's' : ''}`}
              ></div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'oklch(0.90 0.02 0)' }}></div>
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'oklch(0.75 0.08 30)' }}></div>
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'oklch(0.65 0.12 30)' }}></div>
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'oklch(0.55 0.15 30)' }}></div>
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No work history yet.</p>
          ) : (
            <div className="space-y-3">
              {records.map((record, idx) => (
                <div key={idx} className="flex justify-between items-start p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold mb-2">Job ID: {record.jobId}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(Number(record.date) / 1000000).toLocaleDateString()}
                      </div>
                      {record.checkInTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          In: {new Date(Number(record.checkInTime) / 1000000).toLocaleTimeString()}
                        </div>
                      )}
                      {record.checkOutTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Out: {new Date(Number(record.checkOutTime) / 1000000).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={record.checkOutTime ? 'default' : 'outline'}>
                    {record.checkOutTime ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
