-- ============================================================
-- FULL SCHEMA EXPORT - EQommunity Hub
-- Generated from Cloud Supabase (janwnxaotmkqqdjmsbjf)
-- Run this AFTER docker compose up if migrations fail
-- ============================================================

-- ===================
-- 1. ENUMS
-- ===================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ===================
-- 2. TABLES (ordered by dependency)
-- ===================

-- profiles (referenced by most other tables)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  full_name text NOT NULL,
  initials text NOT NULL,
  email text,
  avatar_url text,
  department text,
  role text,
  level text,
  skills text[],
  is_active boolean NOT NULL DEFAULT true,
  reports_to uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'Company',
  published_at timestamptz NOT NULL DEFAULT now(),
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- posts
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.profiles(id),
  channel text NOT NULL,
  title text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- comments
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.posts(id),
  author_id uuid NOT NULL REFERENCES public.profiles(id),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- likes
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.posts(id),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- news
CREATE TABLE IF NOT EXISTS public.news (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  image_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- company_sites
CREATE TABLE IF NOT EXISTS public.company_sites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  url text NOT NULL,
  category text NOT NULL,
  icon text,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- customers
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.profiles(id),
  company_name text NOT NULL,
  contact_name text,
  contact_email text,
  contact_phone text,
  address text,
  website text,
  industry text,
  status text DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- customer_access
CREATE TABLE IF NOT EXISTS public.customer_access (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  granted_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- customer_documents
CREATE TABLE IF NOT EXISTS public.customer_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  document_name text NOT NULL,
  document_type text NOT NULL,
  document_url text,
  shared_date timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  opportunity_name text NOT NULL,
  estimated_value numeric,
  probability integer DEFAULT 0,
  expected_close_date date,
  stage text DEFAULT 'prospecting',
  status text DEFAULT 'active',
  priority text DEFAULT 'medium',
  deal_summary text,
  value_proposition text,
  compelling_reasons text,
  key_issues text,
  blockers text,
  opportunity_owner text,
  exec_owner text,
  industry text,
  eq_employees text[] DEFAULT '{}',
  eq_products text[] DEFAULT '{}',
  partner_prime_quotations text,
  quarter_to_close text,
  services_value numeric DEFAULT 0,
  software_sales numeric DEFAULT 0,
  start_date date,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- opportunity_action_steps
CREATE TABLE IF NOT EXISTS public.opportunity_action_steps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id),
  action_description text NOT NULL,
  owner text NOT NULL,
  due_date date,
  is_completed boolean NOT NULL DEFAULT false,
  rag_status text NOT NULL DEFAULT 'green',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- opportunity_interactions
CREATE TABLE IF NOT EXISTS public.opportunity_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id),
  interaction_type text NOT NULL,
  interaction_date timestamptz NOT NULL DEFAULT now(),
  summary text NOT NULL,
  attendees text,
  outcome text,
  next_steps text,
  presentation_shared text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- opportunity_stakeholders
CREATE TABLE IF NOT EXISTS public.opportunity_stakeholders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id),
  name text NOT NULL,
  role text NOT NULL,
  is_decision_maker boolean DEFAULT false,
  relationship_owner text,
  comments text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- partnerships
CREATE TABLE IF NOT EXISTS public.partnerships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES public.profiles(id),
  partner_name text NOT NULL,
  description text,
  partnership_type text,
  logo_url text,
  website_url text,
  contact_name text,
  contact_email text,
  since_year text,
  status text DEFAULT 'Active',
  is_active boolean NOT NULL DEFAULT true,
  key_benefits text[],
  focus_areas text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- projects
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES public.profiles(id),
  name text NOT NULL,
  description text,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'upcoming',
  stage text,
  client_name text,
  summary text,
  challenges text,
  tools_used text[],
  tickets_raised integer DEFAULT 0,
  deadline date,
  start_date date,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- project_members
CREATE TABLE IF NOT EXISTS public.project_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id),
  profile_id uuid NOT NULL REFERENCES public.profiles(id),
  role text DEFAULT 'Member',
  joined_at timestamptz NOT NULL DEFAULT now()
);

-- project_documents
CREATE TABLE IF NOT EXISTS public.project_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id),
  uploaded_by uuid REFERENCES public.profiles(id),
  document_name text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- project_insights
