# PowerShell script to view dependency installation logs

param(
    [int]$Lines = 50,
    [switch]$Follow = $false,
    [string]$LogPath = ""
)

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Green
}

# If a specific log path is provided, check if it exists
if ($LogPath -ne "") {
    if (Test-Path $LogPath) {
        Write-Log "Displaying last $Lines lines from $LogPath"
        if ($Follow) {
            Get-Content $LogPath -Tail $Lines -Wait
        } else {
            Get-Content $LogPath -Tail $Lines
        }
    } else {
        Write-Host "Error: Log file not found: $LogPath" -ForegroundColor Red
        exit 1
    }
} else {
    # Look for common log files
    $logFiles = @(
        "npm-debug.log",
        "yarn-error.log",
        "yarn-debug.log"
    )
    
    Write-Log "Searching for log files in current and subdirectories..."
    
    $foundLogs = @()
    foreach ($logFile in $logFiles) {
        $files = Get-ChildItem -Recurse -Name $logFile -ErrorAction SilentlyContinue
        if ($files) {
            $foundLogs += $files
        }
    }
    
    if ($foundLogs.Count -eq 0) {
        Write-Host "No log files found." -ForegroundColor Yellow
        Write-Host "Try running the installation with verbose output to generate logs:" -ForegroundColor Yellow
        Write-Host "  .\scripts\install_dependencies_robust.ps1 -Verbose" -ForegroundColor Gray
        exit 0
    }
    
    Write-Log "Found $($foundLogs.Count) log file(s):"
    foreach ($log in $foundLogs) {
        Write-Host "  - $log" -ForegroundColor Gray
    }
    
    # Display the most recent log file
    $mostRecentLog = $foundLogs | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    Write-Log "Displaying last $Lines lines from most recent log: $mostRecentLog"
    
    if ($Follow) {
        Get-Content $mostRecentLog -Tail $Lines -Wait
    } else {
        Get-Content $mostRecentLog -Tail $Lines
    }
}