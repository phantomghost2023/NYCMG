# PowerShell script to install dependencies for NYCMG project with robust error handling

param(
    [switch]$Clean = $false,
    [switch]$UseYarn = $false,
    [switch]$Verbose = $false
)

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = "White"
    
    switch ($Level) {
        "INFO" { $color = "Green" }
        "WARN" { $color = "Yellow" }
        "ERROR" { $color = "Red" }
        "DEBUG" { $color = "Gray" }
    }
    
    if ($Verbose -or $Level -ne "DEBUG") {
        Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
    }
}

function Test-Command {
    param([string]$Command)
    
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Install-Dependencies {
    param(
        [string]$Path,
        [string]$Name
    )
    
    Write-Log "Installing $Name dependencies..." "INFO"
    
    try {
        Set-Location $Path
        
        if ($UseYarn -and (Test-Command "yarn")) {
            Write-Log "Using yarn for $Name..." "DEBUG"
            yarn install
        } else {
            Write-Log "Using npm with legacy-peer-deps for $Name..." "DEBUG"
            npm install --legacy-peer-deps --no-audit --no-fund
        }
        
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to install $Name dependencies"
        }
        
        Write-Log "Successfully installed $Name dependencies" "INFO"
        Set-Location ..
        return $true
    } catch {
        Write-Log "Error installing $Name dependencies: $($_.Exception.Message)" "ERROR"
        Set-Location ..
        return $false
    }
}

function Clear-Cache {
    Write-Log "Clearing npm cache..." "INFO"
    try {
        npm cache clean --force
        Write-Log "npm cache cleared successfully" "INFO"
    } catch {
        Write-Log "Failed to clear npm cache: $($_.Exception.Message)" "WARN"
    }
    
    if (Test-Command "yarn") {
        Write-Log "Clearing yarn cache..." "INFO"
        try {
            yarn cache clean
            Write-Log "yarn cache cleared successfully" "INFO"
        } catch {
            Write-Log "Failed to clear yarn cache: $($_.Exception.Message)" "WARN"
        }
    }
}

function Remove-NodeModules {
    Write-Log "Removing node_modules directories and package-lock.json files..." "INFO"
    
    Get-ChildItem -Recurse -Directory -Name "node_modules" | ForEach-Object {
        Write-Log "Removing $_" "DEBUG"
        Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Get-ChildItem -Recurse -Name "package-lock.json" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Log "Removing $_" "DEBUG"
        Remove-Item $_ -Force -ErrorAction SilentlyContinue
    }
    
    if (Test-Command "yarn") {
        Get-ChildItem -Recurse -Name "yarn.lock" -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Log "Removing $_" "DEBUG"
            Remove-Item $_ -Force -ErrorAction SilentlyContinue
        }
    }
}

function Fix-PackageJson {
    Write-Log "Fixing package.json files..." "INFO"
    
    # Fix mobile React version
    $mobilePackageJsonPath = "mobile\package.json"
    if (Test-Path $mobilePackageJsonPath) {
        try {
            $mobilePackageJson = Get-Content $mobilePackageJsonPath | ConvertFrom-Json
            $mobilePackageJson.dependencies.react = "18.2.0"
            $mobilePackageJson."devDependencies"."react-test-renderer" = "18.2.0"
            $mobilePackageJson | ConvertTo-Json -Depth 10 | Set-Content $mobilePackageJsonPath
            Write-Log "Updated React version in mobile package.json" "INFO"
        } catch {
            Write-Log "Failed to update React version in mobile package.json: $($_.Exception.Message)" "WARN"
        }
    }
    
    # Fix root workspaces
    $rootPackageJsonPath = "package.json"
    if (Test-Path $rootPackageJsonPath) {
        try {
            $rootPackageJson = Get-Content $rootPackageJsonPath | ConvertFrom-Json
            $rootPackageJson.workspaces = @("web", "mobile", "backend", "shared")
            $rootPackageJson | ConvertTo-Json -Depth 10 | Set-Content $rootPackageJsonPath
            Write-Log "Updated workspaces in root package.json" "INFO"
        } catch {
            Write-Log "Failed to update workspaces in root package.json: $($_.Exception.Message)" "WARN"
        }
    }
    
    # Fix lerna.json
    $lernaJsonPath = "lerna.json"
    if (Test-Path $lernaJsonPath) {
        try {
            $lernaJson = Get-Content $lernaJsonPath | ConvertFrom-Json
            $lernaJson.packages = @("web", "mobile", "backend", "shared")
            $lernaJson | ConvertTo-Json -Depth 10 | Set-Content $lernaJsonPath
            Write-Log "Updated packages in lerna.json" "INFO"
        } catch {
            Write-Log "Failed to update packages in lerna.json: $($_.Exception.Message)" "WARN"
        }
    }
}

# Main execution
Write-Log "NYCMG Robust Dependency Installation Script" "INFO"
Write-Log "Options - Clean: $Clean, UseYarn: $UseYarn, Verbose: $Verbose" "DEBUG"

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Log "Error: Could not find root package.json. Please run this script from the project root directory." "ERROR"
    exit 1
}

# Clean if requested
if ($Clean) {
    Write-Log "Performing clean installation..." "INFO"
    Clear-Cache
    Remove-NodeModules
    Fix-PackageJson
}

# Check for package managers
$hasNpm = Test-Command "npm"
$hasYarn = Test-Command "yarn"

if (-not $hasNpm) {
    Write-Log "Error: npm is not installed or not in PATH" "ERROR"
    exit 1
}

if ($UseYarn -and -not $hasYarn) {
    Write-Log "Warning: yarn requested but not found, falling back to npm" "WARN"
    $UseYarn = $false
}

# Install root dependencies
$success = Install-Dependencies "." "root"
if (-not $success) {
    Write-Log "Failed to install root dependencies. Exiting." "ERROR"
    exit 1
}

# Install backend dependencies
if (Test-Path "backend") {
    $success = Install-Dependencies "backend" "backend"
    if (-not $success) {
        Write-Log "Failed to install backend dependencies" "ERROR"
    }
}

# Install web dependencies
if (Test-Path "web") {
    $success = Install-Dependencies "web" "web"
    if (-not $success) {
        Write-Log "Failed to install web dependencies" "ERROR"
    }
}

# Install mobile dependencies
if (Test-Path "mobile") {
    $success = Install-Dependencies "mobile" "mobile"
    if (-not $success) {
        Write-Log "Failed to install mobile dependencies" "ERROR"
    }
}

# Install shared dependencies
if (Test-Path "shared") {
    $success = Install-Dependencies "shared" "shared"
    if (-not $success) {
        Write-Log "Failed to install shared dependencies" "ERROR"
    }
}

Write-Log "Dependency installation process completed!" "INFO"
Write-Log "If you encounter any issues, try running this script with -Clean flag:" "INFO"
Write-Log "  .\scripts\install_dependencies_robust.ps1 -Clean" "INFO"