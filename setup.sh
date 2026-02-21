#!/bin/bash

# Kubernetes Deployment Automator - Setup Script
# This script sets up the k8s-deploy.py tool for easy usage

set -e

echo "🚀 Setting up Kubernetes Deployment Automator..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.7+ and try again."
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is required but not installed."
    echo "Please install kubectl and try again."
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ git is required but not installed."
    echo "Please install git and try again."
    exit 1
fi

# Make the script executable
chmod +x k8s-deploy.py

# Create a symbolic link for easy access
if [ ! -L /usr/local/bin/k8s-deploy ]; then
    sudo ln -s "$(pwd)/k8s-deploy.py" /usr/local/bin/k8s-deploy
    echo "✅ Created symbolic link: /usr/local/bin/k8s-deploy"
fi

echo "✅ Setup completed successfully!"
echo ""
echo "📖 Usage Examples:"
echo "  # Interactive mode"
echo "  k8s-deploy"
echo ""
echo "  # Command line mode with auto-detection"
echo "  k8s-deploy --repo https://github.com/user/repo.git --auto-detect"
echo ""
echo "  # Command line mode with specific cluster"
echo "  k8s-deploy --repo https://github.com/user/repo.git --branch main --cluster kind"
echo ""
echo "  # With private repository"
echo "  k8s-deploy --repo https://github.com/user/private-repo.git --token YOUR_TOKEN --auto-detect"
echo ""
echo "🔧 Prerequisites:"
echo "  - Kubernetes cluster running (Kind, Minikube, or K3d)"
echo "  - Docker installed and running"
echo "  - kubectl configured to connect to your cluster"
echo ""
echo "🔍 Auto-Detection Features:"
echo "  - Automatically detects Kind, Minikube, or K3d clusters"
echo "  - Switches to detected cluster type automatically"
echo "  - Builds Docker images before loading into cluster"
echo ""
echo "📚 For more help, run:"
echo "  k8s-deploy --help"
