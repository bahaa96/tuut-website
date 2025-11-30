#!/bin/bash

# Contabo Deployment Script for Tuut Website
# This script helps deploy the tuut website on Contabo VPS

set -e

# Configuration
PROJECT_NAME="tuut-website"
DOMAIN="tuut.com"
ADMIN_EMAIL="admin@tuut.com"
SERVER_USER="root"  # Change to your SSH user
SERVER_IP=""  # Set your Contabo server IP

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if server IP is provided
if [ -z "$SERVER_IP" ]; then
    log_error "Please set your Contabo server IP in the script"
    echo "Usage: SERVER_IP=your_server_ip ./deploy.sh"
    exit 1
fi

log_info "Starting deployment to Contabo server: $SERVER_IP"

# Create necessary directories
log_info "Creating project directories on server..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p ~/$PROJECT_NAME/{logs,portainer,letsencrypt}"

# Copy project files to server
log_info "Copying project files to server..."
rsync -avz --exclude='node_modules' \
          --exclude='.git' \
          --exclude='logs' \
          --exclude='letsencrypt' \
          --exclude='portainer' \
          ./ $SERVER_USER@$SERVER_IP:~/$PROJECT_NAME/

# SSH into server and run deployment
log_info "Running deployment on server..."
ssh $SERVER_USER@$SERVER_IP << EOF
    cd ~/$PROJECT_NAME

    # Install Docker if not installed
    if ! command -v docker &> /dev/null; then
        log_info "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl enable docker
        systemctl start docker
        usermod -aG docker $SERVER_USER
    fi

    # Install Docker Compose if not installed
    if ! command -v docker-compose &> /dev/null; then
        log_info "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    # Create necessary directories with proper permissions
    mkdir -p logs/{app,traefik}
    chmod 755 logs

    # Update environment variables
    echo "VITE_APP_URL=https://$DOMAIN" > .env
    echo "NODE_ENV=production" >> .env

    # Build and start services
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d

    # Wait for services to start
    sleep 30

    # Check service status
    docker-compose -f docker-compose.prod.yml ps

    # Show logs for troubleshooting
    echo ""
    log_info "Container logs (last 20 lines):"
    docker-compose -f docker-compose.prod.yml logs --tail=20
EOF

log_info "Deployment completed!"
log_info "Your website should be available at: https://$DOMAIN"
log_info "Traefik dashboard: https://traefik.$DOMAIN (admin/your_password)"
log_info "Portainer dashboard: https://portainer.$DOMAIN"

log_warn "Don't forget to:"
log_warn "1. Set up DNS records to point your domain to $SERVER_IP"
log_warn "2. Configure firewall to allow ports 80, 443"
log_warn "3. Update the admin password in docker-compose.prod.yml"
log_warn "4. Set up SSL certificate (automatic with Let's Encrypt)"

echo ""
log_info "Useful commands for server management:"
echo "SSH into server: ssh $SERVER_USER@$SERVER_IP"
echo "Check status: ssh $SERVER_USER@$SERVER_IP 'cd ~/$PROJECT_NAME && docker-compose -f docker-compose.prod.yml ps'"
echo "View logs: ssh $SERVER_USER@$SERVER_IP 'cd ~/$PROJECT_NAME && docker-compose -f docker-compose.prod.yml logs -f'"
echo "Update app: ssh $SERVER_USER@$SERVER_IP 'cd ~/$PROJECT_NAME && docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d'"