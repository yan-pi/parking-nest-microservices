# Use a base Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the files
COPY . .

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Expose the port that the service will use
EXPOSE 3003

# Command to run the application
CMD ["node", "dist/main"]