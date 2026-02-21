import { useState } from 'react';
import { useQRScanner } from '../qr-code/useQRScanner';
import { useCheckInWorker, useCheckOutWorker, useGetMyJobPostings } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';

export default function AttendanceScanner() {
  const { data: jobs } = useGetMyJobPostings();
  const checkIn = useCheckInWorker();
  const checkOut = useCheckOutWorker();
  const [selectedJob, setSelectedJob] = useState('');
  const [action, setAction] = useState<'checkin' | 'checkout'>('checkin');
  const [scannedWorkerId, setScannedWorkerId] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const {
    qrResults,
    isScanning,
    isActive,
    error,
    startScanning,
    stopScanning,
    videoRef,
    canvasRef,
    canStartScanning,
  } = useQRScanner({ facingMode: 'environment' });

  const handleScan = () => {
    if (qrResults.length > 0) {
      const latestScan = qrResults[0];
      setScannedWorkerId(latestScan.data);
      setShowDialog(true);
      stopScanning();
    }
  };

  const handleSubmit = async () => {
    if (!selectedJob || !scannedWorkerId) return;
    try {
      if (action === 'checkin') {
        await checkIn.mutateAsync({ jobId: selectedJob, workerId: scannedWorkerId });
        alert('Worker checked in successfully!');
      } else {
        await checkOut.mutateAsync({ jobId: selectedJob, workerId: scannedWorkerId });
        alert('Worker checked out successfully!');
      }
      setShowDialog(false);
      setScannedWorkerId('');
    } catch (error) {
      alert('Failed to process attendance. Please try again.');
    }
  };

  if (qrResults.length > 0 && !showDialog) {
    handleScan();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Attendance Scanner</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>QR Scanner</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '300px' }}>
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                <canvas ref={canvasRef} className="hidden" />
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white">Camera not active</p>
                  </div>
                )}
              </div>
              {error && <p className="text-destructive text-sm">{error.message}</p>}
              <div className="flex gap-2">
                <Button onClick={startScanning} disabled={!canStartScanning || isScanning} className="flex-1">
                  {isScanning ? 'Scanning...' : 'Start Scanner'}
                </Button>
                <Button onClick={stopScanning} disabled={!isActive} variant="outline" className="flex-1">
                  Stop Scanner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Scans</CardTitle></CardHeader>
          <CardContent>
            {qrResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No scans yet</p>
            ) : (
              <div className="space-y-2">
                {qrResults.slice(0, 5).map(result => (
                  <div key={result.timestamp} className="p-3 bg-muted rounded-lg">
                    <p className="font-mono text-sm">{result.data}</p>
                    <p className="text-xs text-muted-foreground">{new Date(result.timestamp).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Process Attendance</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Worker ID</Label><p className="font-mono mt-1">{scannedWorkerId}</p></div>
            <div><Label htmlFor="job">Select Job</Label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger><SelectValue placeholder="Choose a job" /></SelectTrigger>
                <SelectContent>
                  {jobs?.map(job => (
                    <SelectItem key={job.id} value={job.id}>{job.jobDescription} ({job.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label htmlFor="action">Action</Label>
              <Select value={action} onValueChange={(v) => setAction(v as 'checkin' | 'checkout')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkin">Check In</SelectItem>
                  <SelectItem value="checkout">Check Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} disabled={!selectedJob || checkIn.isPending || checkOut.isPending} className="w-full">
              {checkIn.isPending || checkOut.isPending ? 'Processing...' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
