#!/bin/bash

set -e

# Configuration
CLUSTER_NAME="staging-cluster"
IMAGE_NAME="shreeshesh-devops-portfolio"
IMAGE_TAG=$(date +%s)
NAMESPACE="portfolio"

echo "🚀 Starting deployment to kind cluster: $CLUSTER_NAME"

# Check if kind cluster exists
if ! kind get clusters | grep -q "$CLUSTER_NAME"; then
    echo "❌ Kind cluster '$CLUSTER_NAME' not found"
    echo "Available clusters:"
    kind get clusters
    exit 1
fi

# Build Docker image
echo "🔨 Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
docker build -t "$IMAGE_NAME:$IMAGE_TAG" .

# Load image into kind cluster
echo "📦 Loading image into kind cluster"
kind load docker-image "$IMAGE_NAME:$IMAGE_TAG" --name "$CLUSTER_NAME"

# Apply Kubernetes manifests
echo "☸️  Applying Kubernetes manifests"
kubectl apply -f k8s/namespace.yaml

# Update deployment with new image tag
sed "s|image: shreeshesh-devops-portfolio:latest|image: $IMAGE_NAME:$IMAGE_TAG|g" k8s/deployment.yaml | kubectl apply -f -

kubectl apply -f k8s/service.yaml

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/portfolio-deployment -n "$NAMESPACE"

# Get deployment status
echo "📊 Deployment status:"
kubectl get pods -n "$NAMESPACE"
kubectl get services -n "$NAMESPACE"

# Get cluster IP for the service
SERVICE_IP=$(kubectl get service portfolio-service -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}')
echo "✅ Deployment complete!"
echo "🌐 Service available at: http://$SERVICE_IP"

# Optional: Port forward for local testing
echo "💡 To access locally, run:"
echo "   kubectl port-forward service/portfolio-service 9090:80 -n $NAMESPACE --address 0.0.0.0"
echo "   Then visit: http://localhost:9090"