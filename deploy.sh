#!/bin/bash

set -e

# Configuration
IMAGE_NAME="shreeshesh-devops-portfolio"
IMAGE_TAG=$(date +%s)
NAMESPACE="portfolio"

# Function to detect Kubernetes cluster type
detect_cluster() {
    # Check for Kind
    if command -v kind >/dev/null 2>&1 && [ "$(kind get clusters 2>/dev/null | wc -l)" -gt 0 ]; then
        echo "kind"
        return
    fi

    # Check for Minikube
    if command -v minikube >/dev/null 2>&1 && minikube status >/dev/null 2>&1; then
        echo "minikube"
        return
    fi

    # Check for K3d
    if command -v k3d >/dev/null 2>&1 && [ "$(k3d cluster list 2>/dev/null | grep -v "NAME" | wc -l)" -gt 0 ]; then
        echo "k3d"
        return
    fi

    # Check if connected to any Kubernetes cluster
    if command -v kubectl >/dev/null 2>&1 && kubectl cluster-info >/dev/null 2>&1; then
        echo "unknown"
        return
    fi

    echo "none"
}

# Function to get cluster name based on type
get_cluster_name() {
    local cluster_type="$1"

    case "$cluster_type" in
        "kind")
            local clusters=$(kind get clusters)
            if [ "$(echo "$clusters" | wc -l)" -eq 1 ]; then
                echo "$clusters"
            else
                echo "default"
            fi
            ;;
        "minikube")
            echo "$(minikube profile list | grep -E '^[*]' | awk '{print $2}')"
            ;;
        "k3d")
            local clusters=$(k3d cluster list | grep -v "NAME" | awk '{print $1}')
            if [ "$(echo "$clusters" | wc -l)" -eq 1 ]; then
                echo "$clusters"
            else
                echo "k3s-default"
            fi
            ;;
        *)
            echo "default"
            ;;
    esac
}

# Function to load image into cluster
load_image() {
    local cluster_type="$1"
    local cluster_name="$2"

    case "$cluster_type" in
        "kind")
            echo "📦 Loading image into Kind cluster"
            kind load docker-image "$IMAGE_NAME:$IMAGE_TAG" --name "$cluster_name"
            ;;
        "minikube")
            echo "📦 Loading image into Minikube cluster"
            eval $(minikube docker-env)
            docker build -t "$IMAGE_NAME:$IMAGE_TAG" .
            ;;
        "k3d")
            echo "📦 Loading image into K3d cluster"
            k3d image import "$IMAGE_NAME:$IMAGE_TAG" --cluster "$cluster_name"
            ;;
        "unknown")
            echo "⚠️  Unknown cluster type, assuming image is accessible via registry"
            ;;
    esac
}

echo "🚀 Starting deployment"

# Detect cluster type
CLUSTER_TYPE=$(detect_cluster)
if [ "$CLUSTER_TYPE" = "none" ]; then
    echo "❌ No Kubernetes cluster detected"
    echo "Please start a cluster using one of the following:"
    echo "   - kind: kind create cluster"
    echo "   - minikube: minikube start"
    echo "   - k3d: k3d cluster create"
    exit 1
fi

CLUSTER_NAME=$(get_cluster_name "$CLUSTER_TYPE")
echo "✅ Detected $CLUSTER_TYPE cluster: $CLUSTER_NAME"

# Build Docker image
echo "🔨 Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
docker build -t "$IMAGE_NAME:$IMAGE_TAG" .

# Load image into cluster
load_image "$CLUSTER_TYPE" "$CLUSTER_NAME"

# Apply Kubernetes manifests
echo "☸️  Applying Kubernetes manifests"
kubectl apply -f k8s/namespace.yaml

# Update deployment with new image tag
sed "s|image: shreeshesh-devops-portfolio:latest|image: $IMAGE_NAME:$IMAGE_TAG|g" k8s/deployment.yaml | kubectl apply -f -

kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml 2>/dev/null || true  # Optional

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/portfolio-deployment -n "$NAMESPACE"

# Get deployment status
echo "📊 Deployment status:"
kubectl get pods -n "$NAMESPACE"
kubectl get services -n "$NAMESPACE"

# Get service access information
case "$CLUSTER_TYPE" in
    "minikube")
        echo "✅ Deployment complete!"
        echo "🌐 To access the service:"
        echo "   minikube service portfolio-service -n $NAMESPACE"
        ;;
    "kind")
        SERVICE_IP=$(kubectl get service portfolio-service -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}')
        echo "✅ Deployment complete!"
        echo "🌐 Service available at: http://$SERVICE_IP"
        echo "💡 To access locally, run:"
        echo "   kubectl port-forward service/portfolio-service 9090:80 -n $NAMESPACE --address 0.0.0.0"
        echo "   Then visit: http://localhost:9090"
        ;;
    "k3d")
        SERVICE_IP=$(kubectl get service portfolio-service -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}')
        echo "✅ Deployment complete!"
        echo "🌐 Service available at: http://$SERVICE_IP"
        echo "💡 To access locally, run:"
        echo "   kubectl port-forward service/portfolio-service 9090:80 -n $NAMESPACE --address 0.0.0.0"
        echo "   Then visit: http://localhost:9090"
        ;;
    "unknown")
        echo "✅ Deployment complete!"
        SERVICE_IP=$(kubectl get service portfolio-service -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}')
        echo "🌐 Service available at: http://$SERVICE_IP"
        ;;
esac
