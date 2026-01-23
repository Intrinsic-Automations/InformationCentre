-- Fix hr_topic_documents permissions so training materials can be updated/deleted reliably
-- We scope broader access ONLY to training-* topic slugs to avoid impacting HR documents.

-- Drop old policies (recreate with correct ownership + training fallback)
DROP POLICY IF EXISTS "Authenticated users can add HR topic documents" ON public.hr_topic_documents;
DROP POLICY IF EXISTS "Users can delete their own HR topic documents" ON public.hr_topic_documents;

-- Keep existing SELECT policy as-is (it may already exist); recreate defensively
DROP POLICY IF EXISTS "Anyone can view HR topic documents" ON public.hr_topic_documents;

CREATE POLICY "Anyone can view HR topic documents"
ON public.hr_topic_documents
FOR SELECT
USING (true);

-- Inserts must set uploaded_by to the caller's profile id
CREATE POLICY "Users can insert HR/training documents"
ON public.hr_topic_documents
FOR INSERT
WITH CHECK (uploaded_by = public.current_profile_id());

-- Allow updates/deletes by owner; additionally, allow managing legacy training docs
-- that have uploaded_by IS NULL (created before we started setting uploaded_by).
CREATE POLICY "Users can update their own HR/training documents"
ON public.hr_topic_documents
FOR UPDATE
USING (
  uploaded_by = public.current_profile_id()
  OR (
    auth.uid() IS NOT NULL
    AND uploaded_by IS NULL
    AND topic_slug LIKE 'training-%'
  )
)
WITH CHECK (
  uploaded_by = public.current_profile_id()
  OR (
    auth.uid() IS NOT NULL
    AND uploaded_by IS NULL
    AND topic_slug LIKE 'training-%'
  )
);

CREATE POLICY "Users can delete their own HR/training documents"
ON public.hr_topic_documents
FOR DELETE
USING (
  uploaded_by = public.current_profile_id()
  OR (
    auth.uid() IS NOT NULL
    AND uploaded_by IS NULL
    AND topic_slug LIKE 'training-%'
  )
);