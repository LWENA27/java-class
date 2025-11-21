# Build stage - Use Maven image with JDK 21
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Build the application (Maven will download dependencies as needed)
RUN mvn clean package -DskipTests

# Runtime stage - smaller image with only JRE
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from builder stage
COPY --from=builder /app/target/smartmenu-backend-1.0.0.jar app.jar

# Expose port (Render will set PORT env variable)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
