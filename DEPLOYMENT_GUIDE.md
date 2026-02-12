# Complete Docker Deployment Guide for Beginners

This step-by-step guide will help you deploy the EQommunity Hub application on a Rocky Linux VM using Docker. No prior Docker experience required!

> **🔑 Key:** Throughout this guide, every command block is clearly marked with where it should be run:
> - 📍 **YOUR LOCAL MACHINE** — your laptop/desktop (Windows, Mac, or Linux)
> - 📍 **THE VM** — the Rocky Linux server where the app will be hosted
> - 📍 **YOUR BROWSER** — open a web browser on your local machine
> - 📍 **EITHER** — can be run on either machine

---

## Table of Contents

1. [What You're Building](#what-youre-building)
2. [Prerequisites](#prerequisites)
3. [Step 1: Prepare Your VM](#step-1-prepare-your-vm)
4. [Step 2: Install Docker on the VM](#step-2-install-docker-on-the-vm)
5. [Step 3: Get the Code on the VM](#step-3-get-the-code-on-the-vm)
6. [Step 4: Export Your Cloud Database (Local Machine)](#step-4-export-your-cloud-database-local-machine)
7. [Step 5: Configure Environment Variables (VM)](#step-5-configure-environment-variables-vm)
8. [Step 6: Build and Start the Application (VM)](#step-6-build-and-start-the-application-vm)
9. [Step 7: Import Your Data (Local → VM)](#step-7-import-your-data-local--vm)
10. [Step 8: Verify Everything Works](#step-8-verify-everything-works)
11. [Daily Operations (VM)](#daily-operations-vm)
12. [Troubleshooting (VM)](#troubleshooting-vm)

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
- [ ] Network access to the VM (know its IP address)
- [ ] Your project's GitHub repository URL
- [ ] Access to your Supabase cloud project (for data migration)
- [ ] A local computer with a terminal (for SSH access and data export)

---

## Step 1: Prepare Your VM

### 1.1 Connect to Your VM

> 📍 **Run on: YOUR LOCAL MACHINE**

Open a terminal on your computer and connect via SSH:

```bash
ssh username@your-vm-ip-address
```

Replace `username` with your VM username and `your-vm-ip-address` with the actual IP.

> ✅ **From this point on, you are now inside the VM.** All commands in Steps 1–3 are run on the VM via this SSH session.

### 1.2 Update the System

> 📍 **Run on: THE VM** (via SSH)

```bash
# Update package lists and upgrade installed packages
sudo dnf update -y
```

### 1.3 Install Required Tools

> 📍 **Run on: THE VM** (via SSH)

```bash
# Install essential tools
sudo dnf install -y curl git nano
```

**What these tools do:**
- `curl` - Downloads files from the internet
- `git` - Gets your code from GitHub
- `nano` - Simple text editor for editing files

---

## Step 2: Install Docker on the VM

> 📍 **All commands in this step: Run on THE VM** (via SSH)

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

> 📍 **Run on: THE VM** (via SSH)

Allow your user to run Docker without `sudo`:

```bash
# Add your user to the docker group
sudo usermod -aG docker $USER

# Apply the changes (log out and back in, or run):
newgrp docker
```

### 2.3 Verify Docker Installation

> 📍 **Run on: THE VM** (via SSH)

```bash
# Check Docker version
docker --version

# Check Docker Compose version  
docker compose version

# Test Docker works
docker run hello-world
```

**Expected output:** You should see version numbers and a "Hello from Docker!" message.

---

## Step 3: Get the Code on the VM

> 📍 **All commands in this step: Run on THE VM** (via SSH)

### 3.1 Clone Your Repository

```bash
# Go to your home directory
cd ~

# Clone the repository (replace with your actual repo URL)
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Enter the project folder
cd YOUR-REPO-NAME
```

### 3.2 Verify the Files Exist

```bash
# List the Docker files
ls -la docker/
ls -la Dockerfile.prod
ls -la docker-compose.prod.yml
```

You should see files like `docker-compose.prod.yml`, `Dockerfile.prod`, and a `docker/` folder.

---

## Step 4: Export Your Cloud Database (Local Machine)

> 📍 **All commands in this step: Run on YOUR LOCAL MACHINE** (open a NEW terminal window — do NOT run these on the VM)

This step migrates your data from Supabase Cloud to your VM. You do this from your local machine because it has browser access for Supabase login.

### 4.1 Install Supabase CLI

> 📍 **Run on: YOUR LOCAL MACHINE**

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Windows (PowerShell as Administrator):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Linux:**
```bash
curl -sSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | bash
```

### 4.2 Login to Supabase

> 📍 **Run on: YOUR LOCAL MACHINE**

```bash
supabase login
```

This opens a browser window. Log in with your Supabase account.

### 4.3 Link to Your Project

> 📍 **Run on: YOUR LOCAL MACHINE**

```bash
# Navigate to your project folder on your local machine
cd path/to/your/project

# Link to your Supabase project
supabase link --project-ref janwnxaotmkqqdjmsbjf
```

Enter your database password when prompted.

### 4.4 Pull the Latest Schema

> 📍 **Run on: YOUR LOCAL MACHINE**

```bash
# Pull the current schema into migrations folder
supabase db pull
```

This creates SQL files in `supabase/migrations/` with your database structure.

### 4.5 Export Your Data (Optional but Recommended)

> 📍 **Run on: YOUR LOCAL MACHINE**

To export your actual data:

```bash
# Get your database connection string from Supabase Dashboard
# Go to: Settings → Database → Connection string → URI

# Export data (replace YOUR_CONNECTION_STRING)
pg_dump "YOUR_CONNECTION_STRING" \
  --data-only \
  --no-owner \
  --no-privileges \
  -f data_backup.sql
```

### 4.6 Copy Files to Your VM

> 📍 **Run on: YOUR LOCAL MACHINE** (this sends files TO the VM)

**Option A — Direct copy via SCP:**
```bash
scp -r . username@your-vm-ip:~/YOUR-REPO-NAME/
```

**Option B — Push to GitHub and pull on the VM:**
```bash
# On your LOCAL MACHINE:
git add .
git commit -m "Add latest migrations"
git push
```

Then switch to your VM SSH session:

> 📍 **Run on: THE VM** (via SSH)
```bash
cd ~/YOUR-REPO-NAME
git pull
```

---

## Step 5: Configure Environment Variables (VM)

> 📍 **All commands in this step: Run on THE VM** (via SSH)

### 5.1 Create Your Environment File

```bash
# Copy the template
cp docker/.env.production .env

# Open it for editing
nano .env
```

### 5.2 Generate Secure Secrets

> 📍 **Run on: THE VM** (via SSH)

**IMPORTANT:** Never use the default demo values in production!

Generate secure values:

```bash
# Generate a secure database password
openssl rand -base64 32

# Generate a JWT secret (copy this, you'll need it twice)
openssl rand -base64 48
```

### 5.3 Edit the Environment File

> 📍 **Run on: THE VM** (editing the .env file you opened in step 5.1)

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

> 📍 **Run on: YOUR BROWSER** (on your local machine)

You need to generate matching API keys using your JWT secret.

1. Go to: https://supabase.com/docs/guides/self-hosting#api-keys
2. Enter your JWT secret (the one you generated on the VM in step 5.2)
3. Copy the generated `anon` key and `service_role` key

> 📍 **Then back on: THE VM** (update the .env file)

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

## Step 6: Build and Start the Application (VM)

> 📍 **All commands in this step: Run on THE VM** (via SSH)

### 6.1 Build the Docker Images

This step compiles your application. It may take 5-10 minutes the first time:

```bash
# Make sure you're in the project directory
cd ~/YOUR-REPO-NAME

# Build and start all services
docker compose -f docker-compose.prod.yml up -d --build
```

**What this command does:**
- `-f docker-compose.prod.yml` - Uses the production configuration
- `up` - Creates and starts the containers
- `-d` - Runs in the background (detached mode)
- `--build` - Rebuilds the images

### 6.2 Watch the Progress

> 📍 **Run on: THE VM** (via SSH)

```bash
# View live logs
docker compose -f docker-compose.prod.yml logs -f
```

Press `Ctrl + C` to stop watching logs (containers keep running).

### 6.3 Check All Services Are Running

> 📍 **Run on: THE VM** (via SSH)

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

## Step 7: Import Your Data (Local → VM)

If you exported data in Step 4.5:

### 7.1 Copy Data File to VM

> 📍 **Run on: YOUR LOCAL MACHINE** (this sends the file TO the VM)

```bash
scp data_backup.sql username@your-vm-ip:~/YOUR-REPO-NAME/
```

### 7.2 Import Into Database

> 📍 **Run on: THE VM** (via SSH)

```bash
cd ~/YOUR-REPO-NAME

# Import the data
docker compose -f docker-compose.prod.yml exec -T supabase-db \
  psql -U postgres postgres < data_backup.sql
```

---

## Step 8: Verify Everything Works

### 8.1 Test the Frontend

> 📍 **Run on: YOUR BROWSER** (on your local machine)

Open a web browser and go to:
```
http://YOUR_VM_IP
```

You should see the EQommunity Hub login page.

### 8.2 Test Supabase Studio

> 📍 **Run on: YOUR BROWSER** (on your local machine)

Open a web browser and go to:
```
http://YOUR_VM_IP:3000
```

You should see the Supabase Studio interface where you can manage your database.

### 8.3 Test the API

> 📍 **Run on: THE VM** (via SSH)

```bash
curl http://localhost:8000/rest/v1/
```

You should see a JSON response (might be empty `[]` if no public tables).

### 8.4 Create a Test User

> 📍 **Run on: YOUR BROWSER** (on your local machine)

1. Go to `http://YOUR_VM_IP`
2. Click "Sign Up"
3. Create an account
4. Check Supabase Studio → Authentication → Users to see the new user

---

## Daily Operations (VM)

> 📍 **All commands in this section: Run on THE VM** (via SSH)

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

After pulling new code from GitHub:

```bash
cd ~/YOUR-REPO-NAME
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Backing Up the Database

```bash
# Create a backup
docker compose -f docker-compose.prod.yml exec supabase-db \
  pg_dump -U postgres postgres > backup_$(date +%Y%m%d_%H%M%S).sql

# List your backups
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

## Troubleshooting (VM)

> 📍 **All commands in this section: Run on THE VM** (via SSH, unless stated otherwise)

### Problem: "Permission denied" when running Docker

**Solution:**
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

> 📍 **Run on: THE VM** (via SSH)

**Check if containers are running:**
```bash
docker compose -f docker-compose.prod.yml ps
```

**Check your VM's firewall (firewalld on Rocky Linux):**
```bash
# Check if firewalld is running
sudo systemctl status firewalld

# Allow required ports
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload

# Verify ports are open
sudo firewall-cmd --list-ports
```

### Problem: Database connection errors

```bash
# Check database health
docker compose -f docker-compose.prod.yml exec supabase-db pg_isready

# Check database logs
docker compose -f docker-compose.prod.yml logs supabase-db
```

### Problem: Frontend shows blank page

```bash
# Check frontend logs
docker compose -f docker-compose.prod.yml logs frontend

# Verify environment variables
docker compose -f docker-compose.prod.yml exec frontend env | grep VITE
```

### Problem: Authentication not working

```bash
# Check auth service logs
docker compose -f docker-compose.prod.yml logs supabase-auth
```

**Verify JWT secret matches between services:**
- Check your `.env` file has the same `JWT_SECRET` value
- Ensure `ANON_KEY` and `SERVICE_ROLE_KEY` were generated with this secret

### Complete Reset (Nuclear Option)

If nothing works, start fresh:

```bash
# Stop and remove everything including data
docker compose -f docker-compose.prod.yml down -v

# Remove all Docker images
docker compose -f docker-compose.prod.yml down --rmi all

# Start fresh
docker compose -f docker-compose.prod.yml up -d --build
```

⚠️ **Warning:** This deletes all data! Make sure you have backups.

---

## Quick Reference Card

> 📍 **All commands: Run on THE VM** (via SSH)

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

> 📍 **Open in: YOUR BROWSER** (on your local machine)

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
