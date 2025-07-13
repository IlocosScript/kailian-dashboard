# Docker Deployment Guide

This guide explains how to deploy the Kailian Dashboard using Docker with environment variable configuration.

## Quick Start

### 1. Build the Docker Image
```bash
docker build -t kailian-dashboard .
```

### 2. Run with Default Configuration
```bash
docker run -p 9040:9040 kailian-dashboard
```

### 3. Run with Custom API URL
```bash
docker run -p 9040:9040 \
  -e NEXT_PUBLIC_API_URL=https://your-api-server.com \
  kailian-dashboard
```

### 4. Run with Environment File
Create a `.env` file:
```env
NEXT_PUBLIC_API_URL=https://your-api-server.com
NODE_ENV=production
PORT=9040
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
```

Then run:
```bash
docker run -p 9040:9040 --env-file .env kailian-dashboard
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Base URL for API endpoints | `https://alisto.gregdoesdev.xyz` | No |
| `NODE_ENV` | Node.js environment | `production` | No |
| `PORT` | Port to run the application | `9040` | No |
| `HOSTNAME` | Hostname binding | `0.0.0.0` | No |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` | No |

## Production Deployment Examples

### Using Docker Compose (Recommended)

The project includes a pre-configured `docker-compose.yml` file. Simply run:

```bash
# Build and start the application
docker compose up -d

# View logs
docker compose logs -f

# Stop the application
docker compose down
```

### Using Docker Compose with Custom Environment

Create a `.env` file to override default settings:
```env
NEXT_PUBLIC_API_URL=https://your-api-server.com
NODE_ENV=production
PORT=9040
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
```

Then run:
```bash
docker compose --env-file .env up -d
```

### Using Docker Run with Environment File
```bash
# Create environment file
cat > .env << EOF
NEXT_PUBLIC_API_URL=https://your-api-server.com
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
EOF

# Run container
docker run -d \
  --name kailian-dashboard \
  -p 9040:9040 \
  --env-file .env \
  --restart unless-stopped \
  kailian-dashboard
```

## Development

### Using Docker Compose for Development (Hot Reloading)

Use the development Docker Compose file for automatic refresh when code changes:

```bash
# Build and start development environment
docker compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker compose -f docker-compose.dev.yml up -d --build

# View development logs
docker compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker compose -f docker-compose.dev.yml down

# Rebuild if you add new dependencies
docker compose -f docker-compose.dev.yml up --build
```

**Features:**
- ✅ **Hot Reloading**: Changes to your code automatically refresh the browser
- ✅ **Volume Mounting**: Source code is mounted for real-time updates
- ✅ **Fast Refresh**: Next.js Fast Refresh enabled for React components
- ✅ **File Watching**: Optimized for Docker environment with polling
- ✅ **Development Dependencies**: All dev dependencies included

### Using Docker Run for Development

For development with hot reloading, you can mount the source code:

```bash
docker run -p 9040:9040 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NODE_ENV=development \
  -e NEXT_PUBLIC_API_URL=https://your-dev-api.com \
  kailian-dashboard
```

## Troubleshooting

### Check Container Logs
```bash
docker logs kailian-dashboard
```

### Access Container Shell
```bash
docker exec -it kailian-dashboard sh
```

### Verify Environment Variables
```bash
docker exec kailian-dashboard env | grep NEXT_PUBLIC
```

## Notes

- The `NEXT_PUBLIC_` prefix is required for environment variables to be accessible in the browser
- Environment variables are embedded at build time for Next.js applications
- To change the API URL without rebuilding, you'll need to use runtime environment variables or rebuild the image 