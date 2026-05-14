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
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    echo "Stopping existing container (if any)..."
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    
                    echo "Running new container..."
                    sh "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}"
                }
            }
        }
    }
}
