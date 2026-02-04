# Docker Build & Deployment Guide

This guide explains how to build Docker images for both the frontend application and the self-hosted Supabase backend, with all migrations included.

## Quick Start

### 1. Clone and Configure

```bash
# Clone your repository
git clone <your-repo-url>
cd <project-folder>

# Copy the production environment file
cp docker/.env.production .env

# IMPORTANT: Edit .env and set secure values!
nano .env
```

### 2. Build and Run (Production)

```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### 3. Access Your Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | Main application |
| **Supabase API** | http://localhost:8000 | REST API endpoint |
| **Supabase Studio** | http://localhost:3000 | Database management UI |

---

## Building Individual Images

### Frontend Image Only

```bash
# Build the production frontend image
docker build -f Dockerfile.prod \
  --build-arg VITE_SUPABASE_URL=http://your-server:8000 \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key \
  -t eqommunity-hub-frontend:latest .

# Run the frontend container
docker run -d -p 80:80 --name eqommunity-frontend eqommunity-hub-frontend:latest
```

### Development Image

```bash
# Build development image (with hot reload)
docker build -f Dockerfile -t eqommunity-hub-dev:latest .

# Run with volume mounting for development
docker run -d -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name eqommunity-dev \
  eqommunity-hub-dev:latest
```

---

## Database Migrations

Migrations are automatically applied when the `supabase-db` container starts for the first time. The migrations are located in `supabase/migrations/` and are mounted into the container.

### Manual Migration Application

If you need to apply migrations to an existing database:

```bash
# Connect to the database container
docker compose -f docker-compose.prod.yml exec supabase-db bash

# Apply all migrations
for f in /docker-entrypoint-initdb.d/migrations/*.sql; do
  echo "Applying: $f"
  psql -U postgres -d postgres -f "$f"
done
```

### Adding New Migrations

1. Add new `.sql` files to `supabase/migrations/`
2. Rebuild and restart the database:
   ```bash
   docker compose -f docker-compose.prod.yml down
   docker compose -f docker-compose.prod.yml up -d --build
   ```

---

## Production Security Checklist

Before deploying to production, ensure you:

1. **Generate New Secrets**
   ```bash
   # Generate a strong password
   openssl rand -base64 32
   
   # Generate JWT secret (min 32 characters)
   openssl rand -base64 48
   ```

2. **Generate New API Keys**
   - Visit: https://supabase.com/docs/guides/self-hosting#api-keys
   - Use your JWT_SECRET to generate matching ANON_KEY and SERVICE_ROLE_KEY

3. **Update .env file** with all new secrets

4. **Enable HTTPS**
   - Use a reverse proxy (nginx/traefik) with SSL certificates
   - Update `SITE_URL` and `API_EXTERNAL_URL` to use `https://`

---

## Docker Image Tags

### Recommended Tagging Strategy

```bash
# Tag with version
docker tag eqommunity-hub-frontend:latest eqommunity-hub-frontend:v1.0.0

# Tag with git commit
docker tag eqommunity-hub-frontend:latest eqommunity-hub-frontend:$(git rev-parse --short HEAD)

# Push to registry
docker push your-registry/eqommunity-hub-frontend:latest
docker push your-registry/eqommunity-hub-frontend:v1.0.0
```

---

## Troubleshooting

### Database Not Starting

```bash
# Check database logs
docker compose -f docker-compose.prod.yml logs supabase-db

# Reset database (WARNING: destroys data)
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d
```

### Frontend Not Connecting to Supabase

1. Verify environment variables:
   ```bash
   docker compose -f docker-compose.prod.yml exec frontend env | grep VITE
   ```

2. Check Kong gateway is running:
   ```bash
   curl http://localhost:8000/rest/v1/
   ```

### Migration Errors

```bash
# View migration logs
docker compose -f docker-compose.prod.yml logs supabase-db | grep -i migration

# Manually check migration status
docker compose -f docker-compose.prod.yml exec supabase-db \
  psql -U postgres -c "SELECT * FROM pg_tables WHERE schemaname = 'public';"
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Stack                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                               │
│  │   Frontend   │ ◄── Production nginx serving React app        │
│  │   :80        │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐      ┌───────────────┐                        │
│  │    Kong      │──────│  Auth/GoTrue  │                        │
│  │  API Gateway │      │    :9999      │                        │
│  │    :8000     │      └───────────────┘                        │
│  └──────┬───────┘                                               │
│         │                                                        │
│    ┌────┴────┬──────────────┐                                   │
│    │         │              │                                    │
│    ▼         ▼              ▼                                    │
│ ┌─────┐  ┌─────────┐  ┌──────────┐                              │
│ │REST │  │ Storage │  │  Studio  │                              │
│ │:3001│  │  :5000  │  │  :3000   │                              │
│ └──┬──┘  └────┬────┘  └────┬─────┘                              │
│    │          │            │                                     │
│    └──────────┼────────────┘                                     │
│               │                                                  │
│        ┌──────▼──────┐                                          │
│        │  PostgreSQL │ ◄── Migrations auto-applied              │
│        │    :5432    │                                          │
│        └─────────────┘                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Persistence

Data is persisted in Docker volumes:
- `supabase-db-data` - PostgreSQL database
- `supabase-storage-data` - Uploaded files

### Backup

```bash
# Backup database
docker compose -f docker-compose.prod.yml exec supabase-db \
  pg_dump -U postgres postgres > backup_$(date +%Y%m%d).sql

# Backup storage
docker run --rm -v eqommunity-hub_supabase-storage-data:/data \
  -v $(pwd):/backup alpine tar czf /backup/storage_backup.tar.gz /data
```

### Restore

```bash
# Restore database
docker compose -f docker-compose.prod.yml exec -T supabase-db \
  psql -U postgres postgres < backup.sql
```
