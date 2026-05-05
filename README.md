## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Pages Deployment

**Prerequisites:** Git repository with GitHub Pages enabled

### Quick Deploy

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Configure GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or your deploy branch)
   - Folder: `/ (root)`

3. **Push to GitHub:**
   ```bash
   git add dist/ _config.yml
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Access your site:**
   - Visit: `https://regmishreeshesh-hub.github.io/Shreeshesh-DevOps-Profile-yaml`

### Site Configuration

The `_config.yml` file contains:
- **Title**: "Shreeshesh Regmi - DevOps Engineer"
- **Description**: "DevOps Engineer specializing in cloud infrastructure, automation, and modern deployment strategies"
- **Theme**: Jekyll minimal theme
- **SEO**: Optimized meta tags and social media

### Features

- ✅ **No CDN dependencies** - Tailwind CSS properly bundled
- ✅ **Fast loading** - Optimized build with gzip compression
- ✅ **Responsive design** - Works on all devices
- ✅ **SEO friendly** - Proper meta tags and descriptions
- ✅ **Custom favicon** - Professional branding
- ✅ **Multiple themes** - Light, Dark, and Beige options

## Deploy with Docker Compose

**Prerequisites:**
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start

1. **Build and run the application:**
   ```bash
   docker compose up -d --build
   ```

2. **Access the application:**
   - Main app: http://localhost:3000
   - With nginx proxy (optional): http://localhost:8080

3. **Stop the application:**
   ```bash
   docker compose down
   ```

### Advanced Options

**Run with nginx reverse proxy:**
```bash
docker compose --profile with-proxy up -d --build
```

**View logs:**
```bash
docker compose logs -f portfolio
```

**Rebuild without cache:**
```bash
docker compose build --no-cache
docker compose up -d
```

**Clean up completely (removes volumes):**
```bash
docker compose down -v
```

### Environment Variables

The Docker Compose setup uses production configuration by default. To customize:

1. Create a `.env` file:
   ```bash
   echo "NODE_ENV=production" > .env
   ```

2. Add your environment variables to the `.env` file

3. Restart the services:
   ```bash
   docker compose down
   docker compose up -d
   ```

## Deploy Locally to Kubernetes (Kind)

**Prerequisites:**
- [Docker](https://docs.docker.com/get-docker/)
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)

### Option 1: Automated Deployment (Recommended)

1. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

2. Run the script:
   ```bash
   ./deploy.sh
   ```

   This script automatically:
   - Checks for the `staging-cluster` Kind cluster
   - Builds the Docker image with a unique tag
   - Loads the image into the cluster
   - Applies all Kubernetes manifests
   - Waits for rollout to complete

### Option 2: Manual Steps

1. **Build the Docker image:**
   ```bash
   docker build -t shreeshesh-devops-portfolio:latest .
   ```

2. **Load image into Kind:**
   ```bash
   kind load docker-image shreeshesh-devops-portfolio:latest --name staging-cluster
   ```

3. **Apply Kubernetes manifests:**
   ```bash
   # Create namespace
   kubectl apply -f k8s/namespace.yaml

   # Apply other resources
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

4. **Port Forward to access:**
   ```bash
   kubectl port-forward svc/portfolio-service -n portfolio 30001:80
   ```
   Visit http://localhost:30001
