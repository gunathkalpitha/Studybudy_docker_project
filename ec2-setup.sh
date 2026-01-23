#!/bin/bash
set -e

echo "=== Installing unzip ==="
sudo apt update
sudo apt install -y unzip

echo "=== Installing AWS CLI ==="
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

echo "=== Verifying AWS CLI ==="
aws --version

echo "=== Logging into ECR ==="
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 196530534986.dkr.ecr.us-east-1.amazonaws.com

echo "=== Getting public IP ==="
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "Public IP: $PUBLIC_IP"

echo "=== Creating app directory ==="
mkdir -p ~/app
cd ~/app

echo "=== Creating docker-compose.yml ==="
cat > docker-compose.yml << 'COMPOSE_EOF'
services:
  mongo:
    image: mongo:6
    container_name: mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network

  backend:
    image: 196530534986.dkr.ecr.us-east-1.amazonaws.com/react-doker-backend:latest
    container_name: react_docker_backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/study-app
      - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
      - PORT=5000
    depends_on:
      - mongo
    networks:
      - app-network

  frontend:
    image: 196530534986.dkr.ecr.us-east-1.amazonaws.com/react-doker-frontend:latest
    container_name: react_docker_frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://${PUBLIC_IP}:5000
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
COMPOSE_EOF

echo "=== Pulling images ==="
docker compose pull

echo "=== Starting containers ==="
docker compose up -d

echo "=== Container status ==="
docker compose ps

echo "=== Recent logs ==="
docker compose logs --tail=20

echo ""
echo "==================================="
echo "Setup complete!"
echo "Your app should be accessible at:"
echo "  http://$PUBLIC_IP:5173"
echo "==================================="