CREATE TABLE IF NOT EXISTS public.project_insights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  extended_content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- project_insight_documents
CREATE TABLE IF NOT EXISTS public.project_insight_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_id uuid NOT NULL REFERENCES public.project_insights(id),
  uploaded_by uuid REFERENCES public.profiles(id),
  name text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- solutions
CREATE TABLE IF NOT EXISTS public.solutions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES public.profiles(id),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  tags text[],
  document_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  notification_type text NOT NULL,
  title text NOT NULL,
  message text,
  resource_id uuid,
  resource_type text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- notification_preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  notification_type text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- training_modules
CREATE TABLE IF NOT EXISTS public.training_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  suite text NOT NULL,
  image_url text,
  duration_minutes integer,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- training_progress
CREATE TABLE IF NOT EXISTS public.training_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  module_id uuid NOT NULL REFERENCES public.training_modules(id),
  progress_percent integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- training_resource_links
CREATE TABLE IF NOT EXISTS public.training_resource_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_slug text NOT NULL,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- hr_topic_documents
CREATE TABLE IF NOT EXISTS public.hr_topic_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_slug text NOT NULL,
  document_name text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_type text,
  file_size text,
  uploaded_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- execution_documents
CREATE TABLE IF NOT EXISTS public.execution_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id text NOT NULL,
  document_name text NOT NULL,
  document_type text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size text,
  uploaded_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===================
-- 3. FUNCTIONS
-- ===================

CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_profile_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = public.current_user_profile_id()
      AND role IN ('admin', 'moderator')
  );
$$;

