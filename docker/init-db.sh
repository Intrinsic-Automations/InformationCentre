#!/bin/bash
set -e

# Ensure PostgreSQL listens on all network interfaces (required for Docker networking)
echo "Setting listen_addresses to '*'..."
echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -U postgres; do
  sleep 1
done

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
