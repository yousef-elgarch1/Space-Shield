pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                // This uses the Git config (branch, URL, credentials) from Jenkins UI
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'chmod +x mvnw || true'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw test'
                }
            }
        }

        stage('Build & Run Docker Compose') {
            steps {
                sh 'docker compose down -v || true'
                sh 'docker compose up --build -d'
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 10' // Wait for services to be ready
                sh 'curl --fail http://localhost:8080 || exit 1'
                sh 'curl --fail http://localhost:3001 || exit 1'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up containers...'
            sh 'docker compose down --volumes || true'
        }
    }
}
