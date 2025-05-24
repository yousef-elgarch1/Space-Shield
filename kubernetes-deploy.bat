@echo off
echo 🚀 Simple Kubernetes Deployment with Cleanup...

REM Clean up any existing Kubernetes deployments first
echo 🧹 Cleaning up existing Kubernetes deployments...
kubectl delete namespace spaceshield --ignore-not-found=true
echo ⏳ Waiting for namespace cleanup...
timeout /t 15

REM Also clean up any Docker Compose if still running
echo 🛑 Stopping any Docker Compose services...
docker-compose down --volumes --remove-orphans 2>nul

echo ✅ Cleanup complete!

REM Ensure namespace exists
echo 📋 Creating fresh namespace...
kubectl create namespace spaceshield

REM Deploy using your existing YAML files
echo 🗄️ Deploying MySQL...
kubectl apply -f k8s/mysql-deployment.yaml

echo 📦 Deploying Orekit Data PVC...
kubectl apply -f k8s/orekit-data-pvc.yaml

echo ⏳ Waiting for MySQL and PVC...
timeout /t 30

echo 🔧 Deploying Backend...
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml

echo ⏳ Waiting for Backend...
timeout /t 20

echo 🎨 Deploying Frontend...
kubectl apply -f k8s/frontend-deployment.yaml

echo ⏳ Waiting for Frontend...
timeout /t 15

echo 🔨 Deploying Jenkins...
kubectl apply -f jenkins-k8s.yaml

echo ⏳ Waiting for Jenkins to start...
timeout /t 60

echo 📊 Final Deployment Status:
kubectl get pods -n spaceshield
echo.
kubectl get services -n spaceshield

echo.
echo 🎉 Kubernetes deployment complete!
echo.
echo 🌐 Access your services:
echo Frontend:  http://localhost:30001
echo Jenkins:   http://localhost:30088
echo Backend:   kubectl port-forward service/backend 8080:8080 -n spaceshield
echo.
echo 🔑 Get Jenkins admin password:
echo kubectl exec -n spaceshield deployment/jenkins -- cat /var/jenkins_home/secrets/initialAdminPassword
echo.
echo 📊 Check pod status:
echo kubectl get pods -n spaceshield
echo kubectl logs -f deployment/jenkins -n spaceshield

pause