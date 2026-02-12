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
10. [Step 8: Verify Everything Works](#step-8-verify-everything-works)
11. [Daily Operations](#daily-operations)
12. [Troubleshooting](#troubleshooting)

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

**Option A: Using npm (recommended)**

```bash
# Install Node.js 18+ (Rocky Linux default repos have an outdated version)
sudo dnf module reset nodejs -y
sudo dnf module enable nodejs:18 -y
sudo dnf install -y nodejs npm

# If the above doesn't work, use NodeSource instead:
# curl --http1.1 -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
# sudo dnf install -y nodejs

# Install Supabase CLI globally
npm install -g supabase
```

**Option B: Download the binary directly**

```bash
# Download the latest release binary
curl --http1.1 -sSL -o supabase.deb https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.deb

# If .deb doesn't work on Rocky Linux, use the tarball instead:
curl --http1.1 -sSL -o supabase.tar.gz https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz
tar -xzf supabase.tar.gz
sudo mv supabase /usr/local/bin/
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

### 5.1 Create Your Environment File

```bash
cp docker/.env.production .env

nano .env
```

### 5.2 Generate Secure Secrets

**IMPORTANT:** Never use the default demo values in production!

```bash
# Generate a secure database password (copy the output)
openssl rand -base64 32

# Generate a JWT secret (copy this, you'll need it multiple times)
openssl rand -base64 48
```

### 5.3 Edit the Environment File

Update these values in your `.env` file:

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
```

### 5.4 Generate API Keys

> 📍 **Open in a browser** (on any machine): https://supabase.com/docs/guides/self-hosting#api-keys

1. Enter your JWT secret (the one you generated in step 5.2)
2. Copy the generated `anon` key and `service_role` key
3. Back in the `.env` file on the VM, update:

```bash
ANON_KEY=your_generated_anon_key
SERVICE_ROLE_KEY=your_generated_service_role_key
VITE_SUPABASE_PUBLISHABLE_KEY=your_generated_anon_key
```

### 5.5 Save and Close

In nano:
- Press `Ctrl + O` to save
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

---

## Step 6: Build and Start the Application

### 6.1 Build the Docker Images

This may take 5-10 minutes the first time:

```bash
cd ~/YOUR-REPO-NAME

docker compose -f docker-compose.prod.yml up -d --build
```

**What this command does:**
- `-f docker-compose.prod.yml` - Uses the production configuration
- `up` - Creates and starts the containers
- `-d` - Runs in the background (detached mode)
- `--build` - Rebuilds the images

### 6.2 Watch the Progress

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Press `Ctrl + C` to stop watching logs (containers keep running).

### 6.3 Check All Services Are Running

```bash
docker compose -f docker-compose.prod.yml ps
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

---

## Step 7: Import Your Data

If you exported data in Step 4.5:

### 7.1 Import Into Database

The `data_backup.sql` file is already on the VM (from Step 4.5), so just run:

```bash
cd ~/YOUR-REPO-NAME

docker compose -f docker-compose.prod.yml exec -T supabase-db \
  psql -U postgres postgres < data_backup.sql
```

---

## Step 8: Verify Everything Works

### 8.1 Test the API (on the VM)

```bash
curl http://localhost:8000/rest/v1/
```

You should see a JSON response (might be empty `[]` if no public tables).

### 8.2 Test the Frontend

> 📍 **Open in a browser** (on any machine that can reach the VM):

```
http://YOUR_VM_IP
```

You should see the EQommunity Hub login page.

### 8.3 Test Supabase Studio

> 📍 **Open in a browser:**

```
http://YOUR_VM_IP:3000
```

You should see the Supabase Studio interface where you can manage your database.

### 8.4 Create a Test User

1. Go to `http://YOUR_VM_IP` in your browser
2. Click "Sign Up"
3. Create an account
4. Check Supabase Studio → Authentication → Users to see the new user

---

## Daily Operations

> All commands below are run **on the VM**.

### Starting the Application

```bash
cd ~/YOUR-REPO-NAME
docker compose -f docker-compose.prod.yml up -d
```

### Stopping the Application

```bash
docker compose -f docker-compose.prod.yml down
```

### Viewing Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f supabase-db
```

### Restarting a Service

```bash
docker compose -f docker-compose.prod.yml restart frontend
```

### Updating the Application

After new code is pushed to GitHub:

```bash
cd ~/YOUR-REPO-NAME
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Backing Up the Database

```bash
docker compose -f docker-compose.prod.yml exec supabase-db \
  pg_dump -U postgres postgres > backup_$(date +%Y%m%d_%H%M%S).sql

ls -la backup_*.sql
```

### Restoring from Backup

```bash
# Stop the application first
docker compose -f docker-compose.prod.yml down

# Start only the database
docker compose -f docker-compose.prod.yml up -d supabase-db

# Wait for it to be ready
sleep 10

# Restore the backup
docker compose -f docker-compose.prod.yml exec -T supabase-db \
  psql -U postgres postgres < backup_YYYYMMDD_HHMMSS.sql

# Start everything else
docker compose -f docker-compose.prod.yml up -d
```

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
docker compose -f docker-compose.prod.yml logs supabase-db
```

**Common causes:**
- Port already in use: Check with `sudo lsof -i :5432`
- Out of disk space: Check with `df -h`
- Out of memory: Check with `free -h`

### Problem: Can't connect to the application from your browser

**Check if containers are running:**
```bash
docker compose -f docker-compose.prod.yml ps
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

### Problem: Database connection errors

```bash
docker compose -f docker-compose.prod.yml exec supabase-db pg_isready
docker compose -f docker-compose.prod.yml logs supabase-db
```

### Problem: Frontend shows blank page

```bash
docker compose -f docker-compose.prod.yml logs frontend
docker compose -f docker-compose.prod.yml exec frontend env | grep VITE
```

### Problem: Authentication not working

```bash
docker compose -f docker-compose.prod.yml logs supabase-auth
```

**Verify JWT secret matches between services:**
- Check your `.env` file has the same `JWT_SECRET` value
- Ensure `ANON_KEY` and `SERVICE_ROLE_KEY` were generated with this secret

### Complete Reset (Nuclear Option)

If nothing works, start fresh:

```bash
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml down --rmi all
docker compose -f docker-compose.prod.yml up -d --build
```

⚠️ **Warning:** This deletes all data! Make sure you have backups.

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Start app | `docker compose -f docker-compose.prod.yml up -d` |
| Stop app | `docker compose -f docker-compose.prod.yml down` |
| View logs | `docker compose -f docker-compose.prod.yml logs -f` |
| Check status | `docker compose -f docker-compose.prod.yml ps` |
| Rebuild | `docker compose -f docker-compose.prod.yml up -d --build` |
| Backup DB | `docker compose -f docker-compose.prod.yml exec supabase-db pg_dump -U postgres postgres > backup.sql` |
| Shell into DB | `docker compose -f docker-compose.prod.yml exec supabase-db psql -U postgres` |

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
