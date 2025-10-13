# PowerShell script to fix all dependency issues in the NYCMG project

param(
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

Write-Log "Fixing NYCMG Dependency Issues..." "INFO"

# 1. Clear npm cache
Write-Log "1. Clearing npm cache..." "INFO"
try {
    npm cache clean --force
    Write-Log "   npm cache cleared successfully" "INFO"
} catch {
    Write-Log "   Failed to clear npm cache: $($_.Exception.Message)" "WARN"
}

# 2. Remove all node_modules directories
Write-Log "2. Removing node_modules directories..." "INFO"
Get-ChildItem -Recurse -Directory -Name "node_modules" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Log "   Removing $_" "DEBUG"
    try {
        Remove-Item $_ -Recurse -Force -ErrorAction Stop
    } catch {
        Write-Log "   Failed to remove $_ : $($_.Exception.Message)" "WARN"
    }
}

# 3. Remove all package-lock.json files
Write-Log "3. Removing package-lock.json files..." "INFO"
Get-ChildItem -Recurse -Name "package-lock.json" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Log "   Removing $_" "DEBUG"
    try {
        Remove-Item $_ -Force -ErrorAction Stop
    } catch {
        Write-Log "   Failed to remove $_ : $($_.Exception.Message)" "WARN"
    }
}

# 4. Remove all yarn.lock files if yarn is available
if (Test-Command "yarn") {
    Write-Log "4. Removing yarn.lock files..." "INFO"
    Get-ChildItem -Recurse -Name "yarn.lock" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Log "   Removing $_" "DEBUG"
        try {
            Remove-Item $_ -Force -ErrorAction Stop
        } catch {
            Write-Log "   Failed to remove $_ : $($_.Exception.Message)" "WARN"
        }
    }
}

# 5. Fix React version in mobile package.json
Write-Log "5. Fixing React version in mobile package.json..." "INFO"
$mobilePackageJsonPath = "mobile\package.json"
if (Test-Path $mobilePackageJsonPath) {
    try {
        $mobilePackageJson = Get-Content $mobilePackageJsonPath | ConvertFrom-Json
        # Ensure React versions are compatible
        $mobilePackageJson.dependencies.react = "18.2.0"
        $mobilePackageJson."devDependencies"."react-test-renderer" = "18.2.0"
        $mobilePackageJson | ConvertTo-Json -Depth 10 | Set-Content $mobilePackageJsonPath
        Write-Log "   Updated React version to 18.2.0" "INFO"
    } catch {
        Write-Log "   Failed to update React version in mobile package.json: $($_.Exception.Message)" "WARN"
    }
}

# 6. Fix workspaces in root package.json
Write-Log "6. Fixing workspaces in root package.json..." "INFO"
$rootPackageJsonPath = "package.json"
if (Test-Path $rootPackageJsonPath) {
    try {
        $rootPackageJson = Get-Content $rootPackageJsonPath | ConvertFrom-Json
        $rootPackageJson.workspaces = @("web", "mobile", "backend", "shared")
        $rootPackageJson | ConvertTo-Json -Depth 10 | Set-Content $rootPackageJsonPath
        Write-Log "   Updated workspaces configuration" "INFO"
    } catch {
        Write-Log "   Failed to update workspaces in root package.json: $($_.Exception.Message)" "WARN"
    }
}

# 7. Fix lerna.json if it exists
Write-Log "7. Fixing lerna.json (if exists)..." "INFO"
$lernaJsonPath = "lerna.json"
if (Test-Path $lernaJsonPath) {
    try {
        $lernaJson = Get-Content $lernaJsonPath | ConvertFrom-Json
        $lernaJson.packages = @("web", "mobile", "backend", "shared")
        $lernaJson | ConvertTo-Json -Depth 10 | Set-Content $lernaJsonPath
        Write-Log "   Updated packages in lerna.json" "INFO"
    } catch {
        Write-Log "   Failed to update packages in lerna.json: $($_.Exception.Message)" "WARN"
    }
}

# 8. Install dependencies with yarn or npm
$useYarn = $false
try {
    $yarnVersion = yarn --version
    Write-Log "Yarn version $yarnVersion found" "INFO"
    $useYarn = $true
} catch {
    Write-Log "Yarn not found, will use npm with legacy-peer-deps" "INFO"
    $useYarn = $false
}

if ($useYarn) {
    Write-Log "8. Installing dependencies with Yarn..." "INFO"
    try {
        yarn install --frozen-lockfile
        Write-Log "   Dependencies installed successfully with Yarn" "INFO"
    } catch {
        Write-Log "   Failed to install dependencies with Yarn: $($_.Exception.Message)" "ERROR"
    }
} else {
    Write-Log "8. Installing dependencies with npm (legacy-peer-deps)..." "INFO"
    try {
        npm install --legacy-peer-deps --no-audit --no-fund
        Write-Log "   Dependencies installed successfully with npm" "INFO"
    } catch {
        Write-Log "   Failed to install dependencies with npm: $($_.Exception.Message)" "ERROR"
    }
}

Write-Log "Dependency fix process completed!" "INFO"
Write-Log "If you still encounter issues, try installing dependencies for each module individually." "INFO"