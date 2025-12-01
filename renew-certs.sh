#!/bin/bash
set -e
cd /home/hupey/hupey-cloud

echo "[*] Attempting certificate renewal..."
docker-compose run --rm certbot renew --quiet --webroot --webroot-path /var/www/certbot

echo "[*] Reloading Nginx to apply renewed certificates..."
docker-compose exec nginx nginx -s reload

echo "[+] Certificates renewed $(date)"
