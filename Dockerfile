`
# Use Node.js 24 as base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV PORT=8080
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Expose port (use hardcoded value, not variable)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]
`