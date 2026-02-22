import { useGetWorkerNotifications, useUpdateJobReminders } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertCircle, Calendar, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkerNotifications() {
  const { data: notifications, isLoading } = useGetWorkerNotifications();
  const updateReminders = useUpdateJobReminders();

  const handleMarkAsRead = async (notification: any) => {
    try {
      await updateReminders.mutateAsync({
        ...notification,
        confirmationSent: true,
      });
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your job assignments and reminders</p>
      </div>

      {!notifications || notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">
              You'll receive notifications about job assignments and reminders here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <Card key={`${notification.jobId}-${index}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {notification.cancelled ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : notification.confirmationSent ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : notification.reminderSent ? (
                      <Bell className="h-5 w-5 text-primary" />
                    ) : (
                      <Calendar className="h-5 w-5 text-blue-600" />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {notification.cancelled
                          ? 'Job Cancelled'
                          : notification.confirmationSent
                          ? 'Job Confirmed'
                          : notification.reminderSent
                          ? 'Job Reminder'
                          : 'Job Assignment'}
                      </CardTitle>
                      <CardDescription>Job ID: {notification.jobId}</CardDescription>
                    </div>
                  </div>
                  {!notification.confirmationSent && !notification.cancelled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification)}
                      disabled={updateReminders.isPending}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {notification.reminderSent && (
                    <Badge variant="secondary">Reminder Sent</Badge>
                  )}
                  {notification.updateSent && (
                    <Badge variant="secondary">Update Sent</Badge>
                  )}
                  {notification.confirmationSent && (
                    <Badge variant="default">Confirmed</Badge>
                  )}
                  {notification.cancelled && (
                    <Badge variant="destructive">Cancelled</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
