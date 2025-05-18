# Use Eclipse Adoptium JDK 21 as the base image
FROM eclipse-temurin:21-jdk-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy the Spring Boot jar file into the container
COPY target/*.jar app.jar
# Expose the port your Spring Boot app runs on
EXPOSE 8081
# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
