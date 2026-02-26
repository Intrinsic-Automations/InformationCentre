
-- 1. execution_documents - only admin/moderator can delete
DROP POLICY IF EXISTS "Users can delete their own execution documents" ON public.execution_documents;
CREATE POLICY "Only admins and moderators can delete execution documents"
ON public.execution_documents FOR DELETE
TO authenticated
USING (is_admin_or_moderator());

-- 2. hr_topic_documents - only admin/moderator can delete
DROP POLICY IF EXISTS "Users can delete their own HR/training documents" ON public.hr_topic_documents;
CREATE POLICY "Only admins and moderators can delete HR training documents"
ON public.hr_topic_documents FOR DELETE
TO authenticated
USING (is_admin_or_moderator());

-- 3. project_documents - only admin/moderator can delete
DROP POLICY IF EXISTS "Users can delete their own project documents" ON public.project_documents;
CREATE POLICY "Only admins and moderators can delete project documents"
ON public.project_documents FOR DELETE
TO authenticated
USING (is_admin_or_moderator());

-- 4. project_insight_documents - only admin/moderator can delete
DROP POLICY IF EXISTS "Insight authors can delete documents" ON public.project_insight_documents;
CREATE POLICY "Only admins and moderators can delete insight documents"
ON public.project_insight_documents FOR DELETE
TO authenticated
USING (is_admin_or_moderator());

-- 5. customer_documents - only admin/moderator can delete AND update
DROP POLICY IF EXISTS "Authenticated users can delete customer documents" ON public.customer_documents;
CREATE POLICY "Only admins and moderators can delete customer documents"
ON public.customer_documents FOR DELETE
TO authenticated
USING (is_admin_or_moderator());

DROP POLICY IF EXISTS "Authenticated users can update customer documents" ON public.customer_documents;
CREATE POLICY "Only admins and moderators can update customer documents"
ON public.customer_documents FOR UPDATE
TO authenticated
USING (is_admin_or_moderator());

-- 6. training_resource_links - only admin/moderator can delete
DROP POLICY IF EXISTS "Users can delete their own training resource links or legacy li" ON public.training_resource_links;
CREATE POLICY "Only admins and moderators can delete training resource links"
ON public.training_resource_links FOR DELETE
TO authenticated
USING (is_admin_or_moderator());
