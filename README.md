
  # Tuut Mobile App Home Screen

This is a code bundle for Tuut Mobile App Home Screen. The original project is available at https://www.figma.com/design/VmDYWc3kRKq9zqxyhzD4Ut/Tuut-Mobile-App-Home-Screen.

## Development Setup

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Docker Deployment

### Quick Start
```bash
# Build and run with Docker Compose (includes reverse proxy)
docker-compose up -d

# Or build and run with Docker only
docker build -t tuut-website .
docker run -p 3000:3000 tuut-website
```

### Sitemap
The sitemap is automatically generated during Docker build and available at:
- `http://localhost:3000/sitemap.xml` (development)
- `https://tuut.com/sitemap.xml` (production)

For detailed Docker deployment instructions, see [DOCKER.md](./DOCKER.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run generate-sitemap` - Generate sitemap (development)
- `npm run generate-sitemap-docker` - Generate sitemap for Docker builds
  