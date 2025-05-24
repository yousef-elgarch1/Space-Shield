@echo off
echo 🔧 Fixing backend health check issues...

REM Delete all backend deployments
echo 🗑️ Cleaning up backend deployments...
kubectl delete deployment -l app=backend -n spaceshield
kubectl delete deployment backend -n spaceshield 2>nul

REM Wait for cleanup
echo ⏳ Waiting for cleanup...
timeout /t 15

REM Redeploy backend with fixed health checks
echo 🚀 Deploying backend with longer startup time...
kubectl apply -f backend-fixed.yaml

REM Fix frontend API URL
echo 🎨 Fixing frontend API configuration...
kubectl set env deployment/frontend REACT_APP_API_URL="http://backend:8080" -n spaceshield

REM Restart frontend
kubectl rollout restart deployment frontend -n spaceshield

echo ⏳ Waiting for backend to start (this may take 5-6 minutes)...
timeout /t 60

echo 📊 Checking deployment status...
kubectl get pods -n spaceshield

echo ✅ Backend fix complete! Backend now has 5 minutes to start properly.
echo 🔍 Monitor backend startup with: kubectl logs -f deployment/backend -n spaceshield

pause