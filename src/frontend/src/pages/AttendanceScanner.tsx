import { useState } from 'react';
import { useQRScanner } from '../qr-code/useQRScanner';
import { useCheckInWorker, useCheckOutWorker } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Camera, CameraOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendanceScanner() {
  const [scannedData, setScannedData] = useState<{ workerId: string; jobId: string } | null>(null);
  const [action, setAction] = useState<'checkIn' | 'checkOut'>('checkIn');

  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 5,
  });

  const checkInMutation = useCheckInWorker();
  const checkOutMutation = useCheckOutWorker();

  const handleScan = async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.workerId && parsed.jobId) {
        setScannedData(parsed);
        
        if (action === 'checkIn') {
          await checkInMutation.mutateAsync({
            jobId: parsed.jobId,
            workerId: parsed.workerId,
          });
          toast.success('Worker checked in successfully');
        } else {
          await checkOutMutation.mutateAsync({
            jobId: parsed.jobId,
            workerId: parsed.workerId,
          });
          toast.success('Worker checked out successfully');
        }
        
        clearResults();
        setScannedData(null);
      }
    } catch (err) {
      toast.error('Invalid QR code format');
    }
  };

  // Process latest QR result
  if (qrResults.length > 0 && !scannedData) {
    const latestResult = qrResults[0];
    handleScan(latestResult.data);
  }

  if (isSupported === false) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Camera Not Supported</CardTitle>
            <CardDescription>Your device does not support camera access</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Attendance Scanner</CardTitle>
          <CardDescription>Scan worker QR codes to record attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Toggle */}
          <div className="flex gap-2">
            <Button
              variant={action === 'checkIn' ? 'default' : 'outline'}
              onClick={() => setAction('checkIn')}
              className="flex-1"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Check In
            </Button>
            <Button
              variant={action === 'checkOut' ? 'default' : 'outline'}
              onClick={() => setAction('checkOut')}
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Check Out
            </Button>
          </div>

          {/* Camera Preview */}
          <div className="relative w-full bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '300px' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              style={{ display: isActive ? 'block' : 'none' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                </div>
              </div>
            )}

            {isActive && isScanning && (
              <div className="absolute top-4 right-4">
                <Badge variant="default" className="bg-green-600">
                  Scanning...
                </Badge>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive font-medium">Error: {error.message}</p>
              {error.type === 'permission' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Please grant camera permission to use the scanner
                </p>
              )}
            </div>
          )}

          {/* Camera Controls */}
          <div className="flex gap-2">
            <Button
              onClick={startScanning}
              disabled={!canStartScanning || isLoading}
              className="flex-1"
            >
              <Camera className="mr-2 h-4 w-4" />
              {isLoading ? 'Starting...' : 'Start Scanner'}
            </Button>
            <Button
              onClick={stopScanning}
              disabled={isLoading || !isActive}
              variant="outline"
              className="flex-1"
            >
              <CameraOff className="mr-2 h-4 w-4" />
              Stop Scanner
            </Button>
            {isMobile && (
              <Button
                onClick={switchCamera}
                disabled={isLoading || !isActive}
                variant="outline"
              >
                Switch Camera
              </Button>
            )}
          </div>

          {/* Recent Scans */}
          {qrResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Recent Scans</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {qrResults.map((result) => (
                  <div
                    key={result.timestamp}
                    className="p-3 bg-muted rounded-lg text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-mono text-xs break-all flex-1">{result.data}</p>
                      <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={clearResults} variant="outline" size="sm" className="w-full">
                Clear Results
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Instructions</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Select Check In or Check Out action</li>
              <li>Click "Start Scanner" to activate the camera</li>
              <li>Point the camera at the worker's QR code</li>
              <li>The system will automatically process the scan</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
