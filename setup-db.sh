#!/bin/bash
# Script to setup PostgreSQL database using Podman
# This script creates and initializes the news_portal database

set -e

echo "🚀 Setting up PostgreSQL database with Podman..."

# Create volume for persistent data
echo "📦 Creating volume for persistent data..."
podman volume create news_portal_data || echo "Volume already exists"

# Stop and remove existing container if it exists
echo "🧹 Cleaning up existing container..."
podman stop news_portal_db 2>/dev/null || true
podman rm news_portal_db 2>/dev/null || true

# Run PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
podman run -d \
  --name news_portal_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=news_portal \
  -p 5432:5432 \
  -v news_portal_data:/var/lib/postgresql/data \
  -v "$(pwd)/init-db:/docker-entrypoint-initdb.d:Z" \
  postgres:15-alpine

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if container is running
if podman ps | grep -q news_portal_db; then
  echo "✅ PostgreSQL container is running!"
  echo ""
  echo "📊 Database Information:"
  echo "  - Host: localhost"
  echo "  - Port: 5432"
  echo "  - Database: news_portal"
  echo "  - User: postgres"
  echo "  - Password: postgres123"
  echo ""
  echo "🔗 Connection String:"
  echo "  postgresql://postgres:postgres123@localhost:5432/news_portal"
  echo ""
  echo "📝 To connect to the database:"
  echo "  podman exec -it news_portal_db psql -U postgres -d news_portal"
  echo ""
  echo "🛑 To stop the database:"
  echo "  podman stop news_portal_db"
  echo ""
  echo "▶️  To start the database:"
  echo "  podman start news_portal_db"
else
  echo "❌ Failed to start PostgreSQL container"
  exit 1
fi
