# Use the official OpenJDK image as a parent image
FROM openjdk:23-slim

# Install SQLite3
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/nb-weather-ol-0.0.1-SNAPSHOT.jar app.jar

# Create a directory for the database
RUN mkdir -p /app/data

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/app.jar"]