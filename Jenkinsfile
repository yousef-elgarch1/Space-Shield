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

stage('Setup Helm') {
    steps {
        sh '''
        echo "🔧 Setting up Helm in Jenkins..."
        HELM_PATH=/var/jenkins_home/helm
        echo "Using HELM_PATH: ${HELM_PATH}"
        
        if [ ! -f "${HELM_PATH}" ]; then
            echo "📥 Downloading Helm..."
            curl -fsSL https://get.helm.sh/helm-v3.12.0-linux-amd64.tar.gz | tar -xzf - -C /tmp
            mv /tmp/linux-amd64/helm ${HELM_PATH}
            chmod +x ${HELM_PATH}
            echo "✅ Helm installed successfully"
        else
            echo "✅ Helm already installed"
        fi
        ${HELM_PATH} version --short
        '''
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
            
            # Define kubectl path
            KUBECTL=/var/jenkins_home/kubectl
            
            # Update backend deployment environment (skip image update since we're not building new images)
            ${KUBECTL} set env deployment/backend SPACE_TRACK_USERNAME=${SPACE_TRACK_USERNAME} -n spaceshield
            ${KUBECTL} set env deployment/backend SPACE_TRACK_PASSWORD=${SPACE_TRACK_PASSWORD} -n spaceshield
            ${KUBECTL} set env deployment/backend MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} -n spaceshield
            ${KUBECTL} set env deployment/backend DB_HOST=mysql -n spaceshield
            ${KUBECTL} set env deployment/backend DB_PORT=3306 -n spaceshield
            ${KUBECTL} set env deployment/backend MYSQL_DATABASE=spaceshielddb -n spaceshield
            
            # Update frontend deployment and API URL
            ${KUBECTL} set env deployment/frontend REACT_APP_API_URL="http://backend:8080" -n spaceshield
            
            # Restart deployments to apply changes
            echo "🔄 Restarting deployments..."
            ${KUBECTL} rollout restart deployment/backend -n spaceshield
            ${KUBECTL} rollout restart deployment/frontend -n spaceshield
            
            # Wait for deployments to complete
            echo "⏳ Waiting for backend deployment..."
            ${KUBECTL} rollout status deployment/backend -n spaceshield --timeout=300s
            
            echo "⏳ Waiting for frontend deployment..."
            ${KUBECTL} rollout status deployment/frontend -n spaceshield --timeout=300s
            
            echo "✅ Deployment completed successfully!"
            '''
        }
    }
}
        stage('Deploy Monitoring Stack') {
            steps {
                sh '''
                echo "📊 Deploying Prometheus Monitoring Stack..."
                
                KUBECTL=/var/jenkins_home/kubectl
                HELM=${HELM_PATH}
                
                # Add Prometheus Helm repo
                ${HELM} repo add prometheus-community https://prometheus-community.github.io/helm-charts || true
                ${HELM} repo update
                
                # Check if monitoring already exists
                if ${HELM} list -n spaceshield | grep -q "spaceshield-monitoring"; then
                    echo "🔄 Upgrading existing monitoring stack..."
                    ${HELM} upgrade spaceshield-monitoring prometheus-community/kube-prometheus-stack \
                        --namespace spaceshield \
                        --values k8s/monitoring-values.yaml \
                        --wait --timeout=600s
                else
                    echo "🆕 Installing new monitoring stack..."
                    ${HELM} install spaceshield-monitoring prometheus-community/kube-prometheus-stack \
                        --namespace spaceshield \
                        --values k8s/monitoring-values.yaml \
                        --wait --timeout=600s
                fi
                
                # Apply ServiceMonitor for backend
                ${KUBECTL} apply -f k8s/backend-servicemonitor.yaml
                
                echo "✅ Monitoring stack deployed successfully!"
                '''
            }
        }
stage('Verify Deployment') {
    steps {
        sh '''
        echo "📊 Checking deployment status..."
        KUBECTL=/var/jenkins_home/kubectl
        ${KUBECTL} get pods -n spaceshield
        ${KUBECTL} get svc -n spaceshield
        
        echo "🔍 Checking backend health..."
        ${KUBECTL} get pods -l app=backend -n spaceshield
        
        echo "🔍 Checking frontend status..."
        ${KUBECTL} get pods -l app=frontend -n spaceshield
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
                    echo "📊 Grafana: http://localhost:30302 (admin/spaceshield123)"
            echo "📈 Prometheus: http://localhost:30091"
            echo "🚨 AlertManager: http://localhost:30093"
        '''
    }
    failure {
        echo '❌ Deployment failed. Rolling back...'
        sh '''
        KUBECTL=/var/jenkins_home/kubectl
        ${KUBECTL} rollout undo deployment/backend -n spaceshield || true
        ${KUBECTL} rollout undo deployment/frontend -n spaceshield || true
        '''
    }
    always {
        echo '🧹 Pipeline completed.'
    }
}
}