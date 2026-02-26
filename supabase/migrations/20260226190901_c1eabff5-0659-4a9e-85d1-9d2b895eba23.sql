
-- Update is_admin_or_moderator to include content_admin
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = public.current_user_profile_id()
      AND role IN ('admin', 'moderator', 'content_admin')
  )
$$;

-- Create a helper to check if user is content_admin specifically
CREATE OR REPLACE FUNCTION public.is_content_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = public.current_user_profile_id()
      AND role = 'content_admin'
  )
$$;
