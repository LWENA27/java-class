#!/bin/bash
# Build script for Render.com

echo "Building Spring Boot application..."
./mvnw clean package -DskipTests

echo "Build completed successfully!"
