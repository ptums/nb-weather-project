# Use Eclipse Temurin as it provides Java 23
FROM eclipse-temurin:23-jdk-alpine as build

# Set the working directory in the container
WORKDIR /workspace/app

# Copy the Maven executable to the container
COPY mvnw .
COPY .mvn .mvn

# Copy the project files
COPY pom.xml .
COPY src src

# Build the application
RUN ./mvnw install -DskipTests

# Create the runtime image
FROM eclipse-temurin:23-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the built artifact from the build stage
COPY --from=build /workspace/app/target/*.jar app.jar

# Install SQLite
RUN apk add --no-cache sqlite

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java","-jar","app.jar"]