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

        stage('Push to DockerHub') {
            steps {
                script {
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                    echo "✅ Images pushed to DockerHub successfully"
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
                            
                            # Pull latest images from DockerHub
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
