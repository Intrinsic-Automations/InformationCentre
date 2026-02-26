
-- 1. Partnerships - restrict INSERT to admin/moderator only
DROP POLICY IF EXISTS "Users can create partnerships" ON public.partnerships;
CREATE POLICY "Only admins and moderators can create partnerships"
ON public.partnerships FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_moderator());

-- Also restrict UPDATE/DELETE to admin/moderator + original author
DROP POLICY IF EXISTS "Users can update their own partnerships" ON public.partnerships;
CREATE POLICY "Admins moderators or authors can update partnerships"
ON public.partnerships FOR UPDATE
TO authenticated
USING (is_admin_or_moderator() OR (auth.uid() IN (SELECT profiles.user_id FROM profiles WHERE profiles.id = partnerships.author_id)));

DROP POLICY IF EXISTS "Users can delete their own partnerships" ON public.partnerships;
CREATE POLICY "Admins moderators or authors can delete partnerships"
ON public.partnerships FOR DELETE
TO authenticated
USING (is_admin_or_moderator() OR (auth.uid() IN (SELECT profiles.user_id FROM profiles WHERE profiles.id = partnerships.author_id)));

-- 2. Solutions - restrict INSERT to admin/moderator
DROP POLICY IF EXISTS "Authenticated users can create solutions" ON public.solutions;
CREATE POLICY "Only admins and moderators can create solutions"
ON public.solutions FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_moderator());

-- 3. execution_documents (Solution Centre pages) - restrict INSERT
DROP POLICY IF EXISTS "Users can insert their own execution documents" ON public.execution_documents;
CREATE POLICY "Only admins and moderators can insert execution documents"
ON public.execution_documents FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_moderator());

-- 4. hr_topic_documents (HR Centre & Learning pages) - restrict INSERT
DROP POLICY IF EXISTS "Users can insert HR/training documents" ON public.hr_topic_documents;
CREATE POLICY "Only admins and moderators can insert HR training documents"
ON public.hr_topic_documents FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_moderator());

-- 5. training_resource_links (Learning pages) - restrict INSERT
DROP POLICY IF EXISTS "Users can insert their own training resource links" ON public.training_resource_links;
CREATE POLICY "Only admins and moderators can insert training resource links"
ON public.training_resource_links FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_moderator());

-- 6. customer_documents (Sales Centre) - restrict INSERT
DROP POLICY IF EXISTS "Authenticated users can insert customer documents" ON public.customer_documents;
CREATE POLICY "Only admins and moderators can insert customer documents"
ON public.customer_documents FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_moderator());

-- 7. project_insight_documents - restrict INSERT
DROP POLICY IF EXISTS "Insight authors can add documents" ON public.project_insight_documents;
CREATE POLICY "Only admins and moderators can add insight documents"
ON public.project_insight_documents FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_moderator());

-- 8. project_documents - restrict INSERT
DROP POLICY IF EXISTS "Authenticated users can insert project documents" ON public.project_documents;
CREATE POLICY "Only admins and moderators can insert project documents"
ON public.project_documents FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_moderator());
