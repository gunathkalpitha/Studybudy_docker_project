# AWS EC2 Free Tier Deployment

Deploy your React + Node.js app on AWS EC2 Free Tier.

## Cost: $0/month (Free Tier)

- ✅ EC2 t2.micro - 750 hours/month free
- ✅ 30GB storage - Free
- ✅ Data transfer - 15GB/month free
- ✅ Free for 12 months

## Prerequisites

1. **Generate SSH key** (if you don't have one):
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/react-doker-key
```

2. **Get your public key**:
```bash
cat ~/.ssh/react-doker-key.pub
```

3. **MongoDB Atlas** connection string

## Deployment Steps

### 1. Configure Variables

```bash
cd terraform-ec2
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars
```

Update:
- `mongodb_uri` - Your MongoDB Atlas connection string
- `jwt_secret` - Random secret string
- `ssh_public_key` - Output from `cat ~/.ssh/react-doker-key.pub`

### 2. Deploy

```bash
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Deploy
terraform apply
```

### 3. Access Your App

After deployment completes (~5 minutes), you'll see:

```
frontend_url = "http://54.123.456.78:5173"
backend_url = "http://54.123.456.78:5000"
ssh_command = "ssh -i ~/.ssh/react-doker-key ubuntu@54.123.456.78"
```

Open the frontend URL in your browser!

## Managing Your App

### SSH into EC2

```bash
ssh -i ~/.ssh/react-doker-key ubuntu@<your-ip>
```

### View logs

```bash
cd /home/ubuntu/app
docker compose logs -f
```

### Restart services

```bash
cd /home/ubuntu/app
docker compose restart
```

### Update images

```bash
cd /home/ubuntu/app
docker compose pull
docker compose up -d
```

## Destroy Resources

When done:

```bash
cd terraform-ec2
terraform destroy
```

## Free Tier Limits

- **750 hours/month** - Run 1 t2.micro instance 24/7
- **30GB storage** - EBS volume
- **15GB data transfer out** - Per month
- **Valid for 12 months** from AWS signup

## Troubleshooting

### Can't connect?

1. Check security group allows your IP
2. Verify SSH key is correct
3. Wait 2-3 minutes after deployment

### App not loading?

```bash
# SSH into instance
ssh -i ~/.ssh/react-doker-key ubuntu@<ip>

# Check Docker containers
docker ps

# View logs
docker compose logs
```

### Update environment variables

```bash
# SSH into instance
cd /home/ubuntu/app
nano docker-compose.yml
# Update variables
docker compose up -d
```
