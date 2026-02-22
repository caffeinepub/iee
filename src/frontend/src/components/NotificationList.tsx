import { JobReminders } from '../backend';
import { Bell, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface NotificationListProps {
  notifications: JobReminders[];
  onMarkAsRead?: (notification: JobReminders) => void;
}

export default function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <img
          src="/assets/generated/icon-notification.dim_64x64.png"
          alt="No notifications"
          className="w-16 h-16 mx-auto mb-4 opacity-50"
        />
        <p className="text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  const getNotificationIcon = (notification: JobReminders) => {
    if (notification.cancelled) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (notification.confirmationSent) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (notification.reminderSent) {
      return <Bell className="h-5 w-5 text-yellow-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-blue-500" />;
  };

  const getNotificationMessage = (notification: JobReminders) => {
    if (notification.cancelled) {
      return `Job ${notification.jobId} has been cancelled`;
    }
    if (notification.updateSent) {
      return `Job ${notification.jobId} has been updated`;
    }
    if (notification.confirmationSent) {
      return `You are confirmed for job ${notification.jobId}`;
    }
    if (notification.reminderSent) {
      return `Reminder: Your shift for job ${notification.jobId} is coming up soon`;
    }
    return `New notification for job ${notification.jobId}`;
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification, index) => (
        <Card
          key={`${notification.jobId}-${notification.workerId}-${index}`}
          className={notification.confirmationSent ? 'opacity-60' : ''}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">{getNotificationIcon(notification)}</div>
              <div className="flex-1">
                <p className="font-medium">{getNotificationMessage(notification)}</p>
                <p className="text-sm text-muted-foreground mt-1">Job ID: {notification.jobId}</p>
              </div>
              {!notification.confirmationSent && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification)}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
