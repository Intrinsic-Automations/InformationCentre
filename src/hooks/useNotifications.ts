import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Notification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string | null;
  resource_id: string | null;
  resource_type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationPreference {
  id: string;
  user_id: string;
  notification_type: string;
  is_enabled: boolean;
}

const NOTIFICATION_TYPES = [
  { type: 'announcements', label: 'Announcements', route: '/announcements' },
  { type: 'project_insights', label: 'Project Insights', route: '/projects-insights' },
  { type: 'news', label: 'News', route: '/news' },
  { type: 'introductions', label: 'Introductions', route: '/introductions' },
  { type: 'wins', label: 'Wins', route: '/wins' },
  { type: 'partnerships', label: 'Partnerships', route: '/partnerships' },
] as const;

export function useNotifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    setNotifications(data || []);
    setUnreadCount(data?.filter((n) => !n.is_read).length || 0);
  }, [profile?.id]);

  const fetchPreferences = useCallback(async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*");

    if (error) {
      console.error("Error fetching preferences:", error);
      return;
    }

    setPreferences(data || []);
  }, [profile?.id]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchNotifications(), fetchPreferences()]);
      setIsLoading(false);
    };

    if (profile?.id) {
      loadData();
    }
  }, [profile?.id, fetchNotifications, fetchPreferences]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (error) {
      console.error("Error marking all as read:", error);
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const updatePreference = async (notificationType: string, isEnabled: boolean) => {
    if (!profile?.id) return;

    const existingPref = preferences.find((p) => p.notification_type === notificationType);

    if (existingPref) {
      const { error } = await supabase
        .from("notification_preferences")
        .update({ is_enabled: isEnabled })
        .eq("id", existingPref.id);

      if (error) {
        console.error("Error updating preference:", error);
        return;
      }

      setPreferences((prev) =>
        prev.map((p) =>
          p.notification_type === notificationType ? { ...p, is_enabled: isEnabled } : p
        )
      );
    } else {
      const { data, error } = await supabase
        .from("notification_preferences")
        .insert({
          user_id: profile.id,
          notification_type: notificationType,
          is_enabled: isEnabled,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating preference:", error);
        return;
      }

      setPreferences((prev) => [...prev, data]);
    }
  };

  const getPreferenceStatus = (notificationType: string): boolean => {
    const pref = preferences.find((p) => p.notification_type === notificationType);
    return pref ? pref.is_enabled : true; // Default to enabled
  };

  const getRouteForNotification = (notification: Notification): string => {
    const typeConfig = NOTIFICATION_TYPES.find((t) => t.type === notification.notification_type);
    return typeConfig?.route || '/';
  };

  return {
    notifications,
    preferences,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    updatePreference,
    getPreferenceStatus,
    getRouteForNotification,
    notificationTypes: NOTIFICATION_TYPES,
    refetch: fetchNotifications,
  };
}
