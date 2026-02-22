import { useGetWorkerNotifications, useUpdateJobReminders } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import NotificationList from '../components/NotificationList';
import { JobReminders } from '../backend';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkerNotifications() {
  const { data: notifications, isLoading, refetch } = useGetWorkerNotifications();
  const updateReminder = useUpdateJobReminders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const allNotifications = notifications || [];
  const unreadNotifications = allNotifications.filter((n) => !n.confirmationSent);
  const reminders = allNotifications.filter((n) => n.reminderSent);
  const confirmations = allNotifications.filter((n) => n.confirmationSent);

  const handleMarkAsRead = async (notification: JobReminders) => {
    try {
      await updateReminder.mutateAsync({
        ...notification,
        confirmationSent: true,
      });
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Notifications refreshed');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/assets/generated/icon-notification.dim_64x64.png"
                alt="Notifications"
                className="w-12 h-12"
              />
              <h1 className="text-4xl font-bold">Notifications</h1>
            </div>
            <p className="text-muted-foreground">
              {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All ({allNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread ({unreadNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="reminders">
                  Reminders ({reminders.length})
                </TabsTrigger>
                <TabsTrigger value="confirmations">
                  Confirmations ({confirmations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <NotificationList notifications={allNotifications} onMarkAsRead={handleMarkAsRead} />
              </TabsContent>

              <TabsContent value="unread" className="mt-6">
                <NotificationList
                  notifications={unreadNotifications}
                  onMarkAsRead={handleMarkAsRead}
                />
              </TabsContent>

              <TabsContent value="reminders" className="mt-6">
                <NotificationList notifications={reminders} onMarkAsRead={handleMarkAsRead} />
              </TabsContent>

              <TabsContent value="confirmations" className="mt-6">
                <NotificationList notifications={confirmations} onMarkAsRead={handleMarkAsRead} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
