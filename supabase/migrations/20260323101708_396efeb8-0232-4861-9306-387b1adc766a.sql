
CREATE TABLE public.method_feedback_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_slug text NOT NULL UNIQUE,
  feedback_url text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles(id)
);

ALTER TABLE public.method_feedback_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feedback links" ON public.method_feedback_links
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and content admins can manage feedback links" ON public.method_feedback_links
  FOR ALL TO authenticated USING (is_admin_or_moderator()) WITH CHECK (is_admin_or_moderator());
