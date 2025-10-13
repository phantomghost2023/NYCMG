# File backup script for user uploads

Write-Host "Creating backup of user uploads..."

# Configuration
$UPLOADS_DIR = "./uploads"
$BACKUP_DIR = "./backups/files"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR/uploads_$DATE.zip"

# Create backup directory if it doesn't exist
if (!(Test-Path $BACKUP_DIR)) {
  New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

# Check if uploads directory exists
if (!(Test-Path $UPLOADS_DIR)) {
  Write-Host "⚠️  Uploads directory not found, creating empty backup"
  New-Item -ItemType Directory -Path $UPLOADS_DIR | Out-Null
}

# Perform backup
try {
  Write-Host "Creating backup of user uploads..."
  Compress-Archive -Path $UPLOADS_DIR -DestinationPath $BACKUP_FILE -Force
  
  if (Test-Path $BACKUP_FILE) {
    Write-Host "✅ File backup completed successfully: $BACKUP_FILE"
  } else {
    Write-Host "❌ File backup failed"
    exit 1
  }
} catch {
  Write-Host "❌ Error during file backup: $_"
  exit 1
}