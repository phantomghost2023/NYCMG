#!/bin/bash

# Deploy all components using docker-compose

echo "🚀 Deploying entire NYCMG application..."

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "❌ Error: docker-compose is not installed. Please install Docker Desktop or docker-compose."
  exit 1
fi

# Check if we're in the right directory (should have docker-compose.yml)
if [ ! -f "docker-compose.yml" ]; then
  echo "❌ Error: docker-compose.yml not found. Please run this script from the root directory."
  exit 1
fi

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose pull

# Build services
echo "🏗️  Building services..."
docker-compose build

# Start services
echo "🏃 Starting services..."
docker-compose up -d

# Check if services are running
if [ $? -eq 0 ]; then
  echo "✅ All services started successfully!"
  echo ""
  echo "🌐 Access the services at:"
  echo "   Backend API: http://localhost:3000"
  echo "   Web Frontend: http://localhost:3001"
  echo "   Database Admin: http://localhost:8080"
  echo ""
  echo "📊 View logs with: docker-compose logs -f"
  echo "🛑 Stop services with: docker-compose down"
else
  echo "❌ Error: Failed to start services."
  exit 1
fi