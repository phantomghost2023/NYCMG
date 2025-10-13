# PowerShell script to clean up all dependencies and reset the project state

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

Write-Log "NYCMG Dependency Cleanup Script" "INFO"
Write-Log "This script will remove all node_modules directories and lock files" "WARN"

# Confirm with user
$confirmation = Read-Host "Are you sure you want to proceed? (y/N)"
if ($confirmation -ne "y" -and $confirmation -ne "Y") {
    Write-Log "Cleanup cancelled by user" "INFO"
    exit 0
}

# Clear npm cache
Write-Log "Clearing npm cache..." "INFO"
try {
    npm cache clean --force
    Write-Log "npm cache cleared successfully" "INFO"
} catch {
    Write-Log "Failed to clear npm cache: $($_.Exception.Message)" "WARN"
}

# Clear yarn cache if available
if (Test-Command "yarn") {
    Write-Log "Clearing yarn cache..." "INFO"
    try {
        yarn cache clean
        Write-Log "yarn cache cleared successfully" "INFO"
    } catch {
        Write-Log "Failed to clear yarn cache: $($_.Exception.Message)" "WARN"
    }
}

# Remove all node_modules directories
Write-Log "Removing node_modules directories..." "INFO"
Get-ChildItem -Recurse -Directory -Name "node_modules" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Log "Removing $_" "DEBUG"
    try {
        Remove-Item $_ -Recurse -Force -ErrorAction Stop
        Write-Log "Successfully removed $_" "DEBUG"
    } catch {
        Write-Log "Failed to remove $_ : $($_.Exception.Message)" "WARN"
    }
}

# Remove all package-lock.json files
Write-Log "Removing package-lock.json files..." "INFO"
Get-ChildItem -Recurse -Name "package-lock.json" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Log "Removing $_" "DEBUG"
    try {
        Remove-Item $_ -Force -ErrorAction Stop
        Write-Log "Successfully removed $_" "DEBUG"
    } catch {
        Write-Log "Failed to remove $_ : $($_.Exception.Message)" "WARN"
    }
}

# Remove all yarn.lock files if yarn is available
if (Test-Command "yarn") {
    Write-Log "Removing yarn.lock files..." "INFO"
    Get-ChildItem -Recurse -Name "yarn.lock" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Log "Removing $_" "DEBUG"
        try {
            Remove-Item $_ -Force -ErrorAction Stop
            Write-Log "Successfully removed $_" "DEBUG"
        } catch {
            Write-Log "Failed to remove $_ : $($_.Exception.Message)" "WARN"
        }
    }
}

# Remove lerna's node_modules (if exists)
if (Test-Path "node_modules") {
    Write-Log "Removing root node_modules..." "INFO"
    try {
        Remove-Item "node_modules" -Recurse -Force -ErrorAction Stop
        Write-Log "Successfully removed root node_modules" "INFO"
    } catch {
        Write-Log "Failed to remove root node_modules: $($_.Exception.Message)" "WARN"
    }
}

Write-Log "Dependency cleanup completed!" "INFO"
Write-Log "You can now run the installation script to reinstall dependencies:" "INFO"
Write-Log "  .\scripts\install_dependencies_robust.ps1" "INFO"