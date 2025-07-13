# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 9040

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9040
ENV HOSTNAME=0.0.0.0
# Default API URL - can be overridden at runtime
ENV NEXT_PUBLIC_API_URL=https://alisto.gregdoesdev.xyz

# Start the application
CMD ["npm", "start"] 