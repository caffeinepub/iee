import { useGetMyWorkerProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

export default function WorkHistory() {
  const { data: workerProfile, isLoading } = useGetMyWorkerProfile();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  const records = workerProfile?.attendanceRecords || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Work History</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div><p className="text-sm text-muted-foreground">Total Jobs</p><p className="text-2xl font-bold">{Number(workerProfile?.completedJobs || 0)}</p></div>
              <div><p className="text-sm text-muted-foreground">Attendance Records</p><p className="text-2xl font-bold">{records.length}</p></div>
              <div><p className="text-sm text-muted-foreground">Rating</p><p className="text-2xl font-bold">{workerProfile?.rating.toFixed(1) || 'N/A'}</p></div>
            </div>
          </CardContent>
        </Card>

        {records.length === 0 ? (
          <Card><CardContent className="pt-6 text-center py-12"><p className="text-muted-foreground">No work history yet.</p></CardContent></Card>
        ) : (
          records.map((record, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
