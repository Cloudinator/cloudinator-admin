# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Install required build tools for sharp
RUN apk add --no-cache libc6-compat python3 make g++

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Force dependency resolution during install
RUN npm install --legacy-peer-deps

# Install sharp separately
RUN npm install sharp --legacy-peer-deps

# Copy the rest of the files
COPY . .

# Build the Next.js app
RUN npm run build

# Multi-stage build
FROM node:18-alpine

# Install dumb-init and create a non-root user
RUN apk add --no-cache dumb-init && adduser -D nextuser

# Set the working directory to /app
WORKDIR /app

# Copy built files and other necessary artifacts from the builder stage
COPY --chown=nextuser:nextuser --from=builder /app/public ./public
COPY --chown=nextuser:nextuser --from=builder /app/.next/standalone ./
COPY --chown=nextuser:nextuser --from=builder /app/.next/static ./.next/static

# Use non-root user
USER nextuser

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

# Start the application
CMD ["dumb-init", "node", "server.js"]
