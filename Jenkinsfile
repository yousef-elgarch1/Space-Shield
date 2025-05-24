pipeline {
    agent any
    environment {
        NAMESPACE       = 'spaceshield'
        BACKEND_DIR     = 'backend'
        FRONTEND_DIR    = 'Frontend'
        // Keep your existing vars for compatibility
        OREKIT_PATH     = '/app/orekit-data'
        DB_HOST         = 'mysql'  // Changed to K8s service name
        DB_PORT         = '3306'   // Changed to internal port
        MYSQL_DATABASE  = 'spaceshielddb'
    }
    stages {
        stage('Checkout') {
            steps {
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
                    sh 'ls -la && cat package-lock.json || echo "LOCKFILE MISSING"'
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
        stage('Build Docker Images') {
            steps {
                script {
                    // Build images with latest tag
                    sh 'docker build -t spaceshield-backend:latest ./backend'
                    sh 'docker build -t spaceshield-frontend:latest ./Frontend'
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'spacetrack-creds',
                        usernameVariable: 'SPACE_TRACK_USERNAME',
                        passwordVariable: 'SPACE_TRACK_PASSWORD'
                    ),
                    usernamePassword(
                        credentialsId: 'mysql-creds',
                        usernameVariable: 'MYSQL_USERNAME',
                        passwordVariable: 'MYSQL_PASSWORD'
                    ),
                    string(
                        credentialsId: 'mysql-root-password',
                        variable: 'MYSQL_ROOT_PASSWORD'
                    )
                ]) {
                    sh '''
                    echo "🚀 Deploying to Kubernetes namespace: spaceshield"
                    
                    # Update backend deployment with new image and environment
                    kubectl set image deployment/backend backend=spaceshield-backend:latest -n spaceshield
                    kubectl set env deployment/backend SPACE_TRACK_USERNAME=${SPACE_TRACK_USERNAME} -n spaceshield
                    kubectl set env deployment/backend SPACE_TRACK_PASSWORD=${SPACE_TRACK_PASSWORD} -n spaceshield
                    kubectl set env deployment/backend MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} -n spaceshield
                    kubectl set env deployment/backend DB_HOST=mysql -n spaceshield
                    kubectl set env deployment/backend DB_PORT=3306 -n spaceshield
                    kubectl set env deployment/backend MYSQL_DATABASE=spaceshielddb -n spaceshield
                    
                    # Update frontend deployment with new image and API URL
                    kubectl set image deployment/frontend frontend=spaceshield-frontend:latest -n spaceshield
                    kubectl set env deployment/frontend REACT_APP_API_URL="http://backend:8080" -n spaceshield
                    
                    # Wait for deployments to complete
                    echo "⏳ Waiting for backend deployment..."
                    kubectl rollout status deployment/backend -n spaceshield --timeout=300s
                    
                    echo "⏳ Waiting for frontend deployment..."
                    kubectl rollout status deployment/frontend -n spaceshield --timeout=300s
                    
                    echo "✅ Deployment completed successfully!"
                    '''
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                sh '''
                echo "📊 Checking deployment status..."
                kubectl get pods -n spaceshield
                kubectl get svc -n spaceshield
                
                echo "🔍 Checking backend health..."
                kubectl get pods -l app=backend -n spaceshield
                
                echo "🔍 Checking frontend status..."
                kubectl get pods -l app=frontend -n spaceshield
                '''
            }
        }
        stage('Test Endpoints') {
            steps {
                sh '''
                echo "🧪 Testing API endpoints..."
                sleep 30  # Wait for services to be ready
                
                # Test if backend is responding (from within cluster)
                kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -n spaceshield -- curl -f http://backend:8080/api/tle/welcome || echo "Backend test failed"
                '''
            }
        }
    }
    post {
        success {
            echo '🎉 Deployment successful! SpaceShield is ready.'
            sh '''
            echo "📋 Access your application:"
            echo "Frontend: http://localhost:30001"
            echo "Backend API: kubectl port-forward service/backend 8080:8080 -n spaceshield"
            '''
        }
        failure {
            echo '❌ Deployment failed. Rolling back...'
            sh '''
            kubectl rollout undo deployment/backend -n spaceshield || true
            kubectl rollout undo deployment/frontend -n spaceshield || true
            '''
        }
        always {
            echo '🧹 Pipeline completed.'
            // Remove the Docker Compose cleanup since we're using K8s
        }
    }
}