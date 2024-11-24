# Build stage
FROM eclipse-temurin:21-jdk-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper files
COPY mvnw .
COPY .mvn .mvn

# Copy the project files
COPY pom.xml .
COPY src src

# Make the Maven wrapper executable and fix line endings
RUN chmod +x mvnw
RUN sed -i 's/\r$//' mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "app.jar"]

