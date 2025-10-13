# Web frontend deployment script

Write-Host "🚀 Deploying NYCMG Web Frontend..."

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
  Write-Host "❌ Error: package.json not found. Please run this script from the web directory."
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
docker build -t nycmg-web .

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Error: Docker build failed."
  exit 1
}

# Stop and remove existing container if it exists
Write-Host "🛑 Stopping existing container..."
docker stop nycmg-web-container 2>$null
docker rm nycmg-web-container 2>$null

# Run the container
Write-Host "🏃 Running container..."
docker run -d `
  --name nycmg-web-container `
  -p 3001:3000 `
  -e NODE_ENV=production `
  nycmg-web

# Check if container is running
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Web frontend deployed successfully!"
  Write-Host "🌐 Access the web app at http://localhost:3001"
} else {
  Write-Host "❌ Error: Failed to start container."
  exit 1
}