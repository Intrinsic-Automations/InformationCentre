#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -U postgres; do
  sleep 1
done

echo "Applying database migrations..."
for migration in /docker-entrypoint-initdb.d/migrations/*.sql; do
  if [ -f "$migration" ]; then
    echo "Applying migration: $(basename $migration)"
    psql -U postgres -d postgres -f "$migration"
  fi
done

echo "All migrations applied successfully!"
