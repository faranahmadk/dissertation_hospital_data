# Stage 1: Build the NestJS application
FROM node:20.17.0 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the NestJS app runs on
EXPOSE 4001

# Install the development tools for hot reloading
RUN npm install --save-dev @nestjs/cli

# Command to run the application
CMD ["npm", "run", "start:dev"]