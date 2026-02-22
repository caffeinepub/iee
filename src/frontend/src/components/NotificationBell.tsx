import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { useGetWorkerNotifications } from '../hooks/useQueries';

export default function NotificationBell() {
  const navigate = useNavigate();
  const { data: notifications } = useGetWorkerNotifications();

  const unreadCount = notifications?.filter((n) => !n.confirmationSent).length || 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate({ to: '/worker/notifications' })}
    >
      <Bell className="h-5 w-5" />
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
