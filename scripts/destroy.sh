#!/bin/bash

# Script to destroy AWS infrastructure
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}================================${NC}"
echo -e "${RED}AWS Infrastructure Destruction${NC}"
echo -e "${RED}================================${NC}"

cd "$(dirname "$0")/../terraform"

echo -e "${YELLOW}This will destroy all AWS resources created by Terraform.${NC}"
echo -e "${RED}WARNING: This action cannot be undone!${NC}"
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r

if [[ $REPLY != "yes" ]]; then
    echo -e "${YELLOW}Destruction cancelled${NC}"
    exit 0
fi

# Empty ECR repositories before destroying
echo -e "${YELLOW}Emptying ECR repositories...${NC}"
AWS_REGION=${AWS_REGION:-us-east-1}

BACKEND_REPO=$(terraform output -raw ecr_backend_repository_url 2>/dev/null | cut -d'/' -f2)
FRONTEND_REPO=$(terraform output -raw ecr_frontend_repository_url 2>/dev/null | cut -d'/' -f2)

if [ ! -z "$BACKEND_REPO" ]; then
    aws ecr batch-delete-image --repository-name ${BACKEND_REPO} --region ${AWS_REGION} --image-ids "$(aws ecr list-images --repository-name ${BACKEND_REPO} --region ${AWS_REGION} --query 'imageIds[*]' --output json)" 2>/dev/null || true
fi

if [ ! -z "$FRONTEND_REPO" ]; then
    aws ecr batch-delete-image --repository-name ${FRONTEND_REPO} --region ${AWS_REGION} --image-ids "$(aws ecr list-images --repository-name ${FRONTEND_REPO} --region ${AWS_REGION} --query 'imageIds[*]' --output json)" 2>/dev/null || true
fi

# Destroy infrastructure
terraform destroy -auto-approve

echo -e "${GREEN}✓ Infrastructure destroyed${NC}"
