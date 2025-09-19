#!/bin/bash
set -e

# Create directories for certbot with proper permissions
mkdir -p ./certbot/www ./certbot/conf
chmod -R 755 ./certbot

# Create dummy certificates for initial startup
if [ ! -f "./certbot/conf/live/hupey.cloud/fullchain.pem" ]; then
  mkdir -p ./certbot/conf/live/hupey.cloud
  openssl req -x509 -nodes -newkey rsa:4096 -days 1 \
    -keyout ./certbot/conf/live/hupey.cloud/privkey.pem \
    -out ./certbot/conf/live/hupey.cloud/fullchain.pem \
    -subj '/CN=localhost'

  # Ensure proper permissions for the certificates
  chmod 755 ./certbot/conf/live
  chmod 755 ./certbot/conf/live/hupey.cloud
  chmod 644 ./certbot/conf/live/hupey.cloud/fullchain.pem
  chmod 600 ./certbot/conf/live/hupey.cloud/privkey.pem
fi

# Start nginx
docker compose up -d nginx

# Get the real certificates (DNS challenge)
echo "You will now need to create a DNS TXT record as instructed"
source .env
docker compose run --rm certbot certonly \
  --manual \
  --preferred-challenges dns \
  --force-renewal \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d hupey.cloud

# Check if certificates were obtained successfully
if [ -f "./certbot/conf/live/hupey.cloud/fullchain.pem" ] && [ -f "./certbot/conf/live/hupey.cloud/privkey.pem" ]; then
  # Reload nginx
  docker compose exec nginx nginx -s reload || docker compose up -d --force-recreate nginx
  echo "Certificate obtained successfully! Nginx has been reloaded."
else
  echo "Failed to obtain certificates. Check the error messages above."
fi
