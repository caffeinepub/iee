import { useGetMyWorkerProfile, useGetWorkerPaymentHistory } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { DollarSign, Calendar } from 'lucide-react';

export default function WorkerWallet() {
  const { data: workerProfile } = useGetMyWorkerProfile();
  const { data: payments, isLoading } = useGetWorkerPaymentHistory(workerProfile?.id);

  const totalEarnings = payments?.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0) || 0;
  const pendingEarnings = payments?.filter(p => !p.isPaid).reduce((sum, p) => sum + p.amount, 0) || 0;

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Wallet</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Total Earnings</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <p className="text-4xl font-bold">₹{totalEarnings.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Payments</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <p className="text-4xl font-bold">₹{pendingEarnings.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          {!payments || payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No payment records yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">Job ID: {payment.jobId}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(Number(payment.paymentDate) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">₹{payment.amount}</p>
                    <Badge variant={payment.isPaid ? 'default' : 'outline'}>
                      {payment.isPaid ? 'Paid' : 'Pending'}
                    </Badge>
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
