# Use Node.js image for building the application
FROM node:20.17.0 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy built application from previous stage
COPY . .

# Expose the port on which the app will run
EXPOSE 4000

# Start the application
CMD ["npm", "run", "dev"]