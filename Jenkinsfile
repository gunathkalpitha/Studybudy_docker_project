pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'gbgk/studybudy-backend'
        FRONTEND_IMAGE = 'gbgk/studybudy-frontend'
        ECR_REGISTRY = '196530534986.dkr.ecr.us-east-1.amazonaws.com'
        AWS_REGION = 'us-east-1'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/gunathkalpitha/Studybudy_docker_project.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile backend/"
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile frontend/"
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-credentials', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        # Configure AWS CLI
                        export AWS_DEFAULT_REGION=${AWS_REGION}
                        
                        # Login to ECR
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_REGISTRY}
                        
                        # Tag images for ECR
                        docker tag ${BACKEND_IMAGE}:latest ${ECR_REGISTRY}/react-doker-backend:latest
                        docker tag ${FRONTEND_IMAGE}:latest ${ECR_REGISTRY}/react-doker-frontend:latest
                        
                        # Push to ECR
                        docker push ${ECR_REGISTRY}/react-doker-backend:latest
                        docker push ${ECR_REGISTRY}/react-doker-frontend:latest
                        
                        echo "✅ Images pushed to ECR successfully"
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
                    usernamePassword(credentialsId: 'aws-credentials', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY'),
                    string(credentialsId: 'ec2-public-ip', variable: 'EC2_IP')
                ]) {
                    sh '''
                        # Deploy to EC2
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ubuntu@${EC2_IP} << 'ENDSSH'
                            export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
                            export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
                            export AWS_DEFAULT_REGION=us-east-1
                            
                            cd ~/app
                            
                            # Login to ECR on EC2
                            aws ecr get-login-password --region us-east-1 | \
                            docker login --username AWS --password-stdin 196530534986.dkr.ecr.us-east-1.amazonaws.com
                            
                            # Pull latest images
                            docker compose pull
                            
                            # Restart containers with new images
                            docker compose up -d --force-recreate
                            
                            # Show status
                            echo "✅ Deployment complete!"
                            docker compose ps
ENDSSH
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo '🚀 Application deployed to EC2'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
    }
}
