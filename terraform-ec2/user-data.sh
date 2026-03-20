#!/bin/bash
set -e

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install AWS CLI
sudo apt-get install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf aws awscliv2.zip

# Install Docker
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Create app directory
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

# Get public IP dynamically
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Create docker-compose.yml
cat > docker-compose.yml <<EOF
version: '3.8'

services:
  mongo:
    image: mongo:6
    container_name: mongo
    restart: unless-stopped
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network

  backend:
    image: gbgk/studybudy-backend:latest
    container_name: backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${mongodb_uri}
      - JWT_SECRET=${jwt_secret}
      - PORT=5000
      - NODE_ENV=production
    depends_on:
      - mongo
    restart: unless-stopped
    networks:
      - app-network

  frontend:
    image: gbgk/studybudy-frontend:latest
    container_name: frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://\$PUBLIC_IP:5000
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
EOF

# Pull images from DockerHub and start services
docker compose up -d

# Set ownership
sudo chown -R ubuntu:ubuntu /home/ubuntu/app

echo "Deployment complete!"
