import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationList } from "./NotificationList";
import { NotificationPreferencesDialog } from "./NotificationPreferencesDialog";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <NotificationList
            onClose={() => setIsOpen(false)}
            onOpenPreferences={() => {
              setIsOpen(false);
              setShowPreferences(true);
            }}
          />
        </PopoverContent>
      </Popover>

      <NotificationPreferencesDialog
        open={showPreferences}
        onOpenChange={setShowPreferences}
      />
    </>
  );
}
