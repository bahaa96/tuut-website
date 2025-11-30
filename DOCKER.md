# Docker Deployment for Tuut Website

This document explains how to build and deploy the Tuut website using Docker, with integrated sitemap generation.

## Overview

The Docker image includes:
- Next.js application
- Automatic sitemap generation during build
- Optimized production setup
- Sitemap served directly from the container at `/sitemap.xml`

## Building the Docker Image

### Prerequisites
- Docker installed on your system
- Docker Compose (for the full setup)

### Build Command
```bash
# Build the image
docker build -t tuut-website .

# Or use docker-compose
docker-compose build
```

## Running the Application

### Option 1: Docker Compose (Recommended)
```bash
# Start with reverse proxy and SSL
docker-compose up -d

# View logs
docker-compose logs -f tuut-app

# Stop
docker-compose down
```

### Option 2: Docker Standalone
```bash
# Run the container
docker run -p 3000:3000 -e VITE_APP_URL=https://tuut.com tuut-website
```

## Environment Variables

- `NODE_ENV`: Set to `production` automatically
- `VITE_APP_URL`: Base URL for the website (default: `https://tuut.com`)

## Sitemap Generation

The sitemap is automatically generated during the Docker build process:

1. **Data Fetching**: The Docker build fetches all deals, stores, products, and guides from Supabase
2. **Sitemap Generation**: Creates a comprehensive sitemap with all locales and dynamic content
3. **Static Serving**: The generated sitemap is served from `/sitemap.xml`

### Sitemap Contents
- Static pages for all supported locales (en-*, ar-*)
- Dynamic deal pages with country-specific routing
- Dynamic store pages with country-specific routing
- Product pages for all locales
- Guide/article pages for all locales

### Accessing the Sitemap
Once running, the sitemap is available at:
- `http://localhost:3000/sitemap.xml` (development)
- `https://tuut.com/sitemap.xml` (production)

## Build Process

The Docker build follows these steps:

1. **Dependencies Stage**: Install production dependencies
2. **Sitemap Generation**: Generate sitemap.xml from Supabase data
3. **Application Build**: Build the Next.js application
4. **Production Stage**: Copy built files and prepare for runtime

## Health Check

The application includes a health check endpoint:
- Endpoint: `/api/health`
- Used by Docker for container health monitoring

## CDN Considerations

The sitemap is now served directly from the application container, eliminating the need for:
- External CDN repositories
- Git LFS for large files
- Separate upload processes

This approach provides:
- Faster builds (no external dependencies)
- Simpler deployment pipeline
- Better reliability (no external service dependencies)
- Automatic updates with each deployment

## Troubleshooting

### Sitemap Not Found
If the sitemap is not accessible:
1. Check that the build completed successfully
2. Verify the sitemap was generated in the build logs
3. Ensure the container is running properly

### Build Failures
Common issues:
- Network connectivity to Supabase during build
- Insufficient memory for sitemap generation
- Timeout during data fetching

### Performance Tips
- Use a `.dockerignore` file to exclude unnecessary files
- Consider multi-stage builds for smaller images
- Use appropriate resource limits in production

## Deployment Example

```bash
# Production deployment with environment variables
docker run -d \
  --name tuut-website \
  -p 3000:3000 \
  -e VITE_APP_URL=https://tuut.com \
  --restart unless-stopped \
  tuut-website
```

## Monitoring

Monitor the application health:
```bash
# Check container status
docker ps

# View logs
docker logs tuut-website

# Check health status
docker inspect tuut-website | grep Health -A 10
```