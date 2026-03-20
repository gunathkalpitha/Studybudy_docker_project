pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'gbgk/studybudy-backend'
        FRONTEND_IMAGE = 'gbgk/studybudy-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"
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
                    sh """
                        docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -f backend/Dockerfile backend/
                        docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                    """
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -f frontend/Dockerfile frontend/
                        docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                    """
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
                    sh """
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                        echo "✅ Images pushed to DockerHub successfully"
                        echo "📦 Backend: ${BACKEND_IMAGE}:${IMAGE_TAG}"
                        echo "📦 Frontend: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
                    string(credentialsId: 'ec2-public-ip', variable: 'EC2_IP')
                ]) {
                    sh '''
                        # Deploy to EC2
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ubuntu@${EC2_IP} << 'ENDSSH'
                            cd ~/app
                            
                            # Get public IP
                            PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
                            echo "Public IP: $PUBLIC_IP"
                            
                            # Remove old containers and images
                            docker compose down || true
                            docker rmi -f gbgk/studybudy-backend:latest gbgk/studybudy-frontend:latest || true
                            
                            # Create/Update docker-compose.yml with DockerHub images and substitute PUBLIC_IP
                            cat > docker-compose.yml << EOF
services:
  mongo:
    image: mongo:6
    container_name: mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network

  backend:
    image: gbgk/studybudy-backend:latest
    container_name: react_docker_backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/study-app
      - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
      - PORT=5000
    depends_on:
      - mongo
    networks:
      - app-network

  frontend:
    image: gbgk/studybudy-frontend:latest
    container_name: react_docker_frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://$PUBLIC_IP:5000
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
EOF
                            
                            echo "✅ docker-compose.yml updated with DockerHub images"
                            
                            # Pull latest images from DockerHub
                            docker compose pull
                            
                            # Start containers with new images
                            docker compose up -d
                            
                            # Clean up unused images
                            docker image prune -f
                            
                            # Show status
                            echo "✅ Deployment complete!"
                            docker compose ps
                            docker images | grep studybudy
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
