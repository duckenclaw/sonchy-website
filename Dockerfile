# Use Node.js 24 as base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (all are now production dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE $PORT

ENV PORT=8080
ENV HOST=0.0.0.0


# Start the application
CMD ["npm", "run", "start"]
