#!/bin/bash

# Monitoring setup script for Tuut Website on Contabo
# This script installs basic monitoring tools

set -e

# Configuration
PROJECT_NAME="tuut-website"
LOG_FILE="/var/log/tuut-monitoring.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a $LOG_FILE
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a $LOG_FILE
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
}

log_info "Starting monitoring setup..."

# Update system packages
log_info "Updating system packages..."
apt update && apt upgrade -y

# Install basic monitoring tools
log_info "Installing monitoring tools..."
apt install -y htop iotop nethogs ncdu tree

# Install logrotate for application logs
log_info "Setting up log rotation..."
cat > /etc/logrotate.d/tuut-website << EOF
/home/tuut/tuut-website/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 tuut tuut
    postrotate
        docker-compose -f /home/tuut/tuut-website/docker-compose.prod.yml restart tuut-app
    endscript
}
EOF

# Create monitoring script
log_info "Creating monitoring script..."
cat > /usr/local/bin/tuut-monitor << 'EOF'
#!/bin/bash

# Tuut Website Monitoring Script
# This script checks the health of the tuut website

PROJECT_DIR="/home/tuut/tuut-website"
LOG_FILE="/var/log/tuut-monitoring.log"
ALERT_EMAIL="admin@tuut.com"  # Configure your email

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
}

# Function to send alert (you can integrate with your preferred alert system)
send_alert() {
    local message="$1"
    log_message "ALERT: $message"

    # Example: Send email (configure mail system first)
    # echo "$message" | mail -s "Tuut Website Alert" $ALERT_EMAIL

    # Example: Send to Slack webhook (configure webhook URL)
    # curl -X POST -H 'Content-type: application/json' \
    #     --data "{\"text\":\"$message\"}" \
    #     YOUR_SLACK_WEBHOOK_URL
}

# Check if containers are running
check_containers() {
    cd $PROJECT_DIR

    # Check if main container is running
    if ! docker ps | grep -q tuut-website; then
        send_alert "Main container is not running!"
        return 1
    fi

    # Check if traefik is running
    if ! docker ps | grep -q tuut-traefik; then
        send_alert "Traefik container is not running!"
        return 1
    fi

    log_message "All containers are running"
    return 0
}

# Check website health
check_health() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)

    if [ "$response" != "200" ]; then
        send_alert "Health check failed with HTTP status: $response"
        return 1
    fi

    log_message "Health check passed"
    return 0
}

# Check SSL certificate
check_ssl() {
    if [ -f "$PROJECT_DIR/letsencrypt/acme.json" ]; then
        local cert_expiry=$(openssl x509 -in <(docker exec tuut-traefik cat /letsencrypt/acme.json | jq -r '.certificates[0].certificate' | base64 -d) -noout -enddate 2>/dev/null | cut -d= -f2 || echo "")

        if [ ! -z "$cert_expiry" ]; then
            local expiry_epoch=$(date -d "$cert_expiry" +%s)
            local current_epoch=$(date +%s)
            local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))

            if [ $days_until_expiry -lt 7 ]; then
                send_alert "SSL certificate expires in $days_until_expiry days!"
                return 1
            fi

            log_message "SSL certificate is valid for $days_until_expiry more days"
        fi
    fi

    return 0
}

# Check disk space
check_disk_space() {
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ $disk_usage -gt 85 ]; then
        send_alert "Disk usage is ${disk_usage}%!"
        return 1
    fi

    log_message "Disk usage is ${disk_usage}%"
    return 0
}

# Check memory usage
check_memory() {
    local memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')

    if [ $memory_usage -gt 90 ]; then
        send_alert "Memory usage is ${memory_usage}%!"
        return 1
    fi

    log_message "Memory usage is ${memory_usage}%"
    return 0
}

# Run all checks
main() {
    log_message "Running monitoring checks..."

    local failed_checks=0

    check_containers || ((failed_checks++))
    check_health || ((failed_checks++))
    check_ssl || ((failed_checks++))
    check_disk_space || ((failed_checks++))
    check_memory || ((failed_checks++))

    if [ $failed_checks -eq 0 ]; then
        log_message "All monitoring checks passed"
    else
        log_message "$failed_checks monitoring checks failed"
    fi
}

main
EOF

chmod +x /usr/local/bin/tuut-monitor

# Set up cron job for monitoring
log_info "Setting up monitoring cron job..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/tuut-monitor") | crontab -

# Set up cron job for backup
log_info "Setting up backup cron job..."
(crontab -l 2>/dev/null; echo "0 2 * * * /home/tuut/tuut-website/backup.sh") | crontab -

# Set up cron job for docker cleanup
log_info "Setting up Docker cleanup cron job..."
(crontab -l 2>/dev/null; echo "0 3 * * 0 /usr/bin/docker system prune -f") | crontab -

# Create system status dashboard
log_info "Creating status dashboard..."
cat > /usr/local/bin/tuut-status << 'EOF'
#!/bin/bash

echo "=== Tuut Website Status ==="
echo "Time: $(date)"
echo ""

echo "=== Container Status ==="
docker-compose -f /home/tuut/tuut-website/docker-compose.prod.yml ps
echo ""

echo "=== System Resources ==="
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h
echo ""

echo "=== Recent Logs (last 10 lines) ==="
tail -10 /var/log/tuut-monitoring.log
echo ""

echo "=== Docker Stats ==="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
EOF

chmod +x /usr/local/bin/tuut-status

# Install netdata for advanced monitoring (optional)
read -p "Do you want to install Netdata for advanced monitoring? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Installing Netdata..."
    bash <(curl -Ss https://my-netdata.io/kickstart.sh) --dont-wait

    # Configure Netdata to bind to all interfaces
    sed -i 's/bind to = localhost/# bind to = localhost/' /etc/netdata/netdata.conf
    sed -i 's/# bind to = 0.0.0.0/bind to = 0.0.0.0/' /etc/netdata/netdata.conf

    systemctl restart netdata

    log_info "Netdata installed and will be available at http://your_server_ip:19999"
fi

log_info "Monitoring setup completed!"
echo ""
echo "Monitoring commands:"
echo "  tuut-monitor      - Run monitoring checks manually"
echo "  tuut-status       - Show system status"
echo "  htop              - Interactive process viewer"
echo "  docker stats      - Real-time container stats"
echo ""
echo "Cron jobs configured:"
echo "  Every 5 minutes:  Health monitoring"
echo "  Daily at 2 AM:    Backup"
echo "  Weekly at 3 AM:   Docker cleanup"
echo ""
echo "Log file: $LOG_FILE"