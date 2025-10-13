# Backend deployment script

Write-Host "🚀 Deploying NYCMG Backend..."

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
  Write-Host "❌ Error: package.json not found. Please run this script from the backend directory."
  exit 1
}

# Check if Docker is installed
try {
  $dockerVersion = docker --version
  Write-Host "✅ Docker found: $dockerVersion"
} catch {
  Write-Host "❌ Error: Docker is not installed. Please install Docker first."
  exit 1
}

# Build the Docker image
Write-Host "📦 Building Docker image..."
docker build -t nycmg-backend .

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Error: Docker build failed."
  exit 1
}

# Stop and remove existing container if it exists
Write-Host "🛑 Stopping existing container..."
docker stop nycmg-backend-container 2>$null
docker rm nycmg-backend-container 2>$null

# Run the container
Write-Host "🏃 Running container..."
docker run -d `
  --name nycmg-backend-container `
  -p 3000:3000 `
  -e NODE_ENV=production `
  nycmg-backend

# Check if container is running
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Backend deployed successfully!"
  Write-Host "🌐 Access the API at http://localhost:3000"
} else {
  Write-Host "❌ Error: Failed to start container."
  exit 1
}