# Local Docker Setup Guide

This guide explains how to run both the EQommunity Hub application and Supabase locally using Docker on Linux.

## Prerequisites

### Install Docker and Docker Compose

```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose-plugin

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to the docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
# Or run: newgrp docker
```

### Verify Installation

```bash
docker --version
docker compose version
```

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp docker/.env.example .env

# Edit the .env file with your own secrets (IMPORTANT for production!)
nano .env
```

**Important:** For production use, generate new secrets:
- `POSTGRES_PASSWORD`: Use a strong password
- `JWT_SECRET`: Must be at least 32 characters
- `ANON_KEY` and `SERVICE_ROLE_KEY`: Generate at https://supabase.com/docs/guides/self-hosting#api-keys

### 3. Start All Services

```bash
# Start all containers in detached mode
docker compose up -d

# View logs (optional)
docker compose logs -f
```

### 4. Apply Database Migrations

1. Open Supabase Studio at http://localhost:3000
2. Navigate to the SQL Editor
3. Run each migration file from the `supabase/migrations/` folder in order

### 5. Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application |
| **Supabase API** | http://localhost:8000 | REST API endpoint |
| **Supabase Studio** | http://localhost:3000 | Database management UI |
| **PostgreSQL** | localhost:5432 | Direct database access |

## Service Management

### Start Services
```bash
docker compose up -d
```

### Stop Services
```bash
docker compose down
```

### Stop and Remove Volumes (Clean Reset)
```bash
docker compose down -v
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f supabase-db
```

### Rebuild Frontend After Code Changes
```bash
docker compose up -d --build frontend
```

## Troubleshooting

### Port Conflicts

If you get port conflict errors, check what's using the ports:
```bash
sudo lsof -i :5173  # Frontend
sudo lsof -i :8000  # Supabase API
sudo lsof -i :3000  # Supabase Studio
sudo lsof -i :5432  # PostgreSQL
```

### Database Connection Issues

1. Ensure the database is healthy:
```bash
docker compose ps
```

2. Check database logs:
```bash
docker compose logs supabase-db
```

### Reset Everything

```bash
# Stop all containers and remove volumes
docker compose down -v

# Remove all related images (optional)
docker compose down --rmi all

# Start fresh
docker compose up -d
```

### Frontend Can't Connect to Supabase

1. Verify Supabase API is running:
```bash
curl http://localhost:8000/rest/v1/
```

2. Check Kong gateway logs:
```bash
docker compose logs supabase-kong
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐      ┌─────────────┐      ┌──────────────┐   │
│  │ Frontend │──────│ Kong (API   │──────│ Auth Service │   │
│  │ :5173    │      │ Gateway)    │      │ (GoTrue)     │   │
│  └──────────┘      │ :8000       │      └──────────────┘   │
│                    └─────────────┘                          │
│                          │                                   │
│              ┌───────────┼───────────┐                      │
│              │           │           │                       │
│       ┌──────▼───┐ ┌─────▼────┐ ┌────▼─────┐               │
│       │ PostgREST│ │ Storage  │ │ Studio   │               │
│       │ :3001    │ │ :5000    │ │ :3000    │               │
│       └──────────┘ └──────────┘ └──────────┘               │
│              │           │           │                       │
│              └───────────┼───────────┘                      │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │ PostgreSQL  │                            │
│                   │ :5432       │                            │
│                   └─────────────┘                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Production Considerations

1. **Generate New Secrets**: Never use the default demo keys in production
2. **Enable HTTPS**: Use a reverse proxy like nginx with SSL certificates
3. **Backup Database**: Set up regular PostgreSQL backups
4. **Resource Limits**: Add memory/CPU limits to docker-compose.yml
5. **Monitoring**: Consider adding Prometheus/Grafana for monitoring

## Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart frontend
docker compose up -d --build frontend

# If database migrations are needed, apply them via Supabase Studio
```
