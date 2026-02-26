
-- Drop existing management policy that uses profile levels
DROP POLICY IF EXISTS "Admins can manage company sites" ON public.company_sites;

-- Create new policies using is_admin_or_moderator() which includes content_admin
CREATE POLICY "Admins moderators and content admins can insert company sites"
ON public.company_sites
FOR INSERT
WITH CHECK (is_admin_or_moderator());

CREATE POLICY "Admins moderators and content admins can update company sites"
ON public.company_sites
FOR UPDATE
USING (is_admin_or_moderator());

CREATE POLICY "Admins moderators and content admins can delete company sites"
ON public.company_sites
FOR DELETE
USING (is_admin_or_moderator());
