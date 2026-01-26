pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'gbgk/studybudy-backend'
        FRONTEND_IMAGE = 'gbgk/studybudy-frontend'
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

        stage('Push Backend Docker Image') {
            steps {
                script {
                    sh "docker push ${BACKEND_IMAGE}:latest"
                }
            }
        }

        stage('Push Frontend Docker Image') {
            steps {
                script {
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Push to ECR') {
    steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
            sh '''
                # Login to ECR
                aws ecr get-login-password --region us-east-1 | \
                docker login --username AWS --password-stdin 196530534986.dkr.ecr.us-east-1.amazonaws.com
                
                # Tag images for ECR
                docker tag ${BACKEND_IMAGE}:latest 196530534986.dkr.ecr.us-east-1.amazonaws.com/react-doker-backend:latest
                docker tag ${FRONTEND_IMAGE}:latest 196530534986.dkr.ecr.us-east-1.amazonaws.com/react-doker-frontend:latest
                
                # Push to ECR
                docker push 196530534986.dkr.ecr.us-east-1.amazonaws.com/react-doker-backend:latest
                docker push 196530534986.dkr.ecr.us-east-1.amazonaws.com/react-doker-frontend:latest
            '''
        }
    }
}

stage('Deploy to EC2') {
    steps {
        withCredentials([
            sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
            aws(credentialsId: 'aws-credentials')
        ]) {
            sh '''
                # SSH into EC2 and restart containers with new images
                ssh -o StrictHostKeyChecking=no -i $SSH_KEY ubuntu@<your-ec2-public-ip> << 'ENDSSH'
                    cd ~/app
                    
                    # Login to ECR on EC2
                    aws ecr get-login-password --region us-east-1 | \
                    docker login --username AWS --password-stdin 196530534986.dkr.ecr.us-east-1.amazonaws.com
                    
                    # Pull latest images
                    docker compose pull
                    
                    # Restart containers
                    docker compose up -d --force-recreate
                    
                    # Show status
                    docker compose ps
ENDSSH
            '''
        }
    }
}

        

    }
}
