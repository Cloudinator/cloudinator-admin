# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Install libc6-compat for better compatibility
RUN apk add --no-cache libc6-compat

# Set the working directory to /app
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with force and allow some potential peer dependency mismatches
RUN npm install --force

# Copy all project files
COPY . .

# Install sharp with force if needed for image processing
RUN npm i sharp --force

# Run the next build process and generate the artifacts
RUN npm run build

# Multi-stage build process for final image
FROM node:18-alpine

# Update, upgrade, and add dumb-init for proper signal handling
RUN apk update && apk upgrade && apk add --no-cache dumb-init && \
    adduser -D nextuser

# Set work dir as app
WORKDIR /app

# Copy build artifacts with proper ownership
COPY --chown=nextuser:nextuser --from=builder /app/public ./public
COPY --chown=nextuser:nextuser --from=builder /app/.next/standalone ./
COPY --chown=nextuser:nextuser --from=builder /app/.next/static ./.next/static

# Set non-root user
USER nextuser

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0 \
    PORT=3000 \
    NODE_ENV=production

# Use dumb-init to handle signal forwarding and process management
CMD ["dumb-init", "node", "server.js"]
