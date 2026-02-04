-- Fix overly permissive RLS policies

-- 1. Fix execution_documents: Users should only insert documents they uploaded
DROP POLICY IF EXISTS "Authenticated users can upload execution documents" ON public.execution_documents;

CREATE POLICY "Users can insert their own execution documents"
ON public.execution_documents
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = public.current_profile_id() 
  OR uploaded_by IS NULL
);

-- 2. Fix notifications: Only the system (via triggers) should insert notifications
-- Remove the public insert policy and rely on the SECURITY DEFINER trigger function
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a restrictive insert policy - only service role can insert (handled by trigger)
-- Users should never directly insert notifications
CREATE POLICY "No direct user inserts for notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (false);

-- 3. Fix training_resource_links: Users should only insert links they created
DROP POLICY IF EXISTS "Authenticated users can insert training resource links" ON public.training_resource_links;

CREATE POLICY "Users can insert their own training resource links"
ON public.training_resource_links
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = public.current_profile_id()
  OR created_by IS NULL
);