-- Fix announcements ownership to use profiles.id (FK) and proper RLS

DROP POLICY IF EXISTS "Authenticated users can insert announcements" ON announcements;
DROP POLICY IF EXISTS "Users can update their own announcements" ON announcements;

CREATE POLICY "Authenticated users can insert announcements"
ON announcements
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.id = announcements.author_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own announcements"
ON announcements
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.id = announcements.author_id
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.id = announcements.author_id
      AND p.user_id = auth.uid()
  )
);