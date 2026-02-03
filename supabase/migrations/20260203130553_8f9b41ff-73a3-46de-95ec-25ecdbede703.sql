-- Helper function to check if user is admin or moderator
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = public.current_user_profile_id()
      AND role IN ('admin', 'moderator')
  )
$$;

-- Update posts policies: Allow moderators to edit/delete any post
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts or moderators can update any"
ON public.posts
FOR UPDATE
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = posts.author_id AND profiles.user_id = auth.uid()))
  OR public.is_admin_or_moderator()
);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts or moderators can delete any"
ON public.posts
FOR DELETE
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = posts.author_id AND profiles.user_id = auth.uid()))
  OR public.is_admin_or_moderator()
);

-- Update announcements policies: Allow moderators full management
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Authenticated users can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Users can update their own announcements" ON public.announcements;

-- Moderators and admins can do everything with announcements
CREATE POLICY "Admins and moderators can manage announcements"
ON public.announcements
FOR ALL
USING (public.is_admin_or_moderator())
WITH CHECK (public.is_admin_or_moderator());

-- Regular users can still create announcements
CREATE POLICY "Authenticated users can insert announcements"
ON public.announcements
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = announcements.author_id AND p.user_id = auth.uid())
);

-- Regular users can update their own announcements
CREATE POLICY "Users can update their own announcements"
ON public.announcements
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = announcements.author_id AND p.user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = announcements.author_id AND p.user_id = auth.uid())
);

-- Users can delete their own announcements
CREATE POLICY "Users can delete their own announcements"
ON public.announcements
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = announcements.author_id AND p.user_id = auth.uid())
);