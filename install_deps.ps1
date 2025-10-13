# PowerShell script to install dependencies for each module individually

Write-Host "Installing NYCMG project dependencies..." -ForegroundColor Green

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install --legacy-peer-deps
Set-Location ..

# Install web dependencies
Write-Host "Installing web dependencies..." -ForegroundColor Yellow
Set-Location web
npm install --legacy-peer-deps
Set-Location ..

# Install mobile dependencies
Write-Host "Installing mobile dependencies..." -ForegroundColor Yellow
Set-Location mobile
npm install --legacy-peer-deps
Set-Location ..

# Install shared dependencies
if (Test-Path shared) {
  Write-Host "Installing shared dependencies..." -ForegroundColor Yellow
  Set-Location shared
  npm install --legacy-peer-deps
  Set-Location ..
}

Write-Host "All dependencies installed successfully!" -ForegroundColor Green