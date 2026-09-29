#!/bin/bash
# ==============================================================================
# EC2 Setup Script for Ubuntu 22.04 / 24.04 LTS
# Run this on your fresh EC2 instance after SSH connection:
#   chmod +x ec2-setup.sh && ./ec2-setup.sh
# ==============================================================================

set -e

echo "==> 1. Updating packages and installing Node.js 20 & Nginx..."
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

echo "==> 2. Installing PM2 globally..."
sudo npm install -g pm2

echo "==> 3. Verifying installations..."
node -v
npm -v
pm2 -v
nginx -v

echo "=================================================================="
echo "Setup Complete!"
echo "Next steps on your EC2:"
echo " 1. Clone your repo: git clone <YOUR_REPO_URL>"
echo " 2. cd messagingApp && npm install"
echo " 3. Create .env with DATABASE_URL='<neon-connection-string>'"
echo " 4. Run 'npx prisma generate' and 'npx prisma db push'"
echo " 5. Start with PM2: pm2 start ecosystem.config.js --env production"
echo " 6. Setup PM2 startup: pm2 startup && pm2 save"
echo " 7. Copy deployment/nginx.conf to /etc/nginx/sites-available/default"
echo " 8. Restart Nginx: sudo systemctl restart nginx"
echo "=================================================================="
