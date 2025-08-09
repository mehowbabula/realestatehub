# VPS Deployment Guide for Real Estate Platform

This guide will help you deploy the Real Estate Platform to a VPS (Virtual Private Server).

## Prerequisites

### VPS Requirements
- **OS**: Ubuntu 20.04 LTS or newer
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB SSD
- **CPU**: 2 cores minimum
- **Network**: Public IP address

### Domain Setup
1. Point your domain to your VPS IP address
2. Set up DNS A record: `yourdomain.com -> YOUR_VPS_IP`
3. Optional: Set up www subdomain: `www.yourdomain.com -> YOUR_VPS_IP`

## Step 1: Server Preparation

### 1.1 Connect to your VPS
```bash
ssh root@YOUR_VPS_IP
```

### 1.2 Update the system
```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker and Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start Docker service
systemctl start docker
systemctl enable docker
```

### 1.4 Install Git
```bash
apt install git -y
```

### 1.5 Create a deploy user (recommended)
```bash
adduser deploy
usermod -aG docker deploy
su - deploy
```

## Step 2: Deploy the Application

### 2.1 Clone the repository
```bash
git clone https://github.com/yourusername/realestate-platform.git
cd realestate-platform
```

### 2.2 Set up environment variables
```bash
# Copy the production environment template
cp .env.production .env

# Edit the environment file with your settings
nano .env
```

**Important environment variables to update:**
```bash
# Database
DATABASE_URL="postgresql://postgres:YOUR_STRONG_PASSWORD@postgres:5432/realestate"
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-characters-long

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Redis
REDIS_PASSWORD=your-strong-redis-password
```

### 2.3 Set up SSL certificates

#### Option A: Let's Encrypt (Recommended)
```bash
# Install Certbot
apt install certbot -y

# Generate certificates (replace yourdomain.com)
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Create SSL directory
mkdir -p nginx/ssl

# Copy certificates
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

#### Option B: Self-signed (Development only)
```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

### 2.4 Deploy the application
```bash
chmod +x scripts/deployment/deploy.sh
./scripts/deployment/deploy.sh production
```

## Step 3: Post-Deployment Setup

### 3.1 Verify deployment
```bash
# Check if all containers are running
docker-compose ps

# Check application logs
docker-compose logs -f app

# Test the application
curl -k https://localhost:5544/api/health
```

### 3.2 Set up automatic SSL renewal (Let's Encrypt)
```bash
# Add to crontab
crontab -e

# Add this line to renew certificates monthly
0 2 1 * * certbot renew --quiet && docker-compose restart nginx
```

### 3.3 Set up firewall (recommended)
```bash
# Install UFW
apt install ufw -y

# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow 80
ufw allow 443

# Enable firewall
ufw enable
```

## Step 4: Monitoring and Maintenance

### 4.1 View logs
```bash
# Application logs
docker-compose logs -f app

# Nginx logs
docker-compose logs -f nginx

# Database logs
docker-compose logs -f postgres
```

### 4.2 Backup database
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres realestate > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose exec -T postgres psql -U postgres realestate < backup_file.sql
```

### 4.3 Update application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up --build -d

# Run migrations if needed
docker-compose exec app npx prisma migrate deploy
```

## Step 5: Security Hardening

### 5.1 Change default passwords
- PostgreSQL password
- Redis password
- NextAuth secret

### 5.2 Set up fail2ban (optional)
```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

### 5.3 Regular updates
```bash
# Create update script
cat > update.sh << 'EOF'
#!/bin/bash
apt update && apt upgrade -y
docker system prune -f
EOF

chmod +x update.sh

# Add to crontab for weekly updates
0 3 * * 0 /home/deploy/update.sh
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 80/443
   netstat -tulpn | grep :80
   netstat -tulpn | grep :443
   
   # Stop conflicting services
   systemctl stop apache2  # or nginx
   ```

2. **Permission denied**
   ```bash
   # Fix Docker permissions
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Database connection failed**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Verify database is running
   docker-compose ps
   ```

4. **SSL certificate issues**
   ```bash
   # Check certificate validity
   openssl x509 -in nginx/ssl/cert.pem -text -noout
   
   # Regenerate if needed
   certbot renew --force-renewal
   ```

## Support

For issues and support:
1. Check the application logs first
2. Verify all environment variables are set correctly
3. Ensure all Docker containers are running
4. Check the GitHub repository for updates and issues

## Security Notes

⚠️ **Important Security Reminders:**
- Always use strong, unique passwords
- Keep your system and Docker images updated
- Monitor logs for suspicious activity
- Set up proper backups
- Use HTTPS in production
- Consider setting up monitoring (Prometheus/Grafana)
