# PowerShell script to install dependencies for each module individually

Write-Host "Installing NYCMG project dependencies individually..." -ForegroundColor Green

# Function to install dependencies in a directory
function Install-Dependencies {
    param(
        [string]$Directory,
        [string]$Name
    )
    
    Write-Host "Installing $Name dependencies..." -ForegroundColor Yellow
    
    if (Test-Path $Directory) {
        Set-Location $Directory
        
        # Check if package.json exists
        if (Test-Path "package.json") {
            Write-Host "   Found package.json in $Directory" -ForegroundColor Gray
            
            # Try yarn first, then npm
            try {
                $yarnVersion = yarn --version
                Write-Host "   Using Yarn version $yarnVersion" -ForegroundColor Gray
                yarn install --ignore-engines
            } catch {
                Write-Host "   Using npm with legacy-peer-deps" -ForegroundColor Gray
                npm install --legacy-peer-deps
            }
            
            Write-Host "   $Name dependencies installed successfully" -ForegroundColor Green
        } else {
            Write-Host "   No package.json found in $Directory" -ForegroundColor Red
        }
        
        Set-Location ..
    } else {
        Write-Host "   Directory $Directory not found" -ForegroundColor Red
    }
}

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
try {
    $yarnVersion = yarn --version
    Write-Host "   Using Yarn version $yarnVersion" -ForegroundColor Gray
    yarn install --ignore-engines
} catch {
    Write-Host "   Using npm with legacy-peer-deps" -ForegroundColor Gray
    npm install --legacy-peer-deps
}

# Install backend dependencies
Install-Dependencies "backend" "Backend"

# Install web dependencies
Install-Dependencies "web" "Web"

# Install mobile dependencies
Install-Dependencies "mobile" "Mobile"

# Install shared dependencies (if it exists)
if (Test-Path "shared") {
    Install-Dependencies "shared" "Shared"
}

Write-Host "All dependencies installed successfully!" -ForegroundColor Green