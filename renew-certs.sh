#!/bin/bash
set -e
cd /home/hupi/hupey-cloud
echo "[*] Attempting certificate renewal... $(date)"
docker compose run --rm certbot renew --quiet --webroot --webroot-path /var/www/certbot
docker compose exec nginx nginx -s reload
echo "[+] Renewal check done $(date)"
