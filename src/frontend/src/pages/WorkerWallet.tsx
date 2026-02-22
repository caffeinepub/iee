import { useGetMyWorkerProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { DollarSign, Calendar, Download, AlertCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function WorkerWallet() {
  const navigate = useNavigate();
  const { data: workerProfile, isLoading } = useGetMyWorkerProfile();

  const payments = workerProfile?.paymentHistory || [];
  const totalEarnings = payments.filter((p) => p.paymentStatus === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0;
  const pendingEarnings = payments.filter((p) => p.paymentStatus === 'pending').reduce((sum, p) => sum + p.amount, 0) || 0;

  const exportToCSV = () => {
    const headers = ['Job ID', 'Amount', 'Payment Date', 'Payment Method', 'Status', 'Running Balance'];
    const rows = payments.map((p) => [
      p.jobId,
      p.amount.toFixed(2),
      new Date(Number(p.paymentDate) / 1000000).toLocaleDateString(),
      p.paymentMethod,
      p.paymentStatus,
      p.runningBalance.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash',
      bankTransfer: 'Bank Transfer',
      mobileMoney: 'Mobile Money',
      crypto: 'Cryptocurrency',
    };
    return labels[method] || method;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'outline' | 'destructive'> = {
      completed: 'default',
      pending: 'outline',
      failed: 'destructive',
    };
    return variants[status] || 'outline';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Wallet</h1>

      {/* Simulation Banner */}
      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <p className="font-semibold">SIMULATED PAYMENT DATA</p>
          <p className="text-sm">No real transactions are processed. This is a demonstration of payment tracking functionality.</p>
        </AlertDescription>
      </Alert>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <p className="text-4xl font-bold">₹{totalEarnings.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {payments.filter((p) => p.paymentStatus === 'completed').length} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <p className="text-4xl font-bold">₹{pendingEarnings.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {payments.filter((p) => p.paymentStatus === 'pending').length} pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment History</CardTitle>
            {payments.length > 0 && (
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No payment records yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, idx) => (
                <div key={idx} className="flex justify-between items-start p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => navigate({ to: '/worker/history' })}
                        className="font-semibold hover:text-primary transition-colors flex items-center gap-1"
                      >
                        Job ID: {payment.jobId}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(Number(payment.paymentDate) / 1000000).toLocaleDateString()} at{' '}
                        {new Date(Number(payment.paymentDate) / 1000000).toLocaleTimeString()}
                      </div>
                      <span>•</span>
                      <span>{getPaymentMethodLabel(payment.paymentMethod)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold mb-1">₹{payment.amount.toFixed(2)}</p>
                    <Badge variant={getStatusBadge(payment.paymentStatus)} className="mb-1">
                      {payment.paymentStatus}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Balance: ₹{payment.runningBalance.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
