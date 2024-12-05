# Step 1: Use Node.js as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the standalone Next.js application
RUN npm run build

# Step 2: Prepare the production-ready container
FROM node:18-alpine AS runner

# Set the working directory inside the container
WORKDIR /app

# Copy the standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./static
COPY --from=builder /app/public ./public

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["node", "server.js"]
