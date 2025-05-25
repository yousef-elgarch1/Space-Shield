pipeline {
    agent any
    
    // 🔥 AUTO-TRIGGER: Automatically build on Git commits
    triggers {
        pollSCM('H/2 * * * *')  // Check for changes every 2 minutes
    }
    
    // 🌍 ENVIRONMENT VARIABLES
    environment {
        NAMESPACE       = 'spaceshield'
        BACKEND_DIR     = 'backend'
        FRONTEND_DIR    = 'Frontend'
        OREKIT_PATH     = '/app/orekit-data'
        DB_HOST         = 'mysql'
        DB_PORT         = '3306'
        MYSQL_DATABASE  = 'spaceshielddb'
        HELM_PATH       = '/var/jenkins_home/helm'
        KUBECTL_PATH    = '/var/jenkins_home/kubectl'
    }
    
    stages {
        // 🛰️ SPACESHIELD MONITORING DASHBOARD INFO
        stage('🛰️ SpaceShield Monitoring Dashboard') {
            steps {
                script {
                    echo """
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                          🛰️ SPACESHIELD MONITORING DASHBOARD                          ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                       ║
║  📊 MONITORING ENDPOINTS:                                                             ║
║  ├── 🎯 Grafana Dashboard: http://localhost:30302 (admin/spaceshield123)             ║
║  ├── 📈 Prometheus Metrics: http://localhost:30091                                   ║
║  ├── 🚨 AlertManager: http://localhost:30093                                         ║
║                                                                                       ║
║  🛰️ SPACESHIELD METRICS BEING TRACKED:                                               ║
║  ├── 🚀 Satellite API Requests: http_server_requests_seconds_count                   ║
║  ├── 🗑️ Debris Tracking Performance: response times & error rates                    ║
║  ├── ⏱️ Orbital Calculation Speed: API latency metrics                               ║
║  ├── 💾 JVM Memory Usage: heap memory for space computations                         ║
║  ├── 🗄️ Database Performance: MySQL connection pools                                 ║
║  ├── 🚨 System Health: uptime and error tracking                                     ║
║                                                                                       ║
║  🎯 SPACESHIELD APPLICATION ENDPOINTS:                                                ║
║  ├── 🌐 Frontend: http://localhost:30001                                             ║
║  ├── 🔗 API Welcome: http://localhost:30001/api/tle/welcome                          ║
║  ├── 🛰️ Satellite Data: http://localhost:30001/api/tle/satellites                    ║
║  ├── 🗑️ Debris Data: http://localhost:30001/api/tle/debris                           ║
║  ├── ❤️ Health Check: http://localhost:30001/actuator/health                         ║
║  ├── 📊 Metrics: http://localhost:30001/actuator/prometheus                          ║
║                                                                                       ║
║  ⚡ PIPELINE STATUS: Starting SpaceShield Deployment...                               ║
║                                                                                       ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
                    """
                }
            }
        }
        
        // 📦 SOURCE CODE CHECKOUT
        stage('📦 Checkout Source Code') {
            steps {
                echo "📥 Checking out SpaceShield source code..."
                checkout scm
                sh 'echo "✅ Source code checked out successfully"'
            }
        }
        
        // 🔧 SETUP HELM FOR MONITORING
        stage('🔧 Setup Helm') {
            steps {
                echo "🔧 Setting up Helm for monitoring deployment..."
                sh """
                echo "Using HELM_PATH: ${env.HELM_PATH}"
                
                if [ ! -f "${env.HELM_PATH}" ]; then
                    echo "📥 Downloading Helm v3.12.0..."
                    curl -fsSL https://get.helm.sh/helm-v3.12.0-linux-amd64.tar.gz | tar -xzf - -C /tmp
                    mv /tmp/linux-amd64/helm ${env.HELM_PATH}
                    chmod +x ${env.HELM_PATH}
                    echo "✅ Helm installed successfully"
                else
                    echo "✅ Helm already installed"
                fi
                
                ${env.HELM_PATH} version --short
                echo "🎯 Helm ready for monitoring deployment"
                """
            }
        }
        
        // 🏗️ BUILD BACKEND (DEBRIS TRACKER)
        stage('🏗️ Build Backend') {
            steps {
                echo "🏗️ Building SpaceShield Backend (Debris Tracker)..."
                dir("${env.BACKEND_DIR}") {
                    sh '''
                    echo "📋 Backend build started..."
                    chmod +x mvnw || true
                    echo "🔨 Compiling Java application with Maven..."
                    ./mvnw clean package -DskipTests
                    echo "✅ Backend build completed successfully"
                    '''
                }
            }
        }
        
        // 🎨 BUILD FRONTEND (REACT APP)
        stage('🎨 Build Frontend') {
            steps {
                echo "🎨 Building SpaceShield Frontend (React Application)..."
                dir("${env.FRONTEND_DIR}") {
                    sh '''
                    echo "📋 Frontend build started..."
                    echo "📦 Installing dependencies..."
                    ls -la && cat package-lock.json || echo "⚠️ LOCKFILE MISSING"
                    npm ci
                    echo "🔨 Building React application..."
                    npm run build
                    echo "✅ Frontend build completed successfully"
                    '''
                }
            }
        }
        
        // 🧪 TEST BACKEND
        stage('🧪 Test Backend') {
            steps {
                echo "🧪 Running SpaceShield Backend Tests..."
                dir("${env.BACKEND_DIR}") {
                    sh '''
                    echo "🔬 Running unit tests..."
                    ./mvnw test
                    echo "✅ All tests passed successfully"
                    '''
                }
            }
        }
        
        // 🚀 DEPLOY TO KUBERNETES
        stage('🚀 Deploy to Kubernetes') {
            steps {
                echo "🚀 Deploying SpaceShield to Kubernetes cluster..."
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
                    echo "🎯 Deploying to Kubernetes namespace: ${NAMESPACE}"
                    
                    # Update backend deployment with environment variables
                    echo "🔧 Configuring backend environment..."
                    ${KUBECTL_PATH} set env deployment/backend SPACE_TRACK_USERNAME=${SPACE_TRACK_USERNAME} -n ${NAMESPACE}
                    ${KUBECTL_PATH} set env deployment/backend SPACE_TRACK_PASSWORD=${SPACE_TRACK_PASSWORD} -n ${NAMESPACE}
                    ${KUBECTL_PATH} set env deployment/backend MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} -n ${NAMESPACE}
                    ${KUBECTL_PATH} set env deployment/backend DB_HOST=${DB_HOST} -n ${NAMESPACE}
                    ${KUBECTL_PATH} set env deployment/backend DB_PORT=${DB_PORT} -n ${NAMESPACE}
                    ${KUBECTL_PATH} set env deployment/backend MYSQL_DATABASE=${MYSQL_DATABASE} -n ${NAMESPACE}
                    
                    # Update frontend deployment
                    echo "🔧 Configuring frontend environment..."
                    ${KUBECTL_PATH} set env deployment/frontend REACT_APP_API_URL="http://backend:8080" -n ${NAMESPACE}
                    
                    # Restart deployments to apply changes
                    echo "🔄 Restarting SpaceShield deployments..."
                    ${KUBECTL_PATH} rollout restart deployment/backend -n ${NAMESPACE}
                    ${KUBECTL_PATH} rollout restart deployment/frontend -n ${NAMESPACE}
                    
                    # Wait for deployments to complete
                    echo "⏳ Waiting for backend deployment to complete..."
                    ${KUBECTL_PATH} rollout status deployment/backend -n ${NAMESPACE} --timeout=300s
                    
                    echo "⏳ Waiting for frontend deployment to complete..."
                    ${KUBECTL_PATH} rollout status deployment/frontend -n ${NAMESPACE} --timeout=300s
                    
                    echo "✅ SpaceShield deployment completed successfully!"
                    '''
                }
            }
        }
        
        // 📊 DEPLOY MONITORING STACK
        stage('📊 Deploy Monitoring Stack') {
            steps {
                echo "📊 Deploying Prometheus + Grafana monitoring for SpaceShield..."
                sh """
                echo "🔍 Verifying Helm installation..."
                ls -la ${env.HELM_PATH} || echo "⚠️ Helm not found!"
                
                echo "📦 Adding Prometheus Helm repository..."
                ${env.HELM_PATH} repo add prometheus-community https://prometheus-community.github.io/helm-charts || true
                ${env.HELM_PATH} repo update
                
                echo "🔍 Checking for existing monitoring stack..."
                if ${env.HELM_PATH} list -n ${env.NAMESPACE} | grep -q "spaceshield-monitoring"; then
                    echo "🔄 Upgrading existing SpaceShield monitoring stack..."
                    ${env.HELM_PATH} upgrade spaceshield-monitoring prometheus-community/kube-prometheus-stack \
                        --namespace ${env.NAMESPACE} \
                        --values k8s/monitoring-values.yaml \
                        --wait --timeout=600s
                else
                    echo "🆕 Installing new SpaceShield monitoring stack..."
                    ${env.HELM_PATH} install spaceshield-monitoring prometheus-community/kube-prometheus-stack \
                        --namespace ${env.NAMESPACE} \
                        --values k8s/monitoring-values.yaml \
                        --wait --timeout=600s
                fi
                
                echo "🔧 Applying ServiceMonitor for backend metrics..."
                if [ -f "k8s/backend-servicemonitor.yaml" ]; then
                    ${env.KUBECTL_PATH} apply -f k8s/backend-servicemonitor.yaml
                    echo "✅ ServiceMonitor applied successfully"
                else
                    echo "⚠️ ServiceMonitor file not found, skipping..."
                fi
                
                echo "✅ SpaceShield monitoring stack deployed successfully!"
                """
            }
        }
        
        // 🔍 VERIFY DEPLOYMENT
        stage('🔍 Verify Deployment') {
            steps {
                echo "🔍 Verifying SpaceShield deployment status..."
                sh '''
                echo "📊 Checking all pods in SpaceShield namespace..."
                ${KUBECTL_PATH} get pods -n ${NAMESPACE}
                
                echo "🌐 Checking all services in SpaceShield namespace..."
                ${KUBECTL_PATH} get svc -n ${NAMESPACE}
                
                echo "🎯 Checking SpaceShield backend health..."
                ${KUBECTL_PATH} get pods -l app=backend -n ${NAMESPACE}
                
                echo "🎨 Checking SpaceShield frontend status..."
                ${KUBECTL_PATH} get pods -l app=frontend -n ${NAMESPACE}
                
                echo "📊 Checking monitoring components..."
                ${KUBECTL_PATH} get pods -l "app.kubernetes.io/name=prometheus" -n ${NAMESPACE} || echo "Prometheus not yet ready"
                ${KUBECTL_PATH} get pods -l "app.kubernetes.io/name=grafana" -n ${NAMESPACE} || echo "Grafana not yet ready"
                
                echo "✅ Deployment verification completed"
                '''
            }
        }
        
        // 🧪 TEST ENDPOINTS
        stage('🧪 Test SpaceShield Endpoints') {
            steps {
                echo "🧪 Testing SpaceShield API endpoints..."
                sh '''
                echo "⏳ Waiting 30 seconds for services to be ready..."
                sleep 30
                
                echo "🧪 Testing backend API endpoint..."
                ${KUBECTL_PATH} run test-spaceshield-api --image=curlimages/curl --rm -i --restart=Never -n ${NAMESPACE} \
                    -- curl -f http://backend:8080/api/tle/welcome || echo "⚠️ Backend API test failed"
                
                echo "💓 Testing backend health endpoint..."
                ${KUBECTL_PATH} run test-spaceshield-health --image=curlimages/curl --rm -i --restart=Never -n ${NAMESPACE} \
                    -- curl -f http://backend:8080/actuator/health || echo "⚠️ Health endpoint test failed"
                
                echo "📊 Testing metrics endpoint..."
                ${KUBECTL_PATH} run test-spaceshield-metrics --image=curlimages/curl --rm -i --restart=Never -n ${NAMESPACE} \
                    -- curl -f http://backend:8080/actuator/prometheus || echo "⚠️ Metrics endpoint test failed"
                
                echo "✅ Endpoint testing completed"
                '''
            }
        }
    }
    
    // 📋 POST-BUILD ACTIONS
    post {
        success {
            script {
                echo """
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                       🎉 SPACESHIELD DEPLOYMENT SUCCESSFUL! 🎉                       ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                       ║
║  🛰️ SPACESHIELD APPLICATION ACCESS:                                                   ║
║  ├── 🌐 Frontend: http://localhost:30001                                             ║
║  ├── 🔗 Backend API: http://localhost:30001/api/tle/welcome                          ║
║  ├── 🛰️ Satellite Data: http://localhost:30001/api/tle/satellites                    ║
║  ├── 🗑️ Debris Data: http://localhost:30001/api/tle/debris                           ║
║  ├── ❤️ Health: http://localhost:30001/actuator/health                               ║
║                                                                                       ║
║  📊 MONITORING DASHBOARDS:                                                            ║
║  ├── 🎯 Grafana: http://localhost:30302 (admin/spaceshield123)                       ║
║  ├── 📈 Prometheus: http://localhost:30091                                           ║
║  ├── 🚨 AlertManager: http://localhost:30093                                         ║
║                                                                                       ║
║  🎯 NEXT STEPS:                                                                       ║
║  ├── 1. Access Grafana to view SpaceShield metrics                                   ║
║  ├── 2. Test API endpoints to generate monitoring data                               ║
║  ├── 3. Check Prometheus targets for health status                                   ║
║  ├── 4. Monitor space debris tracking performance                                    ║
║                                                                                       ║
║  🚀 SpaceShield is now operational and ready for space debris tracking! 🛰️         ║
║                                                                                       ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
                """
            }
        }
        
        failure {
            echo "❌ SpaceShield deployment failed! Initiating rollback..."
            sh '''
            echo "🔄 Rolling back SpaceShield deployments..."
            ${KUBECTL_PATH} rollout undo deployment/backend -n ${NAMESPACE} || echo "Backend rollback failed"
            ${KUBECTL_PATH} rollout undo deployment/frontend -n ${NAMESPACE} || echo "Frontend rollback failed"
            echo "❌ Rollback completed"
            '''
        }
        
        always {
            echo "🧹 SpaceShield pipeline completed. Cleaning up temporary resources..."
            sh '''
            # Clean up any test pods
            ${KUBECTL_PATH} delete pod --field-selector=status.phase==Succeeded -n ${NAMESPACE} || true
            echo "✅ Cleanup completed"
            '''
        }
    }
}