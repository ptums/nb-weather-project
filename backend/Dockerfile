# Use an official Node runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src ./src



# Build the TypeScript project
RUN npm run build

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD ["node", "dist/index.js"]

