# Use Node.js 20 as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies with the --legacy-peer-deps flag to address compatibility issues
RUN npm install --legacy-peer-deps

# Copy the rest of your application code to the container
COPY . .
