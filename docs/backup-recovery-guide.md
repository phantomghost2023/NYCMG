# Backup and Disaster Recovery Guide

This document provides instructions for setting up backup and disaster recovery procedures for the NYCMG application.

## Overview

The NYCMG application requires a comprehensive backup and disaster recovery strategy that includes:

1. **Database Backups** - Regular backups of PostgreSQL data
2. **File Backups** - Backups of user-uploaded files and assets
3. **Configuration Backups** - Backups of application configurations
4. **Disaster Recovery Procedures** - Steps to restore services after failure
5. **Backup Validation** - Regular testing of backup integrity

## Backup Strategy

### Database Backups

#### 1. Full Backups
- **Frequency**: Daily at 2:00 AM
- **Retention**: 30 days
- **Storage**: Encrypted cloud storage (S3, Google Cloud Storage, or Azure Blob Storage)

#### 2. Incremental Backups
- **Frequency**: Every 4 hours
- **Retention**: 7 days
- **Storage**: Local storage with replication

#### 3. Point-in-Time Recovery (PITR)
- **Frequency**: Continuous WAL archiving
- **Retention**: 7 days
- **Storage**: Encrypted cloud storage

### File Backups

#### 1. User Uploads
- **Frequency**: Daily
- **Retention**: 90 days
- **Storage**: Cloud storage with versioning

#### 2. Application Assets
- **Frequency**: Weekly
- **Retention**: Indefinite
- **Storage**: Version control system

### Configuration Backups

#### 1. Environment Variables
- **Frequency**: On change
- **Retention**: Indefinite
- **Storage**: Encrypted vault or version control

#### 2. Application Configurations
- **Frequency**: Weekly
- **Retention**: Indefinite
- **Storage**: Version control system

## Backup Implementation

### Database Backup Scripts

#### 1. Full Backup Script

Create `scripts/backup-db-full.sh`:

```bash
#!/bin/bash

# Full database backup script

# Configuration
DB_NAME="nycmg"
DB_USER="postgres"
BACKUP_DIR="/backups/database/full"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/nycmg_full_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
echo "Creating full backup of $DB_NAME database..."
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "✅ Full backup completed successfully: $BACKUP_FILE"
  
  # Compress backup
  gzip $BACKUP_FILE
  echo "📦 Backup compressed: $BACKUP_FILE.gz"
  
  # Encrypt backup (if encryption key is available)
  if [ -f "/etc/backup-encryption.key" ]; then
    openssl enc -aes-256-cbc -salt -in $BACKUP_FILE.gz -out $BACKUP_FILE.gz.enc -pass file:/etc/backup-encryption.key
    rm $BACKUP_FILE.gz
    echo "🔒 Backup encrypted: $BACKUP_FILE.gz.enc"
  fi
  
  # Upload to cloud storage (example with AWS S3)
  # aws s3 cp $BACKUP_FILE.gz s3://nycmg-backups/database/full/
  
else
  echo "❌ Full backup failed"
  exit 1
fi
```

#### 2. Incremental Backup Script

Create `scripts/backup-db-incremental.sh`:

```bash
#!/bin/bash

# Incremental database backup script

# Configuration
DB_NAME="nycmg"
DB_USER="postgres"
BACKUP_DIR="/backups/database/incremental"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/nycmg_incremental_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform incremental backup using pg_dump with specific tables or time range
echo "Creating incremental backup of $DB_NAME database..."
pg_dump -U $DB_USER -h localhost --section=data --table=tracks --table=users $DB_NAME > $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "✅ Incremental backup completed successfully: $BACKUP_FILE"
  
  # Compress backup
  gzip $BACKUP_FILE
  echo "📦 Backup compressed: $BACKUP_FILE.gz"
  
  # Encrypt backup (if encryption key is available)
  if [ -f "/etc/backup-encryption.key" ]; then
    openssl enc -aes-256-cbc -salt -in $BACKUP_FILE.gz -out $BACKUP_FILE.gz.enc -pass file:/etc/backup-encryption.key
    rm $BACKUP_FILE.gz
    echo "🔒 Backup encrypted: $BACKUP_FILE.gz.enc"
  fi
  
else
  echo "❌ Incremental backup failed"
  exit 1
fi
```

#### 3. WAL Archiving Configuration

Update PostgreSQL configuration in `postgresql.conf`:

```conf
# Write-ahead log settings
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backups/wal/%f'
```

### File Backup Scripts

#### 1. User Uploads Backup

Create `scripts/backup-files.sh`:

