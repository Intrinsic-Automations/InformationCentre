#!/bin/bash
set -e

# listen_addresses is already handled by the entrypoint sed hack in docker-compose

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -U postgres; do
  sleep 1
done

# ============================================
# Create auth schema and role for GoTrue
# ============================================
echo "Setting up auth and storage schemas and roles..."
psql -U postgres -d postgres <<'EOSQL'
-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS extensions;

-- Create extensions in extensions schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- Create supabase_auth_admin role if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE ROLE supabase_auth_admin LOGIN NOINHERIT CREATEROLE;
  END IF;
END
$$;

EOSQL

# Set password using env var (outside heredoc so bash can interpolate)
psql -U postgres -d postgres -c "ALTER ROLE supabase_auth_admin WITH PASSWORD '${POSTGRES_PASSWORD:-your-super-secret-password}';"
psql -U postgres -d postgres <<'EOSQL2'
-- Set search_path for supabase_auth_admin
ALTER ROLE supabase_auth_admin SET search_path TO auth;

-- Grant auth schema permissions
GRANT ALL PRIVILEGES ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO supabase_auth_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO supabase_auth_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO supabase_auth_admin;

-- Grant public schema permissions to supabase_auth_admin
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO supabase_auth_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO supabase_auth_admin;

-- Create anon and authenticated roles for PostgREST/RLS
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Grant storage schema permissions
GRANT ALL PRIVILEGES ON SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA storage TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- Create the trigger for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $func$
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
$func$;

EOSQL2

echo "Auth schema and roles created successfully!"

# ============================================
# Background: wait for GoTrue to create auth.users, then attach trigger
# ============================================
echo "Starting background process to create auth trigger once auth.users exists..."
(
  # Wait up to 5 minutes for auth.users table
  for i in $(seq 1 60); do
    sleep 5
    TABLE_EXISTS=$(psql -U postgres -d postgres -tAc "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users');")
    if [ "$TABLE_EXISTS" = "t" ]; then
      echo "auth.users table found! Creating trigger..."
      psql -U postgres -d postgres <<'TRIGGER_SQL'
-- Create the trigger on auth.users -> public.handle_new_user()
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also create the role assignment trigger on profiles
DROP TRIGGER IF EXISTS on_profile_created_assign_role ON public.profiles;
CREATE TRIGGER on_profile_created_assign_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_user_role();
TRIGGER_SQL
      echo "Auth triggers created successfully!"
      exit 0
    fi
    echo "Waiting for auth.users table... attempt $i/60"
  done
  echo "WARNING: auth.users table not found after 5 minutes. Auth trigger NOT created."
) &

# ============================================
# Background: wait for storage service to create tables, then add buckets/policies
# ============================================
echo "Starting background process to create storage buckets once storage.objects exists..."
(
  for i in $(seq 1 120); do
    sleep 5
    TABLE_EXISTS=$(psql -U postgres -d postgres -tAc "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects' AND (SELECT count(*) FROM information_schema.columns WHERE table_schema = 'storage' AND table_name = 'objects') > 3);")
    if [ "$TABLE_EXISTS" = "t" ]; then
      echo "storage.objects table found! Creating buckets and policies..."
      psql -U postgres -d postgres <<'STORAGE_SQL'
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('insight-documents', 'insight-documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('customer-documents', 'customer-documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('hr-documents', 'hr-documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('solution-files', 'solution-files', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('execution-documents', 'execution-documents', true) ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
CREATE POLICY "Public read access for avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Public read for insight-documents" ON storage.objects FOR SELECT USING (bucket_id = 'insight-documents');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth upload for insight-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'insight-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth delete for insight-documents" ON storage.objects FOR DELETE USING (bucket_id = 'insight-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Public read for customer-documents" ON storage.objects FOR SELECT USING (bucket_id = 'customer-documents');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth upload for customer-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'customer-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth delete for customer-documents" ON storage.objects FOR DELETE USING (bucket_id = 'customer-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Public read for hr-documents" ON storage.objects FOR SELECT USING (bucket_id = 'hr-documents');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth upload for hr-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth delete for hr-documents" ON storage.objects FOR DELETE USING (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth read for project-documents" ON storage.objects FOR SELECT USING (bucket_id = 'project-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth upload for project-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth delete for project-documents" ON storage.objects FOR DELETE USING (bucket_id = 'project-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Public read for solution-files" ON storage.objects FOR SELECT USING (bucket_id = 'solution-files');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth upload for solution-files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'solution-files' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth delete for solution-files" ON storage.objects FOR DELETE USING (bucket_id = 'solution-files' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Public read for execution-documents" ON storage.objects FOR SELECT USING (bucket_id = 'execution-documents');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth upload for execution-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'execution-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Auth delete for execution-documents" ON storage.objects FOR DELETE USING (bucket_id = 'execution-documents' AND auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
STORAGE_SQL
      echo "Storage buckets and policies created successfully!"
      exit 0
    fi
    echo "Waiting for storage.objects table... attempt $i/120"
  done
  echo "WARNING: storage.objects table not found after 10 minutes. Storage policies NOT created."
) &

# ============================================
# Apply application schema
# ============================================
echo "Applying full schema from docker/full-schema.sql..."
if [ -f "/docker-entrypoint-initdb.d/full-schema.sql" ]; then
  psql -U postgres -d postgres -f "/docker-entrypoint-initdb.d/full-schema.sql"
  echo "Full schema applied successfully!"
else
  echo "WARNING: full-schema.sql not found, falling back to migration files..."
  for migration in /docker-entrypoint-initdb.d/migrations/*.sql; do
    if [ -f "$migration" ]; then
      echo "Applying migration: $(basename $migration)"
      psql -U postgres -d postgres -f "$migration"
    fi
  done
  echo "All migrations applied successfully!"
fi
