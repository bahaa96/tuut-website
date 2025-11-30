# Contabo VPS Setup Guide for Tuut Website

This guide will help you deploy the tuut website on a Contabo VPS using Docker.

## Prerequisites

- Contabo VPS (Ubuntu 22.04+ recommended)
- Domain name (e.g., tuut.com)
- SSH access to your Contabo server

## Step 1: Initial Server Setup

### Connect to your Contabo server
```bash
ssh root@your_server_ip
```

### Update system
```bash
apt update && apt upgrade -y
```

### Install required packages
```bash
apt install -y curl wget git htop ufw
```

### Configure firewall
```bash
# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

### Create non-root user (recommended)
```bash
adduser tuut
usermod -aG sudo tuut
usermod -aG docker tuut  # After Docker installation
```

## Step 2: DNS Configuration

### Set up DNS records for your domain:

| Type | Name | Value |
|------|------|-------|
| A | @ | your_server_ip |
| A | www | your_server_ip |
| A | traefik | your_server_ip |
| A | portainer | your_server_ip |

## Step 3: Deploy the Application

### Option 1: Using the automated deployment script
```bash
# Clone your repository
git clone https://github.com/your-repo/tuut-website.git
cd tuut-website

# Set your server IP and run deployment
export SERVER_IP="your_server_ip"
./deploy.sh
```

### Option 2: Manual deployment
```bash
# Create project directory
mkdir -p /home/tuut/tuut-website
cd /home/tuut/tuut-website

# Clone your repository
git clone https://github.com/your-repo/tuut-website.git .

# Create necessary directories
mkdir -p logs/{app,traefik} letsencrypt portainer

# Create environment file
echo "VITE_APP_URL=https://tuut.com" > .env
echo "NODE_ENV=production" >> .env

# Build and start services
docker-compose -f docker-compose.prod.yml up -d
```

## Step 4: SSL Certificate Setup

The setup uses Let's Encrypt for automatic SSL certificates. Certificates will be automatically generated when you first access your site.

### Verify SSL setup
```bash
# Check certificate status
docker exec tuut-traefik ls -la /letsencrypt/

# Check Traefik logs for certificate issues
docker logs tuut-traefik
```

## Step 5: Verify Deployment

### Check service status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Test health endpoint
```bash
curl http://localhost:3000/api/health
```

### Check sitemap
```bash
curl http://localhost:3000/sitemap.xml
```

## Step 6: Access Your Services

- **Main website**: https://tuut.com
- **Traefik dashboard**: https://traefik.tuut.com
- **Portainer**: https://portainer.tuut.com
- **Sitemap**: https://tuut.com/sitemap.xml

## Step 7: Monitoring and Maintenance

### View logs
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f tuut-app
docker-compose -f docker-compose.prod.yml logs -f traefik
```

### Update the application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Backup important data
```bash
# Backup SSL certificates
tar -czf letsencrypt-backup-$(date +%Y%m%d).tar.gz letsencrypt/

# Backup Portainer data
tar -czf portainer-backup-$(date +%Y%m%d).tar.gz portainer/
```

## Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   # Check logs
   docker-compose -f docker-compose.prod.yml logs tuut-app

   # Check resources
   docker stats
   ```

2. **SSL Certificate Issues**
   ```bash
   # Reset certificates
   rm -rf letsencrypt/acme.json
   docker-compose -f docker-compose.prod.yml restart traefik
   ```

3. **Performance Issues**
   ```bash
   # Check system resources
   htop
   df -h
   free -h
   ```

4. **DNS Issues**
   ```bash
   # Verify DNS resolution
   dig tuut.com
   nslookup tuut.com
   ```

### Performance Optimization

1. **Enable swap if needed**
   ```bash
   fallocate -l 2G /swapfile
   chmod 600 /swapfile
   mkswap /swapfile
   swapon /swapfile
   echo '/swapfile none swap sw 0 0' >> /etc/fstab
   ```

2. **Optimize Docker**
   ```bash
   # Clean up unused images
   docker system prune -a
   ```

## Security Recommendations

1. **Update the Traefik admin password** in `docker-compose.prod.yml`
2. **Enable automatic security updates**
   ```bash
   apt install unattended-upgrades
   dpkg-reconfigure -plow unattended-upgrades
   ```
3. **Set up fail2ban for SSH protection**
   ```bash
   apt install fail2ban
   systemctl enable fail2ban
   ```
4. **Regular backups** - Set up automated backups of your data

## Monitoring

Consider setting up monitoring with:

1. **Uptime monitoring** (UptimeRobot, Pingdom)
2. **Server monitoring** (Netdata, Prometheus/Grafana)
3. **Log aggregation** (ELK stack, Graylog)

## Support

- **Contabo documentation**: https://contabo.com/docs/
- **Docker documentation**: https://docs.docker.com/
- **Traefik documentation**: https://doc.traefik.io/traefik/

## Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure automated backups
3. Set up CI/CD pipeline for updates
4. Consider CDN for additional performance
5. Set up analytics and error tracking