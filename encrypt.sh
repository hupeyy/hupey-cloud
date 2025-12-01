#!/bin/bash
set -e

cd /home/hupey/hupey-cloud

# Make sure directories exist
mkdir -p certbot/www certbot/conf

# Start Nginx (HTTP only) to serve ACME challenge
echo "[*] Starting Nginx..."
docker-compose up -d nginx

# Wait a few seconds for Nginx to be ready
sleep 5

# Test ACME challenge path
mkdir -p certbot/www/.well-known/acme-challenge
echo "test" > certbot/www/.well-known/acme-challenge/test.txt

if curl -s http://localhost/.well-known/acme-challenge/test.txt | grep -q "test"; then
    echo "[+] ACME challenge path is working"
else
    echo "[!] ACME challenge path failed! Make sure port 80 is free and forwarded."
    exit 1
fi

rm certbot/www/.well-known/acme-challenge/test.txt

# Request Let's Encrypt certificate
echo "[*] Requesting SSL certificate for hupey.cloud..."
docker-compose run --rm certbot certonly \
    --webroot --webroot-path /var/www/certbot \
    --email admin@hupey.cloud --agree-tos --no-eff-email \
    -d hupey.cloud

# Write Nginx SSL configuration
echo "[*] Writing Nginx SSL configuration..."
cat > nginx/conf.d/hupey.cloud.conf << 'CONFIG'
server {
    listen 80;
    server_name hupey.cloud;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name hupey.cloud;

    ssl_certificate /etc/letsencrypt/live/hupey.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hupey.cloud/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
CONFIG

# Restart Nginx
echo "[*] Restarting Nginx with SSL..."
docker-compose restart nginx

echo "[+] SSL setup complete! Access your site at: https://hupey.cloud"