```bash
#!/bin/bash

# File backup script for user uploads

# Configuration
UPLOADS_DIR="/app/uploads"
BACKUP_DIR="/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/uploads_$DATE.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
echo "Creating backup of user uploads..."
tar -czf $BACKUP_FILE -C /app uploads

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "✅ File backup completed successfully: $BACKUP_FILE"
  
  # Upload to cloud storage (example with AWS S3)
  # aws s3 cp $BACKUP_FILE s3://nycmg-backups/files/
  
else
  echo "❌ File backup failed"
  exit 1
fi
```

### Configuration Backup Scripts

#### 1. Environment Variables Backup

Create `scripts/backup-config.sh`:

```bash
#!/bin/bash

# Configuration backup script

# Configuration
CONFIG_DIR="/app/config"
BACKUP_DIR="/backups/config"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/config_$DATE.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
echo "Creating backup of configuration files..."
tar -czf $BACKUP_FILE -C /app config

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "✅ Configuration backup completed successfully: $BACKUP_FILE"
  
  # Encrypt backup (if encryption key is available)
  if [ -f "/etc/backup-encryption.key" ]; then
    openssl enc -aes-256-cbc -salt -in $BACKUP_FILE -out $BACKUP_FILE.enc -pass file:/etc/backup-encryption.key
    rm $BACKUP_FILE
    echo "🔒 Configuration backup encrypted: $BACKUP_FILE.enc"
  fi
  
else
  echo "❌ Configuration backup failed"
  exit 1
fi
```

## Backup Scheduling

### Cron Jobs

Create `scripts/backup-crontab`:

```crontab
# Database full backup - daily at 2:00 AM
0 2 * * * /app/scripts/backup-db-full.sh >> /var/log/backup.log 2>&1

# Database incremental backup - every 4 hours
0 */4 * * * /app/scripts/backup-db-incremental.sh >> /var/log/backup.log 2>&1

# File backup - daily at 3:00 AM
0 3 * * * /app/scripts/backup-files.sh >> /var/log/backup.log 2>&1

# Configuration backup - weekly on Sunday at 4:00 AM
0 4 * * 0 /app/scripts/backup-config.sh >> /var/log/backup.log 2>&1

# Backup validation - daily at 5:00 AM
0 5 * * * /app/scripts/validate-backups.sh >> /var/log/backup.log 2>&1
```

### Docker Compose Backup Service

Update `docker-compose.yml` to include backup services:

```yaml
version: '3.8'

services:
  # Existing services...
  
  # Backup service
  backup:
    image: postgres:13
    volumes:
      - ./backups:/backups
      - ./scripts:/scripts
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=nycmg
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    command: |
      bash -c "
        chmod +x /scripts/backup-db-full.sh
        chmod +x /scripts/backup-db-incremental.sh
        chmod +x /scripts/backup-files.sh
        chmod +x /scripts/backup-config.sh
        crontab /scripts/backup-crontab
        cron -f
      "

volumes:
  postgres_data:
  # Other volumes...
```

## Backup Validation

### Backup Integrity Check Script

Create `scripts/validate-backups.sh`:

```bash
#!/bin/bash

# Backup validation script

echo "🔍 Validating backups..."

# Check database backups
LATEST_DB_BACKUP=$(ls -t /backups/database/full/*.sql.gz 2>/dev/null | head -1)
if [ -f "$LATEST_DB_BACKUP" ]; then
  echo "✅ Latest database backup found: $LATEST_DB_BACKUP"
  
  # Test restore (to a temporary database)
  # createdb -U postgres nycmg_restore_test
  # gunzip -c $LATEST_DB_BACKUP | psql -U postgres -d nycmg_restore_test
  # dropdb -U postgres nycmg_restore_test
  
else
  echo "❌ No database backup found"
fi

# Check file backups
LATEST_FILE_BACKUP=$(ls -t /backups/files/*.tar.gz 2>/dev/null | head -1)
if [ -f "$LATEST_FILE_BACKUP" ]; then
  echo "✅ Latest file backup found: $LATEST_FILE_BACKUP"
  
  # Test extraction
  tar -tzf $LATEST_FILE_BACKUP > /dev/null
  if [ $? -eq 0 ]; then
    echo "✅ File backup integrity verified"
  else
    echo "❌ File backup integrity check failed"
  fi
  
else
  echo "❌ No file backup found"
fi

# Check configuration backups
LATEST_CONFIG_BACKUP=$(ls -t /backups/config/*.tar.gz 2>/dev/null | head -1)
if [ -f "$LATEST_CONFIG_BACKUP" ]; then
  echo "✅ Latest configuration backup found: $LATEST_CONFIG_BACKUP"
else
  echo "❌ No configuration backup found"
fi

echo "📊 Backup validation completed"
```

## Disaster Recovery Procedures

### 1. Database Recovery

#### Full Restore Procedure