CREATE OR REPLACE FUNCTION public.user_can_access_customer(customer_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM customers c
    INNER JOIN profiles p ON p.id = c.author_id
    WHERE c.id = customer_id AND p.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM customer_access ca
    INNER JOIN profiles p ON p.id = ca.user_id
    WHERE ca.customer_id = customer_id AND p.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_customer_author_id()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  NEW.author_id := public.current_profile_id();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_default_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, initials)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(
      UPPER(LEFT(NEW.raw_user_meta_data->>'full_name', 1) ||
      COALESCE(SUBSTRING(NEW.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') + 1 FOR 1), '')),
      'NU'
    )
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_notifications_for_all_users()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  author_profile_id UUID;
  notification_title TEXT;
  v_notification_type TEXT;
  resource_type TEXT;
  author_is_valid BOOLEAN;
BEGIN
  IF TG_TABLE_NAME = 'announcements' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    v_notification_type := 'announcements';
    resource_type := 'announcement';
  ELSIF TG_TABLE_NAME = 'project_insights' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    v_notification_type := 'project_insights';
    resource_type := 'project_insight';
  ELSIF TG_TABLE_NAME = 'news' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.title;
    v_notification_type := 'news';
    resource_type := 'news';
  ELSIF TG_TABLE_NAME = 'partnerships' THEN
    author_profile_id := NEW.author_id;
    notification_title := NEW.partner_name;
    v_notification_type := 'partnerships';
    resource_type := 'partnership';
  ELSIF TG_TABLE_NAME = 'posts' THEN
    IF NEW.channel = 'introductions' THEN
      author_profile_id := NEW.author_id;
      notification_title := COALESCE(NEW.title, 'New Introduction');
      v_notification_type := 'introductions';
      resource_type := 'post';
    ELSIF NEW.channel = 'wins' THEN
      author_profile_id := NEW.author_id;
      notification_title := COALESCE(NEW.title, 'New Win');
      v_notification_type := 'wins';
      resource_type := 'post';
    ELSE
      RETURN NEW;
    END IF;
  ELSE
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = author_profile_id AND is_active = true
  ) INTO author_is_valid;

  IF NOT author_is_valid THEN
    RAISE WARNING 'Notification skipped: Invalid or inactive author_id %', author_profile_id;
    RETURN NEW;
  END IF;

  notification_title := LEFT(TRIM(notification_title), 200);

  INSERT INTO public.notifications (user_id, notification_type, title, resource_id, resource_type)
  SELECT p.id, v_notification_type, notification_title, NEW.id, resource_type
  FROM public.profiles p
  WHERE p.is_active = true
    AND p.id != author_profile_id
    AND NOT EXISTS (
      SELECT 1 FROM public.notification_preferences np
      WHERE np.user_id = p.id AND np.notification_type = v_notification_type AND np.is_enabled = false
    );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_user_and_reassign_content(p_user_profile_id uuid, p_admin_profile_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE public.announcements SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.news SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.posts SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.comments SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.project_insights SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.partnerships SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.solutions SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.customers SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  UPDATE public.projects SET author_id = p_admin_profile_id WHERE author_id = p_user_profile_id;
  DELETE FROM public.likes WHERE user_id = p_user_profile_id;
  DELETE FROM public.notifications WHERE user_id = p_user_profile_id;
  DELETE FROM public.notification_preferences WHERE user_id = p_user_profile_id;
  DELETE FROM public.user_roles WHERE user_id = p_user_profile_id;
  DELETE FROM public.training_progress WHERE user_id = p_user_profile_id;
  DELETE FROM public.customer_access WHERE user_id = p_user_profile_id OR granted_by = p_user_profile_id;
  DELETE FROM public.project_members WHERE profile_id = p_user_profile_id;
  UPDATE public.project_documents SET uploaded_by = NULL WHERE uploaded_by = p_user_profile_id;
  UPDATE public.hr_topic_documents SET uploaded_by = NULL WHERE uploaded_by = p_user_profile_id;
  UPDATE public.execution_documents SET uploaded_by = NULL WHERE uploaded_by = p_user_profile_id;
  UPDATE public.project_insight_documents SET uploaded_by = NULL WHERE uploaded_by = p_user_profile_id;
  UPDATE public.training_resource_links SET created_by = NULL WHERE created_by = p_user_profile_id;
  UPDATE public.profiles SET reports_to = NULL WHERE reports_to = p_user_profile_id;
  DELETE FROM public.profiles WHERE id = p_user_profile_id;
  RETURN TRUE;
END;
$$;

-- ===================
-- 4. TRIGGERS
-- ===================

-- Auth trigger (on auth.users - creates profile on signup)
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Assign default role on profile creation
DROP TRIGGER IF EXISTS on_profile_created_assign_role ON public.profiles;
CREATE TRIGGER on_profile_created_assign_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_user_role();

-- Set customer author_id automatically
DROP TRIGGER IF EXISTS set_customer_author ON public.customers;
CREATE TRIGGER set_customer_author
  BEFORE INSERT ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_customer_author_id();

-- Notification triggers
DROP TRIGGER IF EXISTS notify_on_announcement ON public.announcements;
CREATE TRIGGER notify_on_announcement
  AFTER INSERT ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.create_notifications_for_all_users();

DROP TRIGGER IF EXISTS notify_on_project_insight ON public.project_insights;
CREATE TRIGGER notify_on_project_insight
  AFTER INSERT ON public.project_insights
  FOR EACH ROW EXECUTE FUNCTION public.create_notifications_for_all_users();

DROP TRIGGER IF EXISTS notify_on_news ON public.news;
CREATE TRIGGER notify_on_news
  AFTER INSERT ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.create_notifications_for_all_users();

DROP TRIGGER IF EXISTS notify_on_partnership ON public.partnerships;
CREATE TRIGGER notify_on_partnership
  AFTER INSERT ON public.partnerships
  FOR EACH ROW EXECUTE FUNCTION public.create_notifications_for_all_users();

DROP TRIGGER IF EXISTS notify_on_post ON public.posts;
CREATE TRIGGER notify_on_post
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.create_notifications_for_all_users();

-- Updated_at triggers
CREATE OR REPLACE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_partnerships_updated_at BEFORE UPDATE ON public.partnerships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_solutions_updated_at BEFORE UPDATE ON public.solutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON public.training_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===================
-- 5. ENABLE RLS ON ALL TABLES
-- ===================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_action_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_insight_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_resource_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_topic_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_documents ENABLE ROW LEVEL SECURITY;

-- ===================
-- 6. RLS POLICIES
-- ===================

-- profiles
CREATE POLICY "Authenticated users can view profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = current_profile_id() AND ur.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = current_profile_id() AND ur.role = 'admin'));
CREATE POLICY "Admins can delete any profile" ON public.profiles FOR DELETE USING (EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = current_profile_id() AND ur.role = 'admin'));

-- user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (user_id = current_user_profile_id());
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(current_user_profile_id(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (has_role(current_user_profile_id(), 'admin')) WITH CHECK (has_role(current_user_profile_id(), 'admin'));

-- announcements
CREATE POLICY "Announcements are viewable by everyone" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert announcements" ON public.announcements FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = announcements.author_id AND p.user_id = auth.uid()));
CREATE POLICY "Users can update their own announcements" ON public.announcements FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = announcements.author_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = announcements.author_id AND p.user_id = auth.uid()));
CREATE POLICY "Users can delete their own announcements" ON public.announcements FOR DELETE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = announcements.author_id AND p.user_id = auth.uid()));
CREATE POLICY "Admins and moderators can manage announcements" ON public.announcements FOR ALL USING (is_admin_or_moderator()) WITH CHECK (is_admin_or_moderator());

-- posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own posts or moderators can update any" ON public.posts FOR UPDATE USING ((EXISTS (SELECT 1 FROM profiles WHERE profiles.id = posts.author_id AND profiles.user_id = auth.uid())) OR is_admin_or_moderator());
CREATE POLICY "Users can delete their own posts or moderators can delete any" ON public.posts FOR DELETE USING ((EXISTS (SELECT 1 FROM profiles WHERE profiles.id = posts.author_id AND profiles.user_id = auth.uid())) OR is_admin_or_moderator());

-- comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = comments.author_id AND profiles.user_id = auth.uid()));
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = comments.author_id AND profiles.user_id = auth.uid()));

-- likes
CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON public.likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can unlike their own likes" ON public.likes FOR DELETE USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- news
CREATE POLICY "News are viewable by everyone" ON public.news FOR SELECT USING (true);
CREATE POLICY "Admins can manage news" ON public.news FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.level = ANY (ARRAY['CEO', 'VP', 'Head'])));

-- company_sites
CREATE POLICY "Company sites are viewable by everyone" ON public.company_sites FOR SELECT USING (true);
CREATE POLICY "Admins can manage company sites" ON public.company_sites FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.level = ANY (ARRAY['CEO', 'VP', 'Head'])));

-- customers
CREATE POLICY "Users can view their own or granted customers" ON public.customers FOR SELECT USING (user_can_access_customer(id));
CREATE POLICY "Authenticated users can insert customers" ON public.customers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own customers" ON public.customers FOR UPDATE USING (author_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid())) WITH CHECK (author_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Users can delete their own customers" ON public.customers FOR DELETE USING (author_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- customer_access
CREATE POLICY "Users can view their customer access" ON public.customer_access FOR SELECT USING (granted_by IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()) OR user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Customer owners can manage access" ON public.customer_access FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM customers c JOIN profiles p ON p.id = c.author_id WHERE c.id = customer_access.customer_id AND p.user_id = auth.uid()));
CREATE POLICY "Customer owners can revoke access" ON public.customer_access FOR DELETE USING (EXISTS (SELECT 1 FROM customers c JOIN profiles p ON p.id = c.author_id WHERE c.id = customer_access.customer_id AND p.user_id = auth.uid()));

-- customer_documents
CREATE POLICY "Customer documents are viewable by everyone" ON public.customer_documents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert customer documents" ON public.customer_documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update customer documents" ON public.customer_documents FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete customer documents" ON public.customer_documents FOR DELETE USING (auth.uid() IS NOT NULL);

-- opportunities
CREATE POLICY "Opportunities are viewable by everyone" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert opportunities" ON public.opportunities FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update opportunities" ON public.opportunities FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete opportunities" ON public.opportunities FOR DELETE USING (auth.uid() IS NOT NULL);

-- opportunity_action_steps
CREATE POLICY "Authenticated users can view action steps" ON public.opportunity_action_steps FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert opportunity_action_steps" ON public.opportunity_action_steps FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update opportunity_action_steps" ON public.opportunity_action_steps FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete opportunity_action_steps" ON public.opportunity_action_steps FOR DELETE USING (auth.uid() IS NOT NULL);

-- opportunity_interactions
CREATE POLICY "Opportunity interactions are viewable by everyone" ON public.opportunity_interactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert opportunity_interactions" ON public.opportunity_interactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update opportunity_interactions" ON public.opportunity_interactions FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete opportunity_interactions" ON public.opportunity_interactions FOR DELETE USING (auth.uid() IS NOT NULL);

-- opportunity_stakeholders
CREATE POLICY "Stakeholders are viewable by everyone" ON public.opportunity_stakeholders FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert stakeholders" ON public.opportunity_stakeholders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update stakeholders" ON public.opportunity_stakeholders FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete stakeholders" ON public.opportunity_stakeholders FOR DELETE USING (auth.uid() IS NOT NULL);

-- partnerships
CREATE POLICY "Partnerships are viewable by authenticated users" ON public.partnerships FOR SELECT USING (true);
CREATE POLICY "Users can create partnerships" ON public.partnerships FOR INSERT WITH CHECK (auth.uid() IN (SELECT profiles.user_id FROM profiles WHERE profiles.id = partnerships.author_id));
CREATE POLICY "Users can update their own partnerships" ON public.partnerships FOR UPDATE USING (auth.uid() IN (SELECT profiles.user_id FROM profiles WHERE profiles.id = partnerships.author_id));
CREATE POLICY "Users can delete their own partnerships" ON public.partnerships FOR DELETE USING (auth.uid() IN (SELECT profiles.user_id FROM profiles WHERE profiles.id = partnerships.author_id));

-- projects
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert projects" ON public.projects FOR INSERT WITH CHECK (author_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (author_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.level = ANY (ARRAY['CEO', 'VP', 'Head', 'Senior', 'Lead'])));

-- project_members
CREATE POLICY "Project members are viewable by everyone" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage project members" ON public.project_members FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.level = ANY (ARRAY['CEO', 'VP', 'Head', 'Senior', 'Lead'])));

-- project_documents
CREATE POLICY "Anyone can view project documents" ON public.project_documents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert project documents" ON public.project_documents FOR INSERT WITH CHECK (uploaded_by IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Users can delete their own project documents" ON public.project_documents FOR DELETE USING (uploaded_by IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- project_insights
CREATE POLICY "Authenticated users can view project insights" ON public.project_insights FOR SELECT USING (true);
CREATE POLICY "Users can create their own project insights" ON public.project_insights FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = project_insights.author_id AND p.user_id = auth.uid()));
CREATE POLICY "Users can update their own project insights" ON public.project_insights FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = project_insights.author_id AND p.user_id = auth.uid()));
CREATE POLICY "Users can delete their own project insights" ON public.project_insights FOR DELETE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = project_insights.author_id AND p.user_id = auth.uid()));

