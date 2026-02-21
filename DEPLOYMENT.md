# Shreeshesh DevOps Portfolio - Deployment Guide

## Overview

This is a modern DevOps portfolio website built with React, TypeScript, and Tailwind CSS. The application showcases DevOps skills, projects, and provides interactive navigation features.

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Shreeshesh-DevOps-Profile-yaml

# Start the application
docker compose up -d

# View logs
docker compose logs -f

# Stop the application
docker compose down -v
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Options

### 1. Docker Deployment

The application is containerized using Docker with Nginx as the web server.

**Dockerfile Configuration:**
- Multi-stage build for optimized image size
- Nginx serving static files
- Production-ready configuration

**Docker Compose Services:**
- `portfolio`: Main application service
- Nginx reverse proxy configuration
- Volume mounting for persistent data

### 2. Static Hosting

For static hosting platforms (Vercel, Netlify, GitHub Pages):

```bash
# Build the application
npm run build

# Deploy the dist/ folder
# The dist/ folder contains all static assets
```

### 3. Kubernetes Deployment

```yaml
# Example Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
spec:
  replicas: 3
  selector:
    matchLabels:
      app: portfolio
  template:
    metadata:
      labels:
        app: portfolio
    spec:
      containers:
      - name: portfolio
        image: shreeshesh/portfolio:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: portfolio-service
spec:
  selector:
    app: portfolio
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## Environment Variables

| Variable | Description | Default |
|-----------|-------------|----------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Application port | `3000` |

## Performance Optimization

- **Code Splitting**: Automatic with Vite
- **Image Optimization**: Lazy loading for skill icons
- **CSS Optimization**: Tailwind CSS purging in production
- **Bundle Size**: ~250KB gzipped

## Security Features

- **HTTPS Ready**: SSL/TLS configuration in Nginx
- **Security Headers**: CSP, HSTS, and other security headers
- **Input Validation**: Form sanitization and validation
- **XSS Protection**: Content Security Policy implementation

## Monitoring and Logging

### Application Monitoring

The application includes built-in monitoring features:

- **Error Tracking**: Console error logging
- **Performance Metrics**: Core Web Vitals tracking
- **User Analytics**: Click event tracking for navigation

### Docker Monitoring

```bash
# View container logs
docker compose logs portfolio

# Monitor resource usage
docker stats

# Health check
curl http://localhost:3000/health
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy Portfolio
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npm run build
      - name: Deploy to production
        run: |
          # Deployment commands here
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Docker Build Issues**
   ```bash
   # Clean build cache
   docker system prune -f
   
   # Rebuild without cache
   docker compose build --no-cache
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   chmod -R 755 dist/
   ```

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

### Backup Strategy

- **Code**: Git version control
- **Data**: Volume persistence in Docker
- **Configuration**: Environment-specific configs

## Support

For deployment issues or questions:

- 📧 Email: shreeshesh.regmi@gmail.com
- 📱 Phone: +977 9704556365
- 💼 LinkedIn: [linkedin.com/in/shreeshesh-regmi](https://linkedin.com/in/shreeshesh-regmi)
- 🐙 GitHub: [github.com/shreesheshregmi](https://github.com/shreesheshregmi)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the DevOps community**
