pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'weather-app:latest'
        CONTAINER_NAME = 'weather-app-container'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    bat "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    echo "Stopping existing container (if any)..."
                    bat "docker stop ${CONTAINER_NAME} || true"
                    bat "docker rm ${CONTAINER_NAME} || true"
                    
                    echo "Running new container..."
                    bat "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}"
                }
            }
        }
    }
}
