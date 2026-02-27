
-- 1. Remove 'moderator' from is_admin_or_moderator (now only admin + content_admin)
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
      AND role IN ('admin', 'content_admin')
  )
$$;

-- 2. Create helper to check moderator specifically
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = public.current_user_profile_id()
      AND role = 'moderator'
  )
$$;

-- 3. Posts DELETE: users own + admin/content_admin + moderator
DROP POLICY IF EXISTS "Users can delete their own posts or moderators can delete any" ON public.posts;
CREATE POLICY "Users can delete their own posts or moderators can delete any"
ON public.posts
FOR DELETE
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = posts.author_id AND profiles.user_id = auth.uid()))
  OR is_admin_or_moderator()
  OR is_moderator()
);

-- 4. Posts UPDATE: remove moderator from "update any" (only own + admin/content_admin)
DROP POLICY IF EXISTS "Users can update their own posts or moderators can update any" ON public.posts;
CREATE POLICY "Users can update their own posts or admins can update any"
ON public.posts
FOR UPDATE
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = posts.author_id AND profiles.user_id = auth.uid()))
  OR is_admin_or_moderator()
);

-- 5. Comments DELETE: add moderator ability to delete any comment
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments or moderators can delete any"
ON public.comments
FOR DELETE
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = comments.author_id AND profiles.user_id = auth.uid()))
  OR is_admin_or_moderator()
  OR is_moderator()
);
