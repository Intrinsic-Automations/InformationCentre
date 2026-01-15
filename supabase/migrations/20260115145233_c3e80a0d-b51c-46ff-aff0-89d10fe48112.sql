-- The issue is that RLS WITH CHECK runs BEFORE triggers in PostgreSQL
-- We need to make the INSERT policy validate the author_id matches the user's profile
-- But allow NULL author_id since trigger will set it

-- Update the INSERT policy to be simpler and work with the trigger
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
CREATE POLICY "Authenticated users can insert customers" ON public.customers
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    -- Either author_id is null (trigger will set it)
    author_id IS NULL
    OR
    -- Or author_id matches the current user's profile
    author_id = public.current_profile_id()
  )
);