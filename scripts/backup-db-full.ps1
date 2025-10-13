# Full database backup script

Write-Host "Creating full backup of NYCMG database..."

# Configuration
$DB_NAME = "nycmg"
$DB_USER = "postgres"
$BACKUP_DIR = "./backups/database/full"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR/nycmg_full_$DATE.sql"

# Create backup directory if it doesn't exist
if (!(Test-Path $BACKUP_DIR)) {
  New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

# Perform backup using docker exec (assuming database is in a container)
try {
  Write-Host "Creating backup..."
  docker exec nycmg-db pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_FILE
  
  if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Full backup completed successfully: $BACKUP_FILE"
    
    # Compress backup
    Compress-Archive -Path $BACKUP_FILE -DestinationPath "$BACKUP_FILE.zip" -Force
    Remove-Item $BACKUP_FILE
    Write-Host "📦 Backup compressed: $BACKUP_FILE.zip"
    
  } else {
    Write-Host "❌ Full backup failed"
    exit 1
  }
} catch {
  Write-Host "❌ Error during backup: $_"
  exit 1
}