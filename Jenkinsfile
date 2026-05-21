pipeline {
    agent { label 'windows' }

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
                    def stopStatus = bat(script: "docker stop ${CONTAINER_NAME}", returnStatus: true)
                    if (stopStatus != 0) {
                        echo "No running container named ${CONTAINER_NAME} was found or it could not be stopped."
                    }

                    def rmStatus = bat(script: "docker rm ${CONTAINER_NAME}", returnStatus: true)
                    if (rmStatus != 0) {
                        echo "No container named ${CONTAINER_NAME} was found to remove."
                    }

                    echo "Running new container..."
                    bat "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}"
                }
            }
        }
    }
}
