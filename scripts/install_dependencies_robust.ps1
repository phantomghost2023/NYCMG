# PowerShell script to install dependencies for NYCMG project with robust error handling

param(
    [switch]$Clean = $false,
    [switch]$UseYarn = $false,
    [switch]$Verbose = $false,
    [switch]$SkipBackend = $false,
    [switch]$SkipWeb = $false,
    [switch]$SkipMobile = $false,
    [switch]$SkipShared = $false
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
        # Save current location
        $originalLocation = Get-Location
        
        # Change to target directory
        Set-Location $Path
        
        # Check if package.json exists
        if (-not (Test-Path "package.json")) {
            Write-Log "No package.json found in $Name, skipping..." "WARN"
            Set-Location $originalLocation
            return $true
        }
        
        # Use yarn if available and requested, otherwise use npm
        if ($UseYarn -and (Test-Command "yarn")) {
            Write-Log "Using yarn for $Name..." "DEBUG"
            yarn install --frozen-lockfile
        } else {
            Write-Log "Using npm with legacy-peer-deps for $Name..." "DEBUG"
            npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline
        }
        
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to install $Name dependencies (exit code: $LASTEXITCODE)"
        }
        
        Write-Log "Successfully installed $Name dependencies" "INFO"
        Set-Location $originalLocation
        return $true
    } catch {
        Write-Log "Error installing $Name dependencies: $($_.Exception.Message)" "ERROR"
        # Always return to original location
        Set-Location $originalLocation
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
    Write-Log "Removing node_modules directories and lock files..." "INFO"
    
    # Remove node_modules directories
    Get-ChildItem -Recurse -Directory -Name "node_modules" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Log "Removing $_" "DEBUG"
        try {
            Remove-Item $_ -Recurse -Force -ErrorAction Stop
        } catch {
            Write-Log "Failed to remove $_ : $($_.Exception.Message)" "WARN"
        }
    }
    
    # Remove package-lock.json files
    Get-ChildItem -Recurse -Name "package-lock.json" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Log "Removing $_" "DEBUG"
        try {
            Remove-Item $_ -Force -ErrorAction Stop
        } catch {
            Write-Log "Failed to remove $_ : $($_.Exception.Message)" "WARN"
        }
    }
    
    # Remove yarn.lock files if yarn is available
    if (Test-Command "yarn") {
        Get-ChildItem -Recurse -Name "yarn.lock" -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Log "Removing $_" "DEBUG"
            try {
                Remove-Item $_ -Force -ErrorAction Stop
            } catch {
                Write-Log "Failed to remove $_ : $($_.Exception.Message)" "WARN"
            }
        }
    }
}

function Fix-PackageJson {
    Write-Log "Fixing package.json files..." "INFO"
    
    # Fix mobile React version compatibility
    $mobilePackageJsonPath = "mobile\package.json"
    if (Test-Path $mobilePackageJsonPath) {
        try {
            $mobilePackageJson = Get-Content $mobilePackageJsonPath | ConvertFrom-Json
            # Ensure React versions are compatible
            $mobilePackageJson.dependencies.react = "18.2.0"
            $mobilePackageJson."devDependencies"."react-test-renderer" = "18.2.0"
            $mobilePackageJson | ConvertTo-Json -Depth 10 | Set-Content $mobilePackageJsonPath
            Write-Log "Updated React version in mobile package.json" "INFO"
        } catch {
            Write-Log "Failed to update React version in mobile package.json: $($_.Exception.Message)" "WARN"
        }
    }
    
    # Fix root workspaces configuration
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
    
    # Fix lerna.json if it exists
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
Write-Log "Skip Modules - Backend: $SkipBackend, Web: $SkipWeb, Mobile: $SkipMobile, Shared: $SkipShared" "DEBUG"

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

# Install module dependencies
$installResults = @{}

# Install backend dependencies
if (-not $SkipBackend -and (Test-Path "backend")) {
    $installResults["backend"] = Install-Dependencies "backend" "backend"
}

# Install web dependencies
if (-not $SkipWeb -and (Test-Path "web")) {
    $installResults["web"] = Install-Dependencies "web" "web"
}

# Install mobile dependencies
if (-not $SkipMobile -and (Test-Path "mobile")) {
    $installResults["mobile"] = Install-Dependencies "mobile" "mobile"
}

# Install shared dependencies
if (-not $SkipShared -and (Test-Path "shared")) {
    $installResults["shared"] = Install-Dependencies "shared" "shared"
}

# Check results and report
$allSuccessful = $true
foreach ($module in $installResults.Keys) {
    if (-not $installResults[$module]) {
        $allSuccessful = $false
        Write-Log "Failed to install $module dependencies" "ERROR"
    }
}

if ($allSuccessful) {
    Write-Log "All dependency installations completed successfully!" "INFO"
} else {
    Write-Log "Some dependency installations failed. Check the errors above." "ERROR"
    exit 1
}

Write-Log "Dependency installation process completed!" "INFO"
Write-Log "If you encounter any issues, try running this script with -Clean flag:" "INFO"
Write-Log "  .\scripts\install_dependencies_robust.ps1 -Clean" "INFO"