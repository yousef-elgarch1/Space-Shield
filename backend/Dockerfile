FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Install netcat to allow port checking
RUN apk add --no-cache netcat-openbsd

# Copy Spring Boot jar and wait script
COPY target/*.jar app.jar
COPY wait-for.sh .

# Make the wait script executable
RUN chmod +x wait-for.sh

# Expose application port
EXPOSE 8081

# Optional default values for DB host/port (can be overridden in compose/env)
ENV DB_HOST=mysql-container
ENV DB_PORT=3306

# Use wait-for script as entrypoint
ENTRYPOINT ["sh", "./wait-for.sh"]
