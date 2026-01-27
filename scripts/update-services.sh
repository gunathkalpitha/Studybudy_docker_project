#!/bin/bash

# Script to update EC2 application with new Docker images
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Updating EC2 Application${NC}"

# Check if EC2_IP is provided
if [ -z "$EC2_IP" ]; then
    echo -e "${RED}Error: EC2_IP environment variable not set${NC}"
    echo -e "${YELLOW}Usage: EC2_IP=your-ec2-ip ./scripts/update-services.sh${NC}"
    exit 1
fi

# Check if SSH key path is provided
if [ -z "$SSH_KEY" ]; then
    SSH_KEY="~/.ssh/react-doker-key-new.pem"
    echo -e "${YELLOW}Using default SSH key: ${SSH_KEY}${NC}"
fi

cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

# Generate unique tag
TIMESTAMP=$(date +%s)
GIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "manual")
IMAGE_TAG="${TIMESTAMP}-${GIT_HASH}"

# Build images locally
echo -e "${YELLOW}Building backend image...${NC}"
cd ${PROJECT_ROOT}/backend
docker build -t gbgk/studybudy-backend:${IMAGE_TAG} .
docker tag gbgk/studybudy-backend:${IMAGE_TAG} gbgk/studybudy-backend:latest

echo -e "${YELLOW}Building frontend image...${NC}"
cd ${PROJECT_ROOT}/frontend
docker build -t gbgk/studybudy-frontend:${IMAGE_TAG} .
docker tag gbgk/studybudy-frontend:${IMAGE_TAG} gbgk/studybudy-frontend:latest

# Push to DockerHub
echo -e "${YELLOW}Pushing images to DockerHub...${NC}"
docker push gbgk/studybudy-backend:${IMAGE_TAG}
docker push gbgk/studybudy-backend:latest
docker push gbgk/studybudy-frontend:${IMAGE_TAG}
docker push gbgk/studybudy-frontend:latest

echo -e "${GREEN}✓ Images pushed to DockerHub${NC}"
echo -e "${YELLOW}📦 Backend: gbgk/studybudy-backend:${IMAGE_TAG}${NC}"
echo -e "${YELLOW}📦 Frontend: gbgk/studybudy-frontend:${IMAGE_TAG}${NC}"

# Deploy to EC2
echo -e "${YELLOW}Deploying to EC2...${NC}"
ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ubuntu@${EC2_IP} << 'ENDSSH'
    cd ~/app
    
    # Stop containers and remove old images
    docker compose down
    docker rmi -f gbgk/studybudy-backend:latest gbgk/studybudy-frontend:latest || true
    
    # Pull latest images
    docker compose pull
    
    # Start containers
    docker compose up -d
    
    # Clean up
    docker image prune -f
    
    # Show status
    docker compose ps
    docker images | grep studybudy
ENDSSH

echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "${YELLOW}Application updated on EC2: ${EC2_IP}${NC}"
