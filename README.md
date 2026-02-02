<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

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

## Kubernetes Deployment

**Prerequisites:** Docker, kubectl, kind cluster

1. Deploy to Kubernetes:
   ```bash
   ./deploy.sh
   ```

2. Access locally:
   ```bash
   kubectl port-forward service/portfolio-service 9090:80 -n portfolio
   ```
   Then visit: http://localhost:9090

3. Check deployment status:
   ```bash
   kubectl get pods -n portfolio
   kubectl get services -n portfolio
   ```

The deployment script will:
- Build the Docker image with a unique timestamp tag
- Load the image into the kind cluster
- Apply Kubernetes manifests (namespace, deployment, service)
- Wait for the deployment to be ready
