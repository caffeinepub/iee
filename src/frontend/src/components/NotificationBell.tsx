import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { useGetWorkerNotifications } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Badge } from './ui/badge';

export default function NotificationBell() {
  const { data: notifications } = useGetWorkerNotifications();
  const navigate = useNavigate();

  const unreadCount = notifications?.filter(n => !n.confirmationSent).length || 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate({ to: '/worker/notifications' })}
    >
      <img
        src="/assets/generated/icon-notification.dim_64x64.png"
        alt="Notifications"
        className="w-5 h-5"
      />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
