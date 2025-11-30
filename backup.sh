#!/bin/bash

# Backup script for Tuut Website on Contabo
# This script creates backups of important data

set -e

# Configuration
BACKUP_DIR="/home/tuut/backups"
PROJECT_DIR="/home/tuut/tuut-website"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
mkdir -p $BACKUP_DIR

log_info "Starting backup process..."

# Backup SSL certificates
log_info "Backing up SSL certificates..."
if [ -d "$PROJECT_DIR/letsencrypt" ]; then
    tar -czf "$BACKUP_DIR/letsencrypt-$DATE.tar.gz" -C "$PROJECT_DIR" letsencrypt/
    log_info "SSL certificates backed up"
else
    log_warn "SSL certificates directory not found"
fi

# Backup Portainer data
log_info "Backing up Portainer data..."
if [ -d "$PROJECT_DIR/portainer" ]; then
    tar -czf "$BACKUP_DIR/portainer-$DATE.tar.gz" -C "$PROJECT_DIR" portainer/
    log_info "Portainer data backed up"
else
    log_warn "Portainer data directory not found"
fi

# Backup application logs
log_info "Backing up application logs..."
if [ -d "$PROJECT_DIR/logs" ]; then
    tar -czf "$BACKUP_DIR/logs-$DATE.tar.gz" -C "$PROJECT_DIR" logs/
    log_info "Application logs backed up"
else
    log_warn "Logs directory not found"
fi

# Backup Docker volumes
log_info "Backing up Docker volumes..."
docker run --rm -v tuut-website_letsencrypt:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/letsencrypt-volume-$DATE.tar.gz -C /data .
docker run --rm -v tuut-website_portainer:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/portainer-volume-$DATE.tar.gz -C /data .

# Backup Docker compose configuration
log_info "Backing up Docker configuration..."
cp "$PROJECT_DIR/docker-compose.prod.yml" "$BACKUP_DIR/docker-compose-$DATE.yml"
cp "$PROJECT_DIR/.env" "$BACKUP_DIR/env-$DATE" 2>/dev/null || log_warn ".env file not found"

# Clean old backups
log_info "Cleaning up old backups (keeping last $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.yml" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "env-*" -mtime +$RETENTION_DAYS -delete

# Create backup manifest
log_info "Creating backup manifest..."
cat > "$BACKUP_DIR/backup-$DATE.txt" << EOF
Backup created: $(date)
Backup contents:
- SSL certificates: letsencrypt-$DATE.tar.gz
- Portainer data: portainer-$DATE.tar.gz
- Application logs: logs-$DATE.tar.gz
- Docker volumes: letsencrypt-volume-$DATE.tar.gz, portainer-volume-$DATE.tar.gz
- Configuration: docker-compose-$DATE.yml, env-$DATE
EOF

log_info "Backup completed successfully!"
log_info "Backup location: $BACKUP_DIR"
log_info "Manifest: $BACKUP_DIR/backup-$DATE.txt"

# Show backup size
BACKUP_SIZE=$(du -sh $BACKUP_DIR/*$DATE* | awk '{sum+=$1} END {print sum}')
log_info "Total backup size: $BACKUP_SIZE"

# Optional: Upload to cloud storage (uncomment and configure)
# log_info "Uploading backup to cloud storage..."
# aws s3 sync $BACKUP_DIR s3://your-backup-bucket/tuut-website/ --delete