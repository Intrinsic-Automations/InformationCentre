# Complete Docker Deployment Guide for Beginners

This step-by-step guide will help you deploy the EQommunity Hub application on a Rocky Linux VM using Docker. All steps are performed directly on the VM.

> **🔑 Key:** All commands in this guide are run **on the VM** unless explicitly stated otherwise (e.g. opening a browser).

---

## Table of Contents

1. [What You're Building](#what-youre-building)
2. [Prerequisites](#prerequisites)
3. [Step 1: Prepare Your VM](#step-1-prepare-your-vm)
4. [Step 2: Install Docker](#step-2-install-docker)
5. [Step 3: Get the Code](#step-3-get-the-code)
6. [Step 4: Export Your Cloud Database](#step-4-export-your-cloud-database)
7. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
8. [Step 6: Build and Start the Application](#step-6-build-and-start-the-application)
9. [Step 7: Import Your Data](#step-7-import-your-data)
10. [Step 8: Create an Admin User](#step-8-create-an-admin-user)
11. [Step 9: Verify Everything Works](#step-9-verify-everything-works)
12. [Daily Operations](#daily-operations)
13. [Updating After Code Changes](#updating-after-code-changes)
14. [Troubleshooting](#troubleshooting)

---

## What You're Building

You will deploy a complete self-contained application stack on your VM:

| Component | Purpose |
|-----------|---------|
| **Frontend** | The web application users interact with |
| **PostgreSQL** | Database storing all your data |
| **Supabase Auth** | Handles user login/signup |
| **Supabase REST API** | Connects the frontend to the database |
| **Supabase Storage** | Stores uploaded files |
| **Kong Gateway** | Routes requests to the right services |
| **Supabase Studio** | Database management interface |

```
┌─────────────────────────────────────────────────────────────┐
│                     Your VM                                  │
├─────────────────────────────────────────────────────────────┤
│  Users → Frontend (Port 80)                                 │
│              ↓                                               │
│         Kong Gateway (Port 8000)                            │
│              ↓                                               │
│    ┌─────────┼─────────┐                                    │
│    ↓         ↓         ↓                                    │
│  Auth    REST API   Storage                                 │
│    └─────────┼─────────┘                                    │
│              ↓                                               │
│         PostgreSQL (Port 5432)                              │
│                                                              │
│  Admin → Supabase Studio (Port 3000)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before starting, ensure you have:

- [ ] A Rocky Linux VM (8.x or 9.x recommended) with at least:
  - 4 CPU cores
  - 8GB RAM
  - 50GB disk space
- [ ] Root or sudo access to the VM
- [ ] **Internet access on the VM** (for downloading packages, Docker images, and cloning code)
- [ ] Network access to the VM from your browser (know its IP address)
- [ ] Your project's GitHub repository URL
- [ ] Access to your Supabase cloud project (for data migration)

---

## Step 1: Prepare Your VM

### 1.1 Connect to Your VM

Open a terminal and SSH into your VM:

```bash
ssh username@your-vm-ip-address
```

Replace `username` with your VM username and `your-vm-ip-address` with the actual IP.

> ✅ **From this point on, ALL commands are run on the VM via this SSH session.**

### 1.2 Update the System

```bash
sudo dnf update -y
```

### 1.3 Install Required Tools

```bash
sudo dnf install -y curl git nano postgresql
```

**What these tools do:**
- `curl` - Downloads files from the internet
- `git` - Gets your code from GitHub
- `nano` - Simple text editor for editing files
- `postgresql` - Provides `pg_dump` for database export (used in Step 4)

---

## Step 2: Install Docker

### 2.1 Install Docker Engine

Copy and paste these commands one at a time:

```bash
# Remove any old Docker versions
sudo dnf remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine podman runc 2>/dev/null || true

# Install required packages
sudo dnf install -y dnf-plugins-core

# Add Docker's official repository
sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo

# Install Docker
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker
```

### 2.2 Configure Docker Permissions

Allow your user to run Docker without `sudo`:

```bash
sudo usermod -aG docker $USER

# Apply the changes (log out and back in, or run):
newgrp docker
```

### 2.3 Verify Docker Installation

```bash
docker --version
docker compose version
docker run hello-world
```

**Expected output:** You should see version numbers and a "Hello from Docker!" message.

---

## Step 3: Get the Code

### 3.1 Clone Your Repository

```bash
cd ~

# Clone the repository (replace with your actual repo URL)
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

cd YOUR-REPO-NAME
```

### 3.2 Verify the Files Exist

```bash
ls -la docker/
ls -la Dockerfile.prod
ls -la docker-compose.prod.yml
```

You should see files like `docker-compose.prod.yml`, `Dockerfile.prod`, and a `docker/` folder.

---

## Step 4: Export Your Cloud Database

Since your VM has internet access, you can run everything directly on the VM.

### 4.1 Install Supabase CLI

**Option A: Download the binary (recommended for Rocky Linux)**

```bash
curl --http1.1 -sSL -o supabase.tar.gz https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz
tar -xzf supabase.tar.gz
sudo mv supabase /usr/local/bin/
```

**Option B: Using npm**

```bash
# Install Node.js 20+ first
curl --http1.1 -fsSL https://rpm.nodesource.com/setup_20.x -o setup_node.sh
sudo bash setup_node.sh
sudo dnf install -y nodejs

# Install Supabase CLI via npx (global install is not supported)
npx supabase --version
```

Verify the installation:

```bash
supabase --version
```

### 4.2 Login to Supabase

```bash
supabase login
```

> ⚠️ This will print a URL in the terminal. **Copy that URL and paste it into a browser** (on any machine with a browser) to log in and authorise the CLI. Then return to the VM terminal.

### 4.3 Link to Your Project

```bash
cd ~/YOUR-REPO-NAME

supabase link --project-ref janwnxaotmkqqdjmsbjf
```

Enter your database password when prompted.

### 4.4 Pull the Latest Schema

```bash
supabase db pull
```

This creates SQL files in `supabase/migrations/` with your database structure.

### 4.5 Export Your Data (Optional but Recommended)

```bash
# Get your database connection string from Supabase Dashboard:
#   Go to: Settings → Database → Connection string → URI
# Then run (replace YOUR_CONNECTION_STRING):

pg_dump "YOUR_CONNECTION_STRING" \
  --data-only \
  --no-owner \
  --no-privileges \
  -f data_backup.sql
```

> 💡 The `pg_dump` command connects to your **cloud** database over the internet and saves the data locally on the VM. This is why you installed the `postgresql` package in Step 1.

---

## Step 5: Configure Environment Variables

### 5.1 Generate Secure Secrets

**IMPORTANT:** Never use the default demo values in production!

```bash
# Generate a secure database password (copy the output)
openssl rand -base64 32

# Generate a JWT secret (copy this, you'll need it multiple times)
openssl rand -base64 48
```

### 5.2 Edit the Production Environment File

```bash
nano docker/.env.production
```

Update these values:

```bash
# ===========================================
# PostgreSQL Configuration
# ===========================================
POSTGRES_PASSWORD=paste_your_generated_password_here

# ===========================================
# JWT Configuration
# ===========================================
JWT_SECRET=paste_your_generated_jwt_secret_here
JWT_EXPIRY=3600

# ===========================================
# URL Configuration
# ===========================================
# Replace YOUR_VM_IP with your actual VM IP address
API_EXTERNAL_URL=http://YOUR_VM_IP:8000
SITE_URL=http://YOUR_VM_IP

# ===========================================
# Frontend Configuration
# ===========================================
VITE_SUPABASE_URL=http://YOUR_VM_IP:8000
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here

# ===========================================
# Optional Settings
# ===========================================
DISABLE_SIGNUP=false
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=true
```

### 5.3 Generate API Keys

> 📍 **Open in a browser** (on any machine): https://supabase.com/docs/guides/self-hosting#api-keys

1. Enter your JWT secret (the one you generated in step 5.1)
2. **CRITICAL:** The JWT issuer (`iss` claim) **must** be exactly `supabase` (not `supabase-demo` or anything else)
3. Copy the generated `anon` key and `service_role` key
4. Back in the `docker/.env.production` file on the VM, update:

```bash
ANON_KEY=your_generated_anon_key
SERVICE_ROLE_KEY=your_generated_service_role_key
VITE_SUPABASE_PUBLISHABLE_KEY=your_generated_anon_key
```

> ⚠️ **`ANON_KEY` and `VITE_SUPABASE_PUBLISHABLE_KEY` must be the same value.**

### 5.4 Update the Kong Gateway Configuration

The Kong gateway also needs your API keys. Edit `docker/kong.yml`:

```bash
nano docker/kong.yml
```

Find the `consumers` section and update the `anon` and `service_role` key values to match the keys you generated in Step 5.3.

### 5.5 Patch the Root .env File

> ⚠️ **CRITICAL:** The project's root `.env` file is automatically managed by Lovable's cloud connection. During the Docker build, Vite reads this file **first** and ignores Docker's `--env-file`. You **must** patch it with your local values.

```bash
# Replace YOUR_VM_IP and YOUR_ANON_KEY with your actual values
sed -i 's|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL="http://YOUR_VM_IP:8000"|' .env
sed -i 's|VITE_SUPABASE_PUBLISHABLE_KEY=.*|VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_KEY"|' .env
sed -i 's|VITE_SUPABASE_PROJECT_ID=.*|VITE_SUPABASE_PROJECT_ID="local"|' .env
```

**Verify the patch worked:**

```bash
cat .env
```

You should see your VM IP and local anon key, **not** the cloud values.

### 5.6 Save and Close

In nano:
- Press `Ctrl + O` to save
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

---

## Step 6: Build and Start the Application

### 6.1 Build and Start

> ⚠️ **CRITICAL:** Every `docker compose` command **must** include `--env-file docker/.env.production`. Without it, environment variables like `${JWT_SECRET}` inside `docker-compose.prod.yml` will not resolve correctly, causing authentication failures.

This may take 5-10 minutes the first time:

```bash
cd ~/YOUR-REPO-NAME

docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d --build
```

**What this command does:**
- `-f docker-compose.prod.yml` - Uses the production configuration
- `--env-file docker/.env.production` - Loads the correct environment variables
- `up` - Creates and starts the containers
- `-d` - Runs in the background (detached mode)
- `--build` - Rebuilds the images

### 6.2 Watch the Progress

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs -f
```

Press `Ctrl + C` to stop watching logs (containers keep running).

### 6.3 Check All Services Are Running

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production ps
```

You should see all services with status "Up":

```
NAME                    STATUS
frontend                Up
supabase-db             Up (healthy)
supabase-auth           Up
supabase-rest           Up
supabase-storage        Up
supabase-kong           Up
supabase-studio         Up
supabase-meta           Up
```

### 6.4 Verify the Frontend Has Correct URLs Baked In

```bash
docker exec $(docker ps -qf "name=frontend") grep -rl "YOUR_VM_IP" /usr/share/nginx/html/ | head -5
```

Replace `YOUR_VM_IP` with your actual IP. If this returns files, the build is correct. If it returns nothing, the root `.env` was not patched properly — go back to Step 5.5.

---

## Step 7: Import Your Data

If you exported data in Step 4.5:

### 7.1 Import Into Database

The `data_backup.sql` file is already on the VM (from Step 4.5), so just run:

```bash
cd ~/YOUR-REPO-NAME

docker compose -f docker-compose.prod.yml --env-file docker/.env.production exec -T supabase-db \
  psql -U postgres postgres < data_backup.sql
```

---

## Step 8: Create an Admin User

After the first user signs up, you need to grant them admin access. Without this, the User Management page will not be visible.

### 8.1 Sign Up Your First User

1. Open `http://YOUR_VM_IP` in your browser
2. Click "Sign Up" and create an account
3. You should be logged in automatically (email auto-confirm is enabled)

### 8.2 Find the User's Profile ID

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
SELECT id, user_id, full_name, email FROM public.profiles ORDER BY created_at DESC LIMIT 5;
"
```

Copy the `id` value (UUID) for your user.

### 8.3 Grant Admin Role

```bash
# Replace PROFILE_ID_HERE with the id from the previous step
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
INSERT INTO public.user_roles (user_id, role)
VALUES ('PROFILE_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
"
```

### 8.4 Verify the Role

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
SELECT ur.role, p.full_name, p.email
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE ur.role = 'admin';
"
```

You should see your user listed as an admin.

### 8.5 Refresh the Application

Log out and log back in (or refresh the page). You should now see the **User Management** option in the sidebar.

---

## Step 9: Verify Everything Works

### 9.1 Test the API (on the VM)

```bash
curl http://localhost:8000/rest/v1/
```

You should see a JSON response (might be empty `[]` if no public tables).

### 9.2 Test the Frontend

> 📍 **Open in a browser** (on any machine that can reach the VM):

```
http://YOUR_VM_IP
```

You should see the EQommunity Hub login page.

### 9.3 Test Supabase Studio

> 📍 **Open in a browser:**

```
http://YOUR_VM_IP:3000
```

You should see the Supabase Studio interface where you can manage your database.

### 9.4 Verify RLS Policies Are Complete

Run this diagnostic query to check all tables have the expected number of RLS policies:

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
SELECT
  cls.relname AS table_name,
  COUNT(*) AS policy_count,
  string_agg(pol.polname, ', ' ORDER BY pol.polname) AS policies
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
JOIN pg_namespace nsp ON cls.relnamespace = nsp.oid
WHERE nsp.nspname = 'public'
GROUP BY cls.relname
ORDER BY cls.relname;
"
```

**Key tables to check:**
- `user_roles` should have **3** policies (Users can view their own roles, Admins can view all roles, Admins can manage roles)
- `training_resource_links` should have **4** policies (SELECT, INSERT, UPDATE, DELETE)
- `profiles` should have **5** policies

If any table is missing policies, the `full-schema.sql` may not have been applied correctly. See [Troubleshooting: Missing RLS Policies](#problem-missing-rls-policies) below.

### 9.5 Quick Functional Test

After logging in as admin, verify:
1. ✅ You can see "User Management" in the sidebar
2. ✅ You can navigate to a training page and add a resource link
3. ✅ You can create an announcement
4. ✅ You can upload a document

---

## Daily Operations

> All commands below are run **on the VM**.
> ⚠️ **Always include `--env-file docker/.env.production`** with every `docker compose` command.

### Starting the Application

```bash
cd ~/YOUR-REPO-NAME
docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d
```

### Stopping the Application

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production down
```

### Viewing Logs

```bash
# All services
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs -f

# Specific service
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs -f frontend
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs -f supabase-db
```

### Restarting a Service

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production restart frontend
```

### Backing Up the Database

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production exec supabase-db \
  pg_dump -U postgres postgres > backup_$(date +%Y%m%d_%H%M%S).sql

ls -la backup_*.sql
```

### Restoring from Backup

```bash
# Stop the application first
docker compose -f docker-compose.prod.yml --env-file docker/.env.production down

# Start only the database
docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d supabase-db

# Wait for it to be ready
sleep 10

# Restore the backup
docker compose -f docker-compose.prod.yml --env-file docker/.env.production exec -T supabase-db \
  psql -U postgres postgres < backup_YYYYMMDD_HHMMSS.sql

# Start everything else
docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d
```

---

## Updating After Code Changes

> ⚠️ **This is the most error-prone step.** The root `.env` file gets overwritten by Lovable on every `git pull`. You **must** re-patch it before rebuilding.

### Full Update Workflow

```bash
cd ~/YOUR-REPO-NAME

# 1. Pull latest code
sudo git pull

# If you get merge conflicts:
# sudo git reset --hard origin/main
# sudo git pull

# 2. CRITICAL: Re-patch the root .env file (Lovable overwrites it)
sed -i 's|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL="http://YOUR_VM_IP:8000"|' .env
sed -i 's|VITE_SUPABASE_PUBLISHABLE_KEY=.*|VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_KEY"|' .env
sed -i 's|VITE_SUPABASE_PROJECT_ID=.*|VITE_SUPABASE_PROJECT_ID="local"|' .env

# 3. Verify the patch
cat .env

# 4. Rebuild and restart the frontend
docker compose -f docker-compose.prod.yml --env-file docker/.env.production build --no-cache frontend
docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d frontend

# 5. If environment variables changed (e.g., JWT secret, passwords), force-recreate ALL services:
# docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d --force-recreate
```

### Optional: Create a deploy.sh Script

To automate the update process, create a reusable script:

```bash
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

cd ~/YOUR-REPO-NAME

echo "Pulling latest code..."
sudo git pull || { echo "Pull failed, resetting..."; sudo git reset --hard origin/main; sudo git pull; }

echo "Patching root .env for local deployment..."
sed -i 's|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL="http://YOUR_VM_IP:8000"|' .env
sed -i 's|VITE_SUPABASE_PUBLISHABLE_KEY=.*|VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_KEY"|' .env
sed -i 's|VITE_SUPABASE_PROJECT_ID=.*|VITE_SUPABASE_PROJECT_ID="local"|' .env

echo "Rebuilding frontend..."
docker compose -f docker-compose.prod.yml --env-file docker/.env.production build --no-cache frontend

echo "Restarting frontend..."
docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d frontend

echo "Done! Verify at http://YOUR_VM_IP"
EOF

chmod +x deploy.sh
```

Then just run `./deploy.sh` whenever you need to update.

---

## Troubleshooting

> All commands below are run **on the VM**.

### Problem: "Permission denied" when running Docker

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Problem: Container won't start

**Check the logs:**
```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs supabase-db
```

**Common causes:**
- Port already in use: Check with `sudo lsof -i :5432`
- Out of disk space: Check with `df -h`
- Out of memory: Check with `free -h`

### Problem: Can't connect to the application from your browser

**Check if containers are running:**
```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production ps
```

**Check your VM's firewall (firewalld on Rocky Linux):**
```bash
sudo systemctl status firewalld

# Allow required ports
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload

sudo firewall-cmd --list-ports
```

### Problem: "No API key found in request" or 401 Errors

This means the Kong gateway is rejecting requests. Check:

1. **JWT issuer must be `supabase`** (not `supabase-demo`):
   - Regenerate keys at https://supabase.com/docs/guides/self-hosting#api-keys
   - Ensure the `iss` field is exactly `supabase`

2. **Keys must match across all config files:**
   - `docker/.env.production`: `ANON_KEY` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `docker/kong.yml`: the `anon` consumer key
   - Root `.env`: `VITE_SUPABASE_PUBLISHABLE_KEY`

3. **After changing keys, force-recreate all services:**
   ```bash
   docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d --force-recreate
   ```

### Problem: "Profile not found" after login

This usually means `auth.uid()` is returning NULL. Check:

1. **JWT secret consistency** — must be identical in `docker/.env.production` (`JWT_SECRET`) and `docker/kong.yml`
2. **`PGRST_DB_USE_LEGACY_GUCS`** must be `"true"` in `docker-compose.prod.yml`
3. **Auth schema permissions** — the `authenticated` role needs access:
   ```bash
   docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
   GRANT USAGE ON SCHEMA auth TO authenticated;
   GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;
   GRANT EXECUTE ON FUNCTION auth.jwt() TO authenticated;
   "
   ```

### Problem: Database connection errors

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production exec supabase-db pg_isready
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs supabase-db
```

If you see `password authentication failed`, the `POSTGRES_PASSWORD` in `docker/.env.production` doesn't match the actual database password. If the database volume already exists, you must update the password manually:

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'your_new_password';"
```

### Problem: Frontend shows blank page

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs frontend

# Check if the correct URLs are baked into the JS:
docker exec $(docker ps -qf "name=frontend") grep -rl "YOUR_VM_IP" /usr/share/nginx/html/ | head -5
```

If the grep returns nothing, the root `.env` was not patched. Go back to Step 5.5 and rebuild.

### Problem: Authentication not working

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs supabase-auth
```

**Verify JWT secret matches between services:**
- Check your `docker/.env.production` has the same `JWT_SECRET` value
- Ensure `ANON_KEY` and `SERVICE_ROLE_KEY` were generated with this secret
- Ensure `docker/kong.yml` uses the same keys

### Problem: "Failed to add resource link" or RLS policy errors

This means the table is missing INSERT/UPDATE/DELETE RLS policies. Check:

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
SELECT polname, polcmd::text as command
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
WHERE cls.relname = 'training_resource_links';
"
```

If you only see a SELECT policy, the INSERT/UPDATE/DELETE policies are missing. Fix:

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
CREATE POLICY \"Users can insert their own training resource links\"
ON public.training_resource_links FOR INSERT TO authenticated
WITH CHECK ((created_by = current_profile_id()) OR (created_by IS NULL));

CREATE POLICY \"Users can update their own training resource links\"
ON public.training_resource_links FOR UPDATE TO authenticated
USING (created_by = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY \"Users can delete their own training resource links or legacy li\"
ON public.training_resource_links FOR DELETE TO authenticated
USING ((created_by = (SELECT id FROM profiles WHERE user_id = auth.uid())) OR (created_by IS NULL));
"
```

### Problem: Missing RLS Policies

If `full-schema.sql` didn't apply correctly, you can check and fix missing policies:

```bash
# Check what policies exist
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
SELECT cls.relname, COUNT(*) as policy_count
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
JOIN pg_namespace nsp ON cls.relnamespace = nsp.oid
WHERE nsp.nspname = 'public'
GROUP BY cls.relname ORDER BY cls.relname;
"
```

If policies are missing, the safest fix is a full volume reset (⚠️ **this deletes all data**):

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production down -v
docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d --build
```

Then re-import your data (Step 7) and re-create your admin user (Step 8).

### Problem: User Management page not visible (even as admin)

This is caused by RESTRICTIVE RLS policies on the `user_roles` table. Check:

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
SELECT polname, CASE polpermissive WHEN true THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END as type
FROM pg_policy pol JOIN pg_class cls ON pol.polrelid = cls.oid
WHERE cls.relname = 'user_roles';
"
```

If any policies show as RESTRICTIVE, fix them:

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
DROP POLICY IF EXISTS \"Users can view their own roles\" ON public.user_roles;
DROP POLICY IF EXISTS \"Admins can view all roles\" ON public.user_roles;
DROP POLICY IF EXISTS \"Admins can manage roles\" ON public.user_roles;

CREATE POLICY \"Users can view their own roles\" ON public.user_roles FOR SELECT TO authenticated USING (user_id = current_user_profile_id());
CREATE POLICY \"Admins can view all roles\" ON public.user_roles FOR SELECT TO authenticated USING (has_role(current_user_profile_id(), 'admin'::app_role));
CREATE POLICY \"Admins can manage roles\" ON public.user_roles FOR ALL TO authenticated USING (has_role(current_user_profile_id(), 'admin'::app_role)) WITH CHECK (has_role(current_user_profile_id(), 'admin'::app_role));
"
```

### Problem: PostgREST restart loop

If PostgREST keeps restarting, inspect its config:

```bash
docker inspect $(docker ps -qf "name=supabase-rest") | grep -A5 "PGRST"
```

Common cause: `POSTGRES_PASSWORD` mismatch. See [Database connection errors](#problem-database-connection-errors).

### Problem: Storage upload failures

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs supabase-storage
```

If you see `42501` (RLS) errors, the storage policies may need resetting. If you see `NoSuchBucket`, the buckets need re-inserting:

```bash
docker exec $(docker ps -qf "name=supabase-db") psql -U postgres -d postgres -c "
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('insight-documents', 'insight-documents', true),
  ('customer-documents', 'customer-documents', true),
  ('hr-documents', 'hr-documents', true),
  ('project-documents', 'project-documents', false),
  ('solution-files', 'solution-files', true),
  ('execution-documents', 'execution-documents', true)
ON CONFLICT (id) DO NOTHING;
"
```

### Complete Reset (Nuclear Option)

If nothing works, start fresh:

```bash
docker compose -f docker-compose.prod.yml --env-file docker/.env.production down -v
docker compose -f docker-compose.prod.yml --env-file docker/.env.production down --rmi all
docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d --build
```

⚠️ **Warning:** This deletes all data! Make sure you have backups.

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Start app | `docker compose -f docker-compose.prod.yml --env-file docker/.env.production up -d` |
| Stop app | `docker compose -f docker-compose.prod.yml --env-file docker/.env.production down` |
| View logs | `docker compose -f docker-compose.prod.yml --env-file docker/.env.production logs -f` |
| Check status | `docker compose -f docker-compose.prod.yml --env-file docker/.env.production ps` |
| Rebuild frontend | `docker compose -f docker-compose.prod.yml --env-file docker/.env.production build --no-cache frontend` |
| Backup DB | `docker compose -f docker-compose.prod.yml --env-file docker/.env.production exec supabase-db pg_dump -U postgres postgres > backup.sql` |
| Shell into DB | `docker compose -f docker-compose.prod.yml --env-file docker/.env.production exec supabase-db psql -U postgres` |

---

## Service URLs

> 📍 **Open in a browser** on any machine that can reach the VM.

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://YOUR_VM_IP | Main application |
| Supabase API | http://YOUR_VM_IP:8000 | REST API |
| Supabase Studio | http://YOUR_VM_IP:3000 | Database admin |
| PostgreSQL | YOUR_VM_IP:5432 | Direct DB access |

---

## Need More Help?

- **Docker Documentation:** https://docs.docker.com/
- **Supabase Self-Hosting:** https://supabase.com/docs/guides/self-hosting
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/

---

*Optimized for Rocky Linux 8.x/9.x - Last updated: February 2026*
