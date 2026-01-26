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
        withCredentials([
            string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
            string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
            sh '''
                # Configure AWS CLI
                export AWS_DEFAULT_REGION=us-east-1
                
                # Login to ECR
                aws ecr get-login-password --region us-east-1 | \
                docker login --username AWS --password-stdin 196530534986.dkr.ecr.us-east-1.amazonaws.com
                
                # Tag images
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
            sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER'),
            string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
            string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
            sh '''
                # Get EC2 IP (replace with your IP or use variable)
                EC2_IP="<your-ec2-public-ip>"
                
                # Deploy to EC2
                ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ubuntu@${EC2_IP} << 'ENDSSH'
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                    export AWS_DEFAULT_REGION=us-east-1
                    
                    cd ~/app
                    
                    # Login to ECR
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
