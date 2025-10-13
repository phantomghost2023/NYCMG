# Backup validation script

Write-Host "🔍 Validating backups..."

# Check database backups
$DB_BACKUP_DIR = "./backups/database/full"
if (Test-Path $DB_BACKUP_DIR) {
  $LATEST_DB_BACKUP = Get-ChildItem $DB_BACKUP_DIR -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($LATEST_DB_BACKUP) {
    Write-Host "✅ Latest database backup found: $($LATEST_DB_BACKUP.Name)"
  } else {
    Write-Host "❌ No database backup found in $DB_BACKUP_DIR"
  }
} else {
  Write-Host "❌ Database backup directory not found: $DB_BACKUP_DIR"
}

# Check file backups
$FILE_BACKUP_DIR = "./backups/files"
if (Test-Path $FILE_BACKUP_DIR) {
  $LATEST_FILE_BACKUP = Get-ChildItem $FILE_BACKUP_DIR -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($LATEST_FILE_BACKUP) {
    Write-Host "✅ Latest file backup found: $($LATEST_FILE_BACKUP.Name)"
  } else {
    Write-Host "❌ No file backup found in $FILE_BACKUP_DIR"
  }
} else {
  Write-Host "❌ File backup directory not found: $FILE_BACKUP_DIR"
}

# Check configuration backups
$CONFIG_BACKUP_DIR = "./backups/config"
if (Test-Path $CONFIG_BACKUP_DIR) {
  $LATEST_CONFIG_BACKUP = Get-ChildItem $CONFIG_BACKUP_DIR -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($LATEST_CONFIG_BACKUP) {
    Write-Host "✅ Latest configuration backup found: $($LATEST_CONFIG_BACKUP.Name)"
  } else {
    Write-Host "❌ No configuration backup found in $CONFIG_BACKUP_DIR"
  }
} else {
  Write-Host "❌ Configuration backup directory not found: $CONFIG_BACKUP_DIR"
}

Write-Host "📊 Backup validation completed"