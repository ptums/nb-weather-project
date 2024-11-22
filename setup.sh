#!/bin/bash

# Update the system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce -y

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone your project repository
git clone https://github.com/ptums/nb-weather-project/tree/main
cd your-repo

# Build and run the Docker containers
sudo docker-compose up -d

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate (replace yourdomain.com with your actual domain)
sudo certbot --nginx -d newbrunswicknjhistoricalweather.com

# Restart Nginx to apply SSL changes
sudo docker-compose restart nginx
