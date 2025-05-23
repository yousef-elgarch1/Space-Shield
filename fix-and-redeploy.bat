@echo off
echo 🗄️ Creating simple MySQL deployment...

REM Create simple MySQL without volume complications
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-simple
  namespace: spaceshield
  labels:
    app: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.4
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "youssef"
        - name: MYSQL_DATABASE
          value: "spaceshielddb"
        ports:
        - containerPort: 3306
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
EOF

echo ✅ Simple MySQL created (no persistent storage)

REM Wait for MySQL to start
echo ⏳ Waiting for MySQL to start...
timeout /t 30

REM Check status
kubectl get pods -l app=mysql -n spaceshield

REM Restart backend
kubectl rollout restart deployment backend -n spaceshield

echo 🌐 Try accessing:
echo Frontend: http://localhost:30001

pause