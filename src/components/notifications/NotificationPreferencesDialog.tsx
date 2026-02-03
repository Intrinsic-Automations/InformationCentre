import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeDescriptions: Record<string, string> = {
  announcements: "Company-wide announcements and updates",
  project_insights: "Tips and strategies from project experiences",
  news: "Industry news and company updates",
  introductions: "New team member introductions",
  wins: "Celebrate team achievements and successes",
  partnerships: "New partnership announcements",
};

export function NotificationPreferencesDialog({
  open,
  onOpenChange,
}: NotificationPreferencesDialogProps) {
  const { notificationTypes, getPreferenceStatus, updatePreference } =
    useNotifications();

  const handleToggle = async (type: string, enabled: boolean) => {
    await updatePreference(type, enabled);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>
            Choose which notifications you want to receive. You can turn off
            notifications for specific content types.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {notificationTypes.map((type) => {
            const isEnabled = getPreferenceStatus(type.type);
            return (
              <div
                key={type.type}
                className="flex items-center justify-between gap-4 rounded-lg border border-border p-4"
              >
                <div className="space-y-0.5">
                  <Label
                    htmlFor={`pref-${type.type}`}
                    className="text-sm font-medium"
                  >
                    {type.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {typeDescriptions[type.type]}
                  </p>
                </div>
                <Switch
                  id={`pref-${type.type}`}
                  checked={isEnabled}
                  onCheckedChange={(checked) => handleToggle(type.type, checked)}
                />
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
