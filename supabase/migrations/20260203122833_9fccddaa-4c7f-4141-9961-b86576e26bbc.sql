-- Fix the create_notifications_for_all_users function
-- The issue is referencing local variables with function name prefix
CREATE OR REPLACE FUNCTION public.create_notifications_for_all_users()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  author_profile_id UUID;
  notification_title TEXT;
  v_notification_type TEXT;
  resource_type TEXT;
BEGIN
  -- Determine notification type and title based on table
  IF TG_TABLE_NAME = 'announcements' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    v_notification_type := 'announcements';
    resource_type := 'announcement';
  ELSIF TG_TABLE_NAME = 'project_insights' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    v_notification_type := 'project_insights';
    resource_type := 'project_insight';
  ELSIF TG_TABLE_NAME = 'news' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    v_notification_type := 'news';
    resource_type := 'news';
  ELSIF TG_TABLE_NAME = 'partnerships' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.partner_name;
    v_notification_type := 'partnerships';
    resource_type := 'partnership';
  ELSIF TG_TABLE_NAME = 'posts' THEN
    -- Only handle introductions and wins, not europe_chat
    IF NEW.channel = 'introductions' THEN
      author_profile_id := NEW.author_id;
      notification_title := COALESCE(NEW.title, 'New Introduction');
      v_notification_type := 'introductions';
      resource_type := 'post';
    ELSIF NEW.channel = 'wins' THEN
      author_profile_id := NEW.author_id;
      notification_title := COALESCE(NEW.title, 'New Win');
      v_notification_type := 'wins';
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
    v_notification_type,
    notification_title,
    NEW.id,
    resource_type
  FROM public.profiles p
  WHERE p.is_active = true
    AND p.id != author_profile_id
    AND NOT EXISTS (
      SELECT 1 FROM public.notification_preferences np
      WHERE np.user_id = p.id
        AND np.notification_type = v_notification_type
        AND np.is_enabled = false
    );

  RETURN NEW;
END;
$function$;