```bash
# Stop application services
docker-compose stop backend

# Drop existing database
dropdb -U postgres nycmg

# Create new database
createdb -U postgres nycmg

# Restore from backup
gunzip -c /backups/database/full/nycmg_full_20231015_020000.sql.gz | psql -U postgres -d nycmg

# Start application services
docker-compose start backend
```

#### Point-in-Time Recovery

```bash
# Stop PostgreSQL
pg_ctl stop

# Restore base backup
# (Restore from the latest full backup)

# Restore WAL files
# (Apply WAL files from the archive up to the desired point in time)

# Start PostgreSQL with recovery.conf
pg_ctl start
```

### 2. File Recovery

#### User Uploads Restore

```bash
# Stop application services
docker-compose stop web

# Restore user uploads
tar -xzf /backups/files/uploads_20231015_030000.tar.gz -C /app

# Fix permissions
chown -R app:app /app/uploads

# Start application services
docker-compose start web
```

### 3. Configuration Recovery

#### Environment Variables Restore

```bash
# Restore configuration files
tar -xzf /backups/config/config_20231015_040000.tar.gz -C /app

# Restart services to apply configuration
docker-compose restart
```

## Cloud Backup Integration

### AWS S3 Integration

#### 1. Install AWS CLI

```bash
# In Dockerfile or deployment script
RUN apt-get update && apt-get install -y awscli
```

#### 2. Configure AWS Credentials

```bash
# Set environment variables
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
```

#### 3. Upload Backup Script

```bash
# In backup scripts
aws s3 cp $BACKUP_FILE s3://nycmg-backups/database/full/
```

### Google Cloud Storage Integration

#### 1. Install Google Cloud SDK

```bash
# In Dockerfile or deployment script
RUN curl https://sdk.cloud.google.com | bash
```

#### 2. Configure Authentication

```bash
# Set service account key
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

#### 3. Upload Backup Script

```bash
# In backup scripts
gsutil cp $BACKUP_FILE gs://nycmg-backups/database/full/
```

## Backup Monitoring

### Backup Status Dashboard

Create `scripts/backup-monitor.sh`:

```bash
#!/bin/bash

# Backup monitoring script

echo "📊 Backup Status Report"
echo "======================"

# Database backups
echo "🗄️  Database Backups:"
ls -lt /backups/database/full/ | head -5

# File backups
echo -e "\n📁 File Backups:"
ls -lt /backups/files/ | head -5

# Configuration backups
echo -e "\n⚙️  Configuration Backups:"
ls -lt /backups/config/ | head -5

# Last backup times
echo -e "\n⏱️  Last Backup Times:"
echo "Database: $(stat -c %y /backups/database/full/$(ls -t /backups/database/full/ | head -1) 2>/dev/null || echo 'Never')"
echo "Files: $(stat -c %y /backups/files/$(ls -t /backups/files/ | head -1) 2>/dev/null || echo 'Never')"
echo "Config: $(stat -c %y /backups/config/$(ls -t /backups/config/ | head -1) 2>/dev/null || echo 'Never')"
```

## Security Considerations

### 1. Encryption
- Encrypt backups at rest
- Use secure encryption keys
- Rotate encryption keys regularly

### 2. Access Control
- Restrict access to backup files
- Use IAM roles for cloud storage access
- Audit backup access logs

### 3. Compliance
- Retain backups according to regulatory requirements
- Implement data retention policies
- Document backup procedures

## Testing and Validation

### Regular Testing Schedule
- **Daily**: Backup integrity checks
- **Weekly**: Restore testing in staging environment
- **Monthly**: Full disaster recovery drill

### Test Procedures
1. Simulate database failure
2. Restore from backups
3. Verify data integrity
4. Document results

## Troubleshooting

### Common Issues

1. **Backup Failures**
   - Check disk space
   - Verify database connectivity
   - Review logs for errors

2. **Restore Failures**
   - Verify backup file integrity
   - Check restore environment
   - Review restore procedures

3. **Cloud Upload Failures**
   - Verify credentials
   - Check network connectivity
   - Review cloud service status

### Debugging Tips

1. **Check Backup Logs**
   ```bash
   tail -f /var/log/backup.log
   ```

2. **Verify Disk Space**
   ```bash
   df -h /backups
   ```

3. **Test Database Connection**
   ```bash
   pg_isready -U postgres -d nycmg
   ```

## Best Practices

### 1. Backup Strategy
- Follow the 3-2-1 rule (3 copies, 2 media types, 1 offsite)
- Test backups regularly
- Monitor backup success rates

### 2. Security
- Encrypt sensitive backups
- Secure backup storage
- Audit backup access

### 3. Automation
- Automate backup scheduling
- Implement alerting for failures
- Document procedures

### 4. Documentation
- Maintain up-to-date procedures
- Document recovery steps
- Train team members