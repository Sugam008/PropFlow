#!/bin/bash

# PropFlow Dev Start Script
# This script initializes the local development environment.

set -e

echo "🚀 Starting PropFlow development environment setup..."

# 1. Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: docker is not installed."
    exit 1
fi

# 2. Start infrastructure
echo "📦 Starting infrastructure services..."
docker-compose up -d

# 3. Wait for DB to be ready
echo "⏳ Waiting for database to be ready..."
until docker exec propflow-db pg_isready -U postgres &> /dev/null; do
  sleep 1
done
echo "✅ Database is ready!"

# 4. Initialize backend environment
echo "🐍 Setting up backend environment..."
if [ ! -f backend/.env ]; then
    echo "📄 Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
fi

# 5. Run migrations
echo "🔄 Running database migrations..."
cd backend
if [ -d "alembic" ]; then
    alembic upgrade head
else
    echo "⚠️  Alembic not configured, skipping migrations"
fi

# 6. Seed data
echo "🌱 Seeding initial data..."
if [ -f "scripts/seed.py" ]; then
    python scripts/seed.py
else
    echo "⚠️  Seed script not found, skipping seeding"
fi
cd ..

# 7. Frontend environment
echo "💻 Setting up frontend environment..."
if [ ! -f frontend/apps/customer-portal/.env ]; then
    cp frontend/apps/customer-portal/.env.example frontend/apps/customer-portal/.env
fi
if [ ! -f frontend/apps/valuer-dashboard/.env ]; then
    cp frontend/apps/valuer-dashboard/.env.example frontend/apps/valuer-dashboard/.env
fi

echo "✨ Environment setup complete!"
echo "👉 To start the development servers, run: pnpm dev"
