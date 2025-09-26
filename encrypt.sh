#!/bin/bash

# Create necessary directories
mkdir -p certbot/www certbot/conf

# Start nginx with HTTP configuration
docker-compose up -d nginx

# Wait for nginx to be ready
sleep 10

# Create a test challenge file to verify nginx is serving challenges
mkdir -p certbot/www/.well-known/acme-challenge
echo "test" > certbot/www/.well-known/acme-challenge/test.txt

# Test that the challenge is accessible (from your server)
curl http://localhost:8008/.well-known/acme-challenge/test.txt

# Get SSL certificates
docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot \
    --email admin@hupey.cloud --agree-tos --no-eff-email \
    -d hupey.cloud -d www.hupey.cloud

# Now create the final SSL nginx config
cat > nginx/conf.d/hupey.cloud.conf << 'CONFIG'
server {
    listen 80;
    server_name hupey.cloud www.hupey.cloud;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name hupey.cloud www.hupey.cloud;
    http2 on;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/hupey.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hupey.cloud/privkey.pem;
    
    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Frontend proxy
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
CONFIG

# Restart nginx with SSL configuration
docker-compose restart nginx

echo "SSL setup complete!"
echo "HTTP redirect: http://hupey.cloud:8008 -> https://hupey.cloud"
echo "HTTPS: https://hupey.cloud"
