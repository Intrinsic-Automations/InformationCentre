-- Drop the existing buggy DELETE policy on likes table
DROP POLICY IF EXISTS "Users can unlike their own likes" ON public.likes;

-- Create the corrected DELETE policy that properly checks ownership
-- The likes table has user_id which references profiles.id
-- We need to ensure the authenticated user can only delete their own likes
CREATE POLICY "Users can unlike their own likes" 
ON public.likes 
FOR DELETE 
USING (
  user_id IN (
    SELECT id FROM profiles WHERE profiles.user_id = auth.uid()
  )
);