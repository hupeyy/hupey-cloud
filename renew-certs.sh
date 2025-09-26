#!/bin/bash
cd /home/hupey/software-projects/hupey-cloud
docker-compose run --rm certbot renew --quiet
docker-compose exec nginx nginx -s reload
echo "Certificates renewed $(date)"
