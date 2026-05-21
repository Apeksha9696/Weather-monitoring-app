pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'weather-app:latest'
        CONTAINER_NAME = 'weather-app-container'
        // Securely retrieve the weather API key from Jenkins credentials
        WEATHER_API_KEY = credentials('weather-api-key')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing backend dependencies..."
                dir('backend') {
                    bat "npm install"
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running backend unit tests..."
                dir('backend') {
                    bat "npm test"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                bat "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Run Container') {
            steps {
                script {
                    echo "Stopping existing container (if any)..."
                    // Use standard batch logic to prevent failure if container does not exist
                    bat "docker stop ${CONTAINER_NAME} || exit 0"
                    bat "docker rm ${CONTAINER_NAME} || exit 0"

                    echo "Running new container..."
                    // Run container and inject WEATHER_API_KEY environment variable
                    bat "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} -e WEATHER_API_KEY=${WEATHER_API_KEY} ${DOCKER_IMAGE}"
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace..."
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully! The weather application is running on port 3000."
        }
        failure {
            echo "Pipeline failed. Please review the build log for errors."
        }
    }
}
