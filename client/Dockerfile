# Use an official Node runtime as the base image
FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Use a smaller base image for the production stage
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built assets from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Install only production dependencies
RUN npm i --only=production

# Install serve to run the application
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "3000"]

