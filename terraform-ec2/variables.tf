variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "react-doker"
}

variable "mongodb_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}
