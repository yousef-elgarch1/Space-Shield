# backend/Dockerfile

# 1. Base JDK image
FROM eclipse-temurin:21-jdk-alpine

# 2. Workdir
WORKDIR /app

# 3. Copy in the built JAR
COPY target/*.jar app.jar

# 4. Expose the port your Spring app listens on
EXPOSE 8080

# 5. Default env-vars pointing at MySQL service on the bridge network
ENV DB_HOST=mysql
ENV DB_PORT=3306

# 6. Run your Spring Boot application as PID 1
ENTRYPOINT ["java", "-jar", "/app/app.jar"]