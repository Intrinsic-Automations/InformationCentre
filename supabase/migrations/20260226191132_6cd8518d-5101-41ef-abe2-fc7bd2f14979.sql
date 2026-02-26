
-- Table for lifecycle items across all 4 method pages
CREATE TABLE public.lifecycle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_slug text NOT NULL, -- 'migration', 'integration', 'installation', 'reporting-analytics'
  phase_id text NOT NULL, -- 'discovery-plan', 'prepare-requirements', etc.
  title text NOT NULL,
  description text,
  is_deliverable boolean NOT NULL DEFAULT false,
  has_template boolean NOT NULL DEFAULT true,
  responsible_role text,
  inputs text[] DEFAULT '{}',
  outputs text[] DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

ALTER TABLE public.lifecycle_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lifecycle items"
  ON public.lifecycle_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins moderators and content admins can insert lifecycle items"
  ON public.lifecycle_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_moderator());

CREATE POLICY "Admins moderators and content admins can update lifecycle items"
  ON public.lifecycle_items FOR UPDATE
  TO authenticated
  USING (is_admin_or_moderator());

CREATE POLICY "Admins moderators and content admins can delete lifecycle items"
  ON public.lifecycle_items FOR DELETE
  TO authenticated
  USING (is_admin_or_moderator());

-- Table for key meetings and tasks per phase per method
CREATE TABLE public.lifecycle_meetings_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_slug text NOT NULL,
  phase_id text NOT NULL,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('meeting', 'task')),
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

ALTER TABLE public.lifecycle_meetings_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lifecycle meetings tasks"
  ON public.lifecycle_meetings_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins moderators and content admins can insert lifecycle meetings tasks"
  ON public.lifecycle_meetings_tasks FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_moderator());

CREATE POLICY "Admins moderators and content admins can update lifecycle meetings tasks"
  ON public.lifecycle_meetings_tasks FOR UPDATE
  TO authenticated
  USING (is_admin_or_moderator());

CREATE POLICY "Admins moderators and content admins can delete lifecycle meetings tasks"
  ON public.lifecycle_meetings_tasks FOR DELETE
  TO authenticated
  USING (is_admin_or_moderator());

-- Table for editable training course content
CREATE TABLE public.training_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL UNIQUE,
  about_content text,
  objectives text[] DEFAULT '{}',
  duration text,
  level text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles(id)
);

ALTER TABLE public.training_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view training content"
  ON public.training_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins moderators and content admins can insert training content"
  ON public.training_content FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_moderator());

CREATE POLICY "Admins moderators and content admins can update training content"
  ON public.training_content FOR UPDATE
  TO authenticated
  USING (is_admin_or_moderator());

CREATE POLICY "Admins moderators and content admins can delete training content"
  ON public.training_content FOR DELETE
  TO authenticated
  USING (is_admin_or_moderator());

-- Add updated_at trigger for lifecycle_items
CREATE TRIGGER update_lifecycle_items_updated_at
  BEFORE UPDATE ON public.lifecycle_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for training_content
CREATE TRIGGER update_training_content_updated_at
  BEFORE UPDATE ON public.training_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
