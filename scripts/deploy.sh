#!/bin/bash

# Deploy script for AWS infrastructure with Terraform
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}AWS Deployment Script${NC}"
echo -e "${GREEN}================================${NC}"

# Check if AWS CLI is configured
echo -e "\n${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured. Run 'aws configure'${NC}"
    exit 1
fi
echo -e "${GREEN}✓ AWS credentials configured${NC}"

# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-us-east-1}

echo -e "\n${YELLOW}AWS Account ID: ${AWS_ACCOUNT_ID}${NC}"
echo -e "${YELLOW}AWS Region: ${AWS_REGION}${NC}"

# Navigate to project root
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

# Check if terraform directory exists
if [ ! -d "terraform" ]; then
    echo -e "${RED}Error: terraform directory not found${NC}"
    exit 1
fi

# Step 1: Build and push Docker images to ECR
echo -e "\n${YELLOW}Step 1: Building and pushing Docker images to ECR...${NC}"

# Initialize Terraform to get ECR repository URLs
cd terraform
terraform init -upgrade

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    echo -e "${RED}Error: terraform.tfvars not found${NC}"
    echo -e "${YELLOW}Please copy terraform.tfvars.example to terraform.tfvars and update the values${NC}"
    exit 1
fi

# Create ECR repositories first
echo -e "${YELLOW}Creating ECR repositories...${NC}"
terraform apply -target=aws_ecr_repository.backend -target=aws_ecr_repository.frontend -auto-approve

# Get ECR repository URLs
BACKEND_ECR_URL=$(terraform output -raw ecr_backend_repository_url 2>/dev/null || echo "")
FRONTEND_ECR_URL=$(terraform output -raw ecr_frontend_repository_url 2>/dev/null || echo "")

if [ -z "$BACKEND_ECR_URL" ] || [ -z "$FRONTEND_ECR_URL" ]; then
    # If outputs don't exist yet, construct URLs manually
    PROJECT_NAME=$(grep -E '^project_name' terraform.tfvars | cut -d'"' -f2)
    BACKEND_ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-backend"
    FRONTEND_ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-frontend"
fi

echo -e "${GREEN}Backend ECR: ${BACKEND_ECR_URL}${NC}"
echo -e "${GREEN}Frontend ECR: ${FRONTEND_ECR_URL}${NC}"

# Login to ECR
echo -e "${YELLOW}Logging in to ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build and push backend
echo -e "${YELLOW}Building backend image...${NC}"
cd ${PROJECT_ROOT}/backend
docker build -t ${BACKEND_ECR_URL}:latest .
echo -e "${YELLOW}Pushing backend image...${NC}"
docker push ${BACKEND_ECR_URL}:latest
echo -e "${GREEN}✓ Backend image pushed${NC}"

# Build and push frontend
echo -e "${YELLOW}Building frontend image...${NC}"
cd ${PROJECT_ROOT}/frontend
docker build -t ${FRONTEND_ECR_URL}:latest .
echo -e "${YELLOW}Pushing frontend image...${NC}"
docker push ${FRONTEND_ECR_URL}:latest
echo -e "${GREEN}✓ Frontend image pushed${NC}"

# Step 2: Deploy infrastructure with Terraform
echo -e "\n${YELLOW}Step 2: Deploying infrastructure with Terraform...${NC}"
cd ${PROJECT_ROOT}/terraform

terraform plan
read -p "Do you want to apply these changes? (yes/no): " -r
if [[ $REPLY =~ ^[Yy]es$ ]]; then
    terraform apply -auto-approve
    echo -e "${GREEN}✓ Infrastructure deployed successfully${NC}"
else
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 0
fi

# Step 3: Display outputs
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"

ALB_URL=$(terraform output -raw alb_url 2>/dev/null || echo "Not available yet")
BACKEND_API=$(terraform output -raw backend_api_url 2>/dev/null || echo "Not available yet")

echo -e "\n${YELLOW}Application URLs:${NC}"
echo -e "Frontend: ${GREEN}${ALB_URL}${NC}"
echo -e "Backend API: ${GREEN}${BACKEND_API}${NC}"

echo -e "\n${YELLOW}Note: It may take a few minutes for the services to become healthy.${NC}"
echo -e "${YELLOW}Check ECS service status in AWS Console.${NC}"

echo -e "\n${YELLOW}To update services with new images, run:${NC}"
echo -e "  ${GREEN}./scripts/update-services.sh${NC}"
