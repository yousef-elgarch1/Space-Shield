@echo off
echo 🔧 Fixing MySQL remote access permissions...

REM Delete current MySQL completely
echo 🗑️ Deleting current MySQL deployment...
kubectl delete deployment mysql -n spaceshield
kubectl delete service mysql -n spaceshield  
kubectl delete pvc mysql-pvc -n spaceshield

REM Wait for cleanup
echo ⏳ Waiting for cleanup...
timeout /t 15

REM Create MySQL with proper remote access
echo 🗄️ Creating MySQL with remote access enabled...
kubectl apply -f mysql-fixed.yaml

REM Wait for MySQL to start
echo ⏳ Waiting for MySQL to initialize...
timeout /t 60

REM Check MySQL initialization
echo 📊 Checking MySQL status...
kubectl get pods -l app=mysql -n spaceshield
kubectl logs deployment/mysql -n spaceshield --tail=10

REM Restart backend to reconnect
echo 🔄 Restarting backend to reconnect...
kubectl rollout restart deployment backend -n spaceshield

echo ✅ MySQL fix complete! Backend should now connect successfully.

pause