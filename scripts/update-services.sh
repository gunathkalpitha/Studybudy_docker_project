#!/bin/bash

# Script to update ECS services with new Docker images
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Updating ECS Services${NC}"

# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-us-east-1}

cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

# Get ECR URLs from Terraform
cd terraform
BACKEND_ECR_URL=$(terraform output -raw ecr_backend_repository_url)
FRONTEND_ECR_URL=$(terraform output -raw ecr_frontend_repository_url)
CLUSTER_NAME=$(terraform output -raw ecs_cluster_name)
BACKEND_SERVICE=$(terraform output -raw backend_service_name)
FRONTEND_SERVICE=$(terraform output -raw frontend_service_name)

# Login to ECR
echo -e "${YELLOW}Logging in to ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build and push backend
echo -e "${YELLOW}Building and pushing backend...${NC}"
cd ${PROJECT_ROOT}/backend
docker build -t ${BACKEND_ECR_URL}:latest .
docker push ${BACKEND_ECR_URL}:latest

# Build and push frontend
echo -e "${YELLOW}Building and pushing frontend...${NC}"
cd ${PROJECT_ROOT}/frontend
docker build -t ${FRONTEND_ECR_URL}:latest .
docker push ${FRONTEND_ECR_URL}:latest

# Force new deployment
echo -e "${YELLOW}Forcing ECS service updates...${NC}"
aws ecs update-service --cluster ${CLUSTER_NAME} --service ${BACKEND_SERVICE} --force-new-deployment --region ${AWS_REGION} > /dev/null
aws ecs update-service --cluster ${CLUSTER_NAME} --service ${FRONTEND_SERVICE} --force-new-deployment --region ${AWS_REGION} > /dev/null

echo -e "${GREEN}✓ Services updated successfully${NC}"
echo -e "${YELLOW}New tasks will be deployed shortly. Monitor in AWS Console.${NC}"
