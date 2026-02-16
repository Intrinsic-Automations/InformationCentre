#!/bin/bash
set -e

# Ensure PostgreSQL listens on all network interfaces (required for Docker networking)
echo "Setting listen_addresses to '*'..."
echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -U postgres; do
  sleep 1
done

# ============================================
# Create auth schema and role for GoTrue
# ============================================
echo "Setting up auth schema and supabase_auth_admin role..."
psql -U postgres -d postgres <<'EOSQL'
-- Create auth schema if not exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Create supabase_auth_admin role if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE ROLE supabase_auth_admin LOGIN NOINHERIT CREATEROLE;
  END IF;
END
$$;

-- Set password for supabase_auth_admin (same as postgres for simplicity)
ALTER ROLE supabase_auth_admin WITH PASSWORD 'your-super-secret-password';

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO supabase_auth_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO supabase_auth_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO supabase_auth_admin;

-- Grant usage on public schema (needed for triggers like handle_new_user)
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

-- Create the auth trigger (GoTrue will create the auth.users table)
-- We'll create this trigger after GoTrue initializes via a retry mechanism
EOSQL

echo "Auth schema and roles created successfully!"

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
