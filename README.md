# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1tp2QI1CnWQsCLEHcCfDVz631L-aSrWV3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

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
