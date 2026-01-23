# AWS Deployment Guide

This guide will help you deploy the MERN application to AWS using Terraform and ECS Fargate.

## Architecture

The deployment creates:
- **VPC** with public and private subnets across 2 availability zones
- **Application Load Balancer (ALB)** for routing traffic
- **ECS Fargate** cluster with frontend and backend services
- **ECR** repositories for Docker images
- **CloudWatch** for logging
- **Security Groups** for network security

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** installed (v1.0+)
4. **Docker** installed and running
5. **MongoDB Atlas account** (or AWS DocumentDB)

## Step 1: Configure AWS Credentials

In WSL, run:

```bash
aws configure
```

Provide:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., us-east-1)
- Output format: json

Verify configuration:

```bash
aws sts get-caller-identity
```

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist all IPs (0.0.0.0/0) for testing
4. Get the connection string

### Option B: AWS DocumentDB

Create DocumentDB cluster separately (additional cost applies).

## Step 3: Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
aws_region   = "us-east-1"  # Change to your preferred region
project_name = "react-doker"

# MongoDB connection string
mongodb_uri = "mongodb+srv://username:password@cluster.mongodb.net/dbname"

# JWT secret for authentication
jwt_secret = "your-super-secret-jwt-key-change-this-to-something-random"

backend_image_tag  = "latest"
frontend_image_tag = "latest"
```

## Step 4: Deploy to AWS

From the project root in WSL:

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run deployment
./scripts/deploy.sh
```

The script will:
1. ✓ Verify AWS credentials
2. ✓ Create ECR repositories
3. ✓ Build Docker images
4. ✓ Push images to ECR
5. ✓ Deploy infrastructure with Terraform
6. ✓ Create ECS services

**Deployment time:** ~10-15 minutes

## Step 5: Access Your Application

After deployment completes, you'll see:

```
Frontend: http://<alb-dns-name>
Backend API: http://<alb-dns-name>/api
```

**Note:** Services need 2-3 minutes to become healthy after deployment.

## Updating Your Application

After making code changes:

```bash
./scripts/update-services.sh
```

This rebuilds images, pushes to ECR, and forces ECS to deploy new tasks.

## Monitoring

### View Logs

AWS CloudWatch Logs:
- Backend: `/ecs/react-doker-backend`
- Frontend: `/ecs/react-doker-frontend`

Or via CLI:

```bash
# Backend logs
aws logs tail /ecs/react-doker-backend --follow --region us-east-1

# Frontend logs
aws logs tail /ecs/react-doker-frontend --follow --region us-east-1
```

### Check Service Health

```bash
# Get cluster name
cd terraform
CLUSTER=$(terraform output -raw ecs_cluster_name)

# Check services
aws ecs describe-services --cluster $CLUSTER --services react-doker-backend-service --region us-east-1
aws ecs describe-services --cluster $CLUSTER --services react-doker-frontend-service --region us-east-1
```

## Scaling

Modify task count in `terraform/ecs-backend.tf` or `terraform/ecs-frontend.tf`:

```hcl
resource "aws_ecs_service" "backend" {
  # ...
  desired_count = 2  # Change from 1 to 2
  # ...
}
```

Apply changes:

```bash
cd terraform
terraform apply
```

## Cost Optimization

### Current Resources (Monthly Estimate)
- ECS Fargate (2 tasks): ~$30-40
- ALB: ~$20
- NAT Gateway: ~$30
- ECR storage: ~$1
- CloudWatch Logs: ~$5
- **Total: ~$85-95/month**

### To Reduce Costs:
1. Stop services when not in use
2. Use smaller task sizes
3. Consider EC2 instead of Fargate
4. Remove NAT Gateway (makes tasks public)

## Destroying Infrastructure

**WARNING:** This deletes all AWS resources.

```bash
./scripts/destroy.sh
```

## Troubleshooting

### Tasks Not Starting

Check CloudWatch logs for errors:

```bash
aws logs tail /ecs/react-doker-backend --follow --region us-east-1
```

Common issues:
- MongoDB connection string incorrect
- ECR images not found
- Security group blocking traffic

### Service Unhealthy

Check target group health:

```bash
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

### Can't Access Application

1. Wait 2-3 minutes for services to stabilize
2. Check security groups allow traffic
3. Verify ALB listener rules
4. Check task is running: AWS Console → ECS → Cluster → Services

## Environment Variables

Backend environment variables are defined in `terraform/ecs-backend.tf`:

```hcl
environment = [
  {
    name  = "PORT"
    value = "5000"
  },
  {
    name  = "MONGODB_URI"
    value = var.mongodb_uri
  },
  # Add more here
]
```

Frontend environment variables in `terraform/ecs-frontend.tf`:

```hcl
environment = [
  {
    name  = "VITE_API_URL"
    value = "http://${aws_lb.main.dns_name}/api"
  }
]
```

After modifying, run:

```bash
cd terraform
terraform apply
```

## CI/CD Integration

### With GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy
        run: ./scripts/update-services.sh
```

## Support

For issues:
1. Check CloudWatch logs
2. Review Terraform output
3. Verify AWS permissions
4. Check security group rules

## Next Steps

- [ ] Add HTTPS with ACM certificate
- [ ] Set up custom domain with Route 53
- [ ] Enable auto-scaling
- [ ] Add RDS database instead of MongoDB
- [ ] Implement blue/green deployments
- [ ] Add WAF for security
