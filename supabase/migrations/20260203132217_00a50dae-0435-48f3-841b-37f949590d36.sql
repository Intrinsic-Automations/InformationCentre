-- Add policy to allow admins to delete any profile
CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = public.current_profile_id()
    AND ur.role = 'admin'
  )
);

-- Create a function to safely remove a user by reassigning their content first
CREATE OR REPLACE FUNCTION public.remove_user_and_reassign_content(
  p_user_profile_id UUID,
  p_admin_profile_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reassign content to admin
  UPDATE public.announcements SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.news SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.posts SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.comments SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.project_insights SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.partnerships SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.solutions SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.customers SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.projects SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  
  -- Delete user-specific records that shouldn't be reassigned
  DELETE FROM public.likes WHERE user_id = p_user_profile_id;
  DELETE FROM public.notifications WHERE user_id = p_user_profile_id;
  DELETE FROM public.notification_preferences WHERE user_id = p_user_profile_id;
  DELETE FROM public.user_roles WHERE user_id = p_user_profile_id;
  DELETE FROM public.training_progress WHERE user_id = p_user_profile_id;
  DELETE FROM public.customer_access WHERE user_id = p_user_profile_id OR granted_by = p_user_profile_id;
  DELETE FROM public.project_members WHERE profile_id = p_user_profile_id;
  
  -- Set uploaded_by to null for documents (preserves documents)
  UPDATE public.project_documents SET uploaded_by = NULL WHERE uploaded_by = p_user_profile_id;
  UPDATE public.hr_topic_documents SET uploaded_by = NULL WHERE uploaded_by = p_user_profile_id;
  UPDATE public.execution_documents SET uploaded_by = NULL WHERE uploaded_by = p_user_profile_id;
  UPDATE public.project_insight_documents SET uploaded_by = NULL WHERE uploaded_by = p_user_profile_id;
  UPDATE public.training_resource_links SET created_by = NULL WHERE created_by = p_user_profile_id;
  
  -- Clear reports_to references
  UPDATE public.profiles SET reports_to = NULL WHERE reports_to = p_user_profile_id;
  
  -- Finally delete the profile
  DELETE FROM public.profiles WHERE id = p_user_profile_id;
  
  RETURN TRUE;
END;
$$;