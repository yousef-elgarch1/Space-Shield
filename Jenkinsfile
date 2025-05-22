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
                git branch: 'devops',
                    credentialsId: 'github-pat',
                    url: 'https://github.com/m-elhamlaoui/development-platform-team-ahsan-nas.git'
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
                    sh 'npm ci'      // more reliable for CI than npm install
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
                sh 'docker compose down --volumes || true'
                sh 'docker compose up --build -d'
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 10' // give time for services to warm up
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
