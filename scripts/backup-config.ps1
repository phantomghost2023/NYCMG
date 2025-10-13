# Configuration backup script

Write-Host "Creating backup of configuration files..."

# Configuration
$CONFIG_DIR = "./config"
$BACKUP_DIR = "./backups/config"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR/config_$DATE.zip"

# Create backup directory if it doesn't exist
if (!(Test-Path $BACKUP_DIR)) {
  New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

# Check if config directory exists
if (!(Test-Path $CONFIG_DIR)) {
  Write-Host "⚠️  Config directory not found, creating empty backup"
  New-Item -ItemType Directory -Path $CONFIG_DIR | Out-Null
}

# Perform backup
try {
  Write-Host "Creating backup of configuration files..."
  Compress-Archive -Path $CONFIG_DIR -DestinationPath $BACKUP_FILE -Force
  
  if (Test-Path $BACKUP_FILE) {
    Write-Host "✅ Configuration backup completed successfully: $BACKUP_FILE"
  } else {
    Write-Host "❌ Configuration backup failed"
    exit 1
  }
} catch {
  Write-Host "❌ Error during configuration backup: $_"
  exit 1
}