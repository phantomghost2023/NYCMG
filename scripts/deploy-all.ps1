# Deploy all components using docker-compose

Write-Host "🚀 Deploying entire NYCMG application..."

# Check if docker-compose is installed
try {
  $composeVersion = docker-compose --version
  Write-Host "✅ Docker Compose found: $composeVersion"
} catch {
  Write-Host "❌ Error: docker-compose is not installed. Please install Docker Desktop or docker-compose."
  exit 1
}

# Check if we're in the right directory (should have docker-compose.yml)
if (-not (Test-Path "docker-compose.yml")) {
  Write-Host "❌ Error: docker-compose.yml not found. Please run this script from the root directory."
  exit 1
}

# Pull latest images
Write-Host "📥 Pulling latest images..."
docker-compose pull

# Build services
Write-Host "🏗️  Building services..."
docker-compose build

# Start services
Write-Host "🏃 Starting services..."
docker-compose up -d

# Check if services are running
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ All services started successfully!"
  Write-Host ""
  Write-Host "🌐 Access the services at:"
  Write-Host "   Backend API: http://localhost:3000"
  Write-Host "   Web Frontend: http://localhost:3001"
  Write-Host "   Database Admin: http://localhost:8080"
  Write-Host ""
  Write-Host "📊 View logs with: docker-compose logs -f"
  Write-Host "🛑 Stop services with: docker-compose down"
} else {
  Write-Host "❌ Error: Failed to start services."
  exit 1
}