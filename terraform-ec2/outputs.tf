output "instance_public_ip" {
  description = "Public IP of EC2 instance"
  value       = aws_instance.app.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of EC2 instance"
  value       = aws_instance.app.public_dns
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "http://${aws_instance.app.public_ip}:5173"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${aws_instance.app.public_ip}:5000"
}

output "ssh_command" {
  description = "SSH command to connect to instance"
  value       = "ssh -i ~/.ssh/${var.project_name}-key.pem ubuntu@${aws_instance.app.public_ip}"
}
