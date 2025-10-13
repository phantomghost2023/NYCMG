#!/bin/bash

# Backend deployment script

echo "🚀 Deploying NYCMG Backend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the backend directory."
  exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Error: Docker is not installed. Please install Docker first."
  exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t nycmg-backend .

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Error: Docker build failed."
  exit 1
fi

# Stop and remove existing container if it exists
echo "🛑 Stopping existing container..."
docker stop nycmg-backend-container 2>/dev/null
docker rm nycmg-backend-container 2>/dev/null

# Run the container
echo "🏃 Running container..."
docker run -d \
  --name nycmg-backend-container \
  -p 3000:3000 \
  -e NODE_ENV=production \
  nycmg-backend

# Check if container is running
if [ $? -eq 0 ]; then
  echo "✅ Backend deployed successfully!"
  echo "🌐 Access the API at http://localhost:3000"
else
  echo "❌ Error: Failed to start container."
  exit 1
fi