-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'announcements', 'project_insights', 'news', 'introductions', 'wins', 'partnerships'
  title TEXT NOT NULL,
  message TEXT,
  resource_id UUID,
  resource_type TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));

-- System can insert notifications (via trigger with SECURITY DEFINER)
CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- RLS Policies for notification preferences
CREATE POLICY "Users can view their own preferences"
ON public.notification_preferences FOR SELECT
USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));

CREATE POLICY "Users can insert their own preferences"
ON public.notification_preferences FOR INSERT
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));

CREATE POLICY "Users can update their own preferences"
ON public.notification_preferences FOR UPDATE
USING (user_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Function to create notifications for all users except the author
CREATE OR REPLACE FUNCTION public.create_notifications_for_all_users()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_profile_id UUID;
  notification_title TEXT;
  notification_type TEXT;
  resource_type TEXT;
BEGIN
  -- Determine notification type and title based on table
  IF TG_TABLE_NAME = 'announcements' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    notification_type := 'announcements';
    resource_type := 'announcement';
  ELSIF TG_TABLE_NAME = 'project_insights' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    notification_type := 'project_insights';
    resource_type := 'project_insight';
  ELSIF TG_TABLE_NAME = 'news' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    notification_type := 'news';
    resource_type := 'news';
  ELSIF TG_TABLE_NAME = 'partnerships' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.partner_name;
    notification_type := 'partnerships';
    resource_type := 'partnership';
  ELSIF TG_TABLE_NAME = 'posts' THEN
    -- Only handle introductions and wins, not europe_chat
    IF NEW.channel = 'introductions' THEN
      author_profile_id := NEW.author_id;
      notification_title := COALESCE(NEW.title, 'New Introduction');
      notification_type := 'introductions';
      resource_type := 'post';
    ELSIF NEW.channel = 'wins' THEN
      author_profile_id := NEW.author_id;
      notification_title := COALESCE(NEW.title, 'New Win');
      notification_type := 'wins';
      resource_type := 'post';
    ELSE
      -- Skip europe_chat and other channels
      RETURN NEW;
    END IF;
  ELSE
    RETURN NEW;
  END IF;

  -- Insert notifications for all active users except the author
  -- Respecting user preferences
  INSERT INTO public.notifications (user_id, notification_type, title, resource_id, resource_type)
  SELECT 
    p.id,
    notification_type,
    notification_title,
    NEW.id,
    resource_type
  FROM public.profiles p
  WHERE p.is_active = true
    AND p.id != author_profile_id
    AND NOT EXISTS (
      SELECT 1 FROM public.notification_preferences np
      WHERE np.user_id = p.id
        AND np.notification_type = create_notifications_for_all_users.notification_type
        AND np.is_enabled = false
    );

  RETURN NEW;
END;
$$;

-- Create triggers for each table
CREATE TRIGGER notify_on_announcement
AFTER INSERT ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.create_notifications_for_all_users();

CREATE TRIGGER notify_on_project_insight
AFTER INSERT ON public.project_insights
FOR EACH ROW
EXECUTE FUNCTION public.create_notifications_for_all_users();

CREATE TRIGGER notify_on_news
AFTER INSERT ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.create_notifications_for_all_users();

CREATE TRIGGER notify_on_partnership
AFTER INSERT ON public.partnerships
FOR EACH ROW
EXECUTE FUNCTION public.create_notifications_for_all_users();

CREATE TRIGGER notify_on_post
AFTER INSERT ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.create_notifications_for_all_users();

-- Trigger for updated_at on preferences
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();