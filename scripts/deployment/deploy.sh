#!/bin/bash

# VPS Deployment Script for Real Estate Platform
# Usage: ./deploy.sh [production|staging]

set -e  # Exit on any error

ENVIRONMENT=${1:-production}
PROJECT_NAME="realestate-platform"

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env.$ENVIRONMENT" ]; then
    echo "❌ Environment file .env.$ENVIRONMENT not found!"
    echo "Please create .env.$ENVIRONMENT based on .env.production template"
    exit 1
fi

echo "✅ Environment file found: .env.$ENVIRONMENT"

# Copy environment file
cp ".env.$ENVIRONMENT" .env

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down --remove-orphans

# Remove old images (optional, uncomment if needed)
# echo "🗑️  Removing old images..."
# docker image prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🗃️  Running database migrations..."
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma generate

# Optional: Seed database with initial data
# echo "🌱 Seeding database..."
# docker-compose exec app npm run seed

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:5544/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "❌ Health check failed. Check logs:"
    docker-compose logs app
    exit 1
fi

# Show running containers
echo "📋 Running containers:"
docker-compose ps

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is available at: http://localhost:5544"
echo "📊 To view logs: docker-compose logs -f app"
echo "🛑 To stop: docker-compose down"
