import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

interface NotificationListProps {
  onClose: () => void;
  onOpenPreferences: () => void;
}

const notificationTypeLabels: Record<string, string> = {
  announcements: "Announcement",
  project_insights: "Project Insight",
  news: "News",
  introductions: "Introduction",
  wins: "Win",
  partnerships: "Partnership",
};

export function NotificationList({ onClose, onOpenPreferences }: NotificationListProps) {
  const navigate = useNavigate();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getRouteForNotification,
  } = useNotifications();

  const handleNotificationClick = async (notification: {
    id: string;
    is_read: boolean;
    notification_type: string;
    resource_id: string | null;
    resource_type: string;
    title: string;
    message: string | null;
    user_id: string;
    created_at: string;
  }) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    const route = getRouteForNotification(notification);
    navigate(route);
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm">Notifications</h3>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onOpenPreferences}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-[400px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              You'll be notified when someone posts new content
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <button
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors",
                    !notification.is_read && "bg-primary/5"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1.5 h-2 w-2 rounded-full shrink-0",
                        notification.is_read ? "bg-transparent" : "bg-primary"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {notificationTypeLabels[notification.notification_type] ||
                          notification.notification_type}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </button>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