-- project_insight_documents
CREATE POLICY "Authenticated users can view insight documents" ON public.project_insight_documents FOR SELECT USING (true);
CREATE POLICY "Insight authors can add documents" ON public.project_insight_documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM project_insights pi JOIN profiles p ON p.id = pi.author_id WHERE pi.id = project_insight_documents.insight_id AND p.user_id = auth.uid()));
CREATE POLICY "Insight authors can delete documents" ON public.project_insight_documents FOR DELETE USING (EXISTS (SELECT 1 FROM project_insights pi JOIN profiles p ON p.id = pi.author_id WHERE pi.id = project_insight_documents.insight_id AND p.user_id = auth.uid()));

-- solutions
CREATE POLICY "Solutions are viewable by everyone" ON public.solutions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create solutions" ON public.solutions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their solutions" ON public.solutions FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = solutions.author_id AND profiles.user_id = auth.uid()));
CREATE POLICY "Authors can delete their solutions" ON public.solutions FOR DELETE USING (author_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "No direct user inserts for notifications" ON public.notifications FOR INSERT WITH CHECK (false);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- notification_preferences
CREATE POLICY "Users can view their own preferences" ON public.notification_preferences FOR SELECT USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Users can insert their own preferences" ON public.notification_preferences FOR INSERT WITH CHECK (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Users can update their own preferences" ON public.notification_preferences FOR UPDATE USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- training_modules
CREATE POLICY "Training modules are viewable by everyone" ON public.training_modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage training modules" ON public.training_modules FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.level = ANY (ARRAY['CEO', 'VP', 'Head'])));

-- training_progress
CREATE POLICY "Users can view their own progress" ON public.training_progress FOR SELECT USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Users can manage their own progress" ON public.training_progress FOR ALL USING (user_id IN (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));

-- training_resource_links
CREATE POLICY "Training resource links are viewable by authenticated users" ON public.training_resource_links FOR SELECT USING (true);
CREATE POLICY "Users can insert their own training resource links" ON public.training_resource_links FOR INSERT WITH CHECK (created_by = current_profile_id() OR created_by IS NULL);
CREATE POLICY "Users can update their own training resource links" ON public.training_resource_links FOR UPDATE USING (created_by = (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()));
CREATE POLICY "Users can delete their own training resource links or legacy li" ON public.training_resource_links FOR DELETE USING (created_by = (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()) OR created_by IS NULL);

-- hr_topic_documents
CREATE POLICY "Anyone can view HR topic documents" ON public.hr_topic_documents FOR SELECT USING (true);
CREATE POLICY "Users can insert HR/training documents" ON public.hr_topic_documents FOR INSERT WITH CHECK (uploaded_by = current_profile_id());
CREATE POLICY "Users can update their own HR/training documents" ON public.hr_topic_documents FOR UPDATE USING (uploaded_by = current_profile_id() OR (auth.uid() IS NOT NULL AND uploaded_by IS NULL AND topic_slug ~~ 'training-%')) WITH CHECK (uploaded_by = current_profile_id() OR (auth.uid() IS NOT NULL AND uploaded_by IS NULL AND topic_slug ~~ 'training-%'));
CREATE POLICY "Users can delete their own HR/training documents" ON public.hr_topic_documents FOR DELETE USING (uploaded_by = current_profile_id() OR (auth.uid() IS NOT NULL AND uploaded_by IS NULL AND topic_slug ~~ 'training-%'));

-- execution_documents
CREATE POLICY "Authenticated users can view execution documents" ON public.execution_documents FOR SELECT USING (true);
CREATE POLICY "Users can insert their own execution documents" ON public.execution_documents FOR INSERT WITH CHECK (uploaded_by = current_profile_id() OR uploaded_by IS NULL);
CREATE POLICY "Users can delete their own execution documents" ON public.execution_documents FOR DELETE USING (uploaded_by = current_profile_id());

-- ===================
-- 7. STORAGE BUCKETS
-- ===================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('insight-documents', 'insight-documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('customer-documents', 'customer-documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('hr-documents', 'hr-documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('solution-files', 'solution-files', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('execution-documents', 'execution-documents', true) ON CONFLICT (id) DO NOTHING;

-- Public bucket storage policies
CREATE POLICY "Public read access for avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public read for insight-documents" ON storage.objects FOR SELECT USING (bucket_id = 'insight-documents');
CREATE POLICY "Auth upload for insight-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'insight-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete for insight-documents" ON storage.objects FOR DELETE USING (bucket_id = 'insight-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public read for customer-documents" ON storage.objects FOR SELECT USING (bucket_id = 'customer-documents');
CREATE POLICY "Auth upload for customer-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'customer-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete for customer-documents" ON storage.objects FOR DELETE USING (bucket_id = 'customer-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public read for hr-documents" ON storage.objects FOR SELECT USING (bucket_id = 'hr-documents');
CREATE POLICY "Auth upload for hr-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete for hr-documents" ON storage.objects FOR DELETE USING (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Auth read for project-documents" ON storage.objects FOR SELECT USING (bucket_id = 'project-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth upload for project-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete for project-documents" ON storage.objects FOR DELETE USING (bucket_id = 'project-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public read for solution-files" ON storage.objects FOR SELECT USING (bucket_id = 'solution-files');
CREATE POLICY "Auth upload for solution-files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'solution-files' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete for solution-files" ON storage.objects FOR DELETE USING (bucket_id = 'solution-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public read for execution-documents" ON storage.objects FOR SELECT USING (bucket_id = 'execution-documents');
CREATE POLICY "Auth upload for execution-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'execution-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete for execution-documents" ON storage.objects FOR DELETE USING (bucket_id = 'execution-documents' AND auth.uid() IS NOT NULL);
