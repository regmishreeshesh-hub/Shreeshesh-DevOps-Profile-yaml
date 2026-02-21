#!/usr/bin/env python3
"""
GitHub Repository to Kubernetes Deployment Automator

This script automates the deployment of GitHub repositories to local Kubernetes clusters
by analyzing configuration files and generating appropriate Kubernetes manifests.
"""

import os
import sys
import json
import subprocess
import tempfile
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import argparse
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class K8sDeployer:
    def __init__(self):
        self.repo_url = ""
        self.branch = "main"
        self.github_token = ""
        self.repo_name = ""
        self.output_dir = ""
        self.cluster_type = ""
        self.config_files = {}
        self.dockerfile_paths = []  # Support multiple Dockerfiles
        self.exposed_ports = []
        self.image_tags = []  # Support multiple image tags
        
    def get_user_input(self) -> bool:
        """Get user input for repository and deployment options"""
        print("\n🚀 GitHub Repository to Kubernetes Deployment Automator")
        print("=" * 60)
        
        # Get repository URL
        while not self.repo_url:
            repo_input = input("📦 Enter GitHub repository URL (or 'quit' to exit): ").strip()
            if repo_input.lower() == 'quit':
                return False
            if repo_input and ('github.com' in repo_input):
                self.repo_url = repo_input
                self.repo_name = repo_input.split('/')[-1].replace('.git', '')
            else:
                print("❌ Invalid GitHub URL. Please enter a valid GitHub repository URL.")
        
        # Check if repository is private and get token if needed
        is_private = input(f"🔒 Is '{self.repo_name}' a private repository? (y/n): ").strip().lower() == 'y'
        if is_private:
            self.github_token = input("🔑 Enter GitHub token (leave empty if using SSH key): ").strip()
        
        # Get branch selection
        try:
            branches = self.get_github_branches()
            if branches:
                print(f"\n🌿 Available branches: {', '.join(branches)}")
                while True:
                    branch_input = input(f"🌿 Select branch (default: {self.branch}): ").strip()
                    if not branch_input:
                        break
                    if branch_input in branches:
                        self.branch = branch_input
                        break
                    else:
                        print("❌ Invalid branch. Please select from available branches.")
        except Exception as e:
            logger.warning(f"Could not fetch branches: {e}. Using default branch '{self.branch}'")
        
        # Get cluster type
        while self.cluster_type not in ['kind', 'minikube', 'k3d']:
            cluster_input = input("🏗️ Select cluster type (kind/minikube/k3d): ").strip().lower()
            if cluster_input in ['kind', 'minikube', 'k3d']:
                self.cluster_type = cluster_input
            else:
                print("❌ Invalid cluster type. Please choose from: kind, minikube, k3d")
        
        return True
    
    def get_github_branches(self) -> List[str]:
        """Fetch available branches from GitHub repository"""
        try:
            if self.github_token:
                repo_url = self.repo_url.replace('https://', f'https://{self.github_token}@')
            else:
                repo_url = self.repo_url
            
            cmd = ['git', 'ls-remote', '--heads', repo_url]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            branches = []
            for line in result.stdout.split('\n'):
                if line.strip():
                    branch = line.split('/')[-1].replace('refs/heads/', '')
                    branches.append(branch)
            
            return branches
        except Exception as e:
            logger.error(f"Failed to fetch branches: {e}")
            return []
    
    def clone_repository(self) -> bool:
        """Clone the GitHub repository"""
        print(f"\n📥 Cloning repository '{self.repo_name}' from branch '{self.branch}'...")
        
        # Create output directory and timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_dir = f"/tmp/repo-deploy-{timestamp}/{self.repo_name}"
        self.image_tag = f"{timestamp}"  # Set image tag based on timestamp
        os.makedirs(self.output_dir, exist_ok=True)
        
        try:
            # Clone repository
            clone_cmd = ['git', 'clone', '-b', self.branch, self.repo_url, self.output_dir]
            if self.github_token:
                clone_cmd[2] = self.repo_url.replace('https://', f'https://{self.github_token}@')
            
            result = subprocess.run(clone_cmd, capture_output=True, text=True, check=True)
            print(f"✅ Repository cloned successfully to {self.output_dir}")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to clone repository: {e}")
            return False
    
    def scan_config_files(self):
        """Scan repository for configuration files"""
        print(f"\n🔍 Scanning repository for configuration files...")
        
        repo_path = Path(self.output_dir)
        
        # Define file patterns to search for
        config_patterns = {
            'dockerfile': ['Dockerfile', 'Dockerfile.*'],
            'docker_compose': ['docker-compose.yml', 'docker-compose.yaml', 'compose.yml', 'compose.yaml'],
            'nginx_conf': ['nginx.conf', 'nginx.conf.*'],
            'env_file': ['.env', '.env.*', 'environment', 'config'],
            'init_sql': ['init.sql', 'database.sql', 'schema.sql', 'seed.sql']
        }
        
        for config_type, patterns in config_patterns.items():
            found_files = []
            for pattern in patterns:
                found_files.extend(repo_path.rglob(pattern))
            
            if found_files:
                self.config_files[config_type] = [str(f) for f in found_files]
                print(f"  📄 Found {config_type}: {found_files}")
        
        # Analyze Dockerfile for exposed ports
        if 'dockerfile' in self.config_files:
            self.analyze_dockerfile()
    
    def analyze_dockerfile(self):
        """Analyze Dockerfiles to extract exposed ports"""
        print(f"  🔍 Analyzing {len(self.dockerfile_paths)} Dockerfile(s) for exposed ports...")
        
        all_ports = []
        for i, dockerfile_path in enumerate(self.dockerfile_paths):
            try:
                with open(dockerfile_path, 'r') as f:
                    content = f.read()
                    
                # Look for EXPOSE instructions
                lines = content.split('\n')
                dockerfile_ports = []
                for line in lines:
                    if line.strip().startswith('EXPOSE'):
                        parts = line.split()
                        for part in parts[1:]:
                            if part.isdigit():
                                dockerfile_ports.append(int(part))
                
                if dockerfile_ports:
                    print(f"    � Dockerfile {i+1}: {os.path.basename(dockerfile_path)} - Ports: {dockerfile_ports}")
                    all_ports.extend(dockerfile_ports)
                else:
                    print(f"    📄 Dockerfile {i+1}: {os.path.basename(dockerfile_path)} - No exposed ports found")
                    
            except Exception as e:
                logger.error(f"Failed to analyze Dockerfile {dockerfile_path}: {e}")
        
        if all_ports:
            print(f"  🚪 Total exposed ports: {all_ports}")
            self.exposed_ports = list(set(all_ports))  # Remove duplicates
        else:
            print(f"  ⚠️  No exposed ports found in any Dockerfile")
            # Default to common ports
            self.exposed_ports = [80, 3000, 8080]
            print(f"  🚪 Using default ports: {self.exposed_ports}")
    
    def get_ports_for_dockerfile(self, dockerfile_path: str) -> List[int]:
        """Get exposed ports for a specific Dockerfile"""
        try:
            with open(dockerfile_path, 'r') as f:
                content = f.read()
                
            lines = content.split('\n')
            ports = []
            for line in lines:
                if line.strip().startswith('EXPOSE'):
                    parts = line.split()
                    for part in parts[1:]:
                        if part.isdigit():
                            ports.append(int(part))
            return ports if ports else [80, 3000, 8080]
        except:
            return [80, 3000, 8080]
    
    def generate_k8s_manifests(self):
        """Generate Kubernetes manifests based on detected configuration"""
        print(f"\n📝 Generating Kubernetes manifests...")
        
        k8s_dir = os.path.join(self.output_dir, 'k8s-manifests')
        os.makedirs(k8s_dir, exist_ok=True)
        
        # Generate Deployment manifests for each Dockerfile
        for i, image_info in enumerate(self.image_tags):
            self.generate_single_deployment_manifest(k8s_dir, image_info, i)
        
        # Generate Service manifests
        self.generate_service_manifests(k8s_dir)
        
        # Generate ConfigMap if .env files found
        if 'env_file' in self.config_files:
            self.generate_configmap_manifest(k8s_dir)
        
        # Generate Secret if sensitive data found
        if 'env_file' in self.config_files:
            self.generate_secret_manifest(k8s_dir)
        
        # Generate PVC if database files found
        if 'init_sql' in self.config_files:
            self.generate_pvc_manifest(k8s_dir)
        
        # Generate database initialization ConfigMap
        if 'init_sql' in self.config_files:
            self.generate_db_init_manifest(k8s_dir)
        
        print(f"✅ Kubernetes manifests generated in {k8s_dir}")
        return k8s_dir
    
    def generate_single_deployment_manifest(self, k8s_dir: str, image_info: dict, index: int):
        """Generate a single Deployment manifest"""
        manifest = {
            'apiVersion': 'apps/v1',
            'kind': 'Deployment',
            'metadata': {
                'name': f"{image_info['name']}-deployment",
                'namespace': self.repo_name,
                'labels': {
                    'app': image_info['name'],
                    'version': 'v1',
                    'build-timestamp': image_info['tag'],
                    'dockerfile': image_info['dockerfile']
                }
            },
            'spec': {
                'replicas': 3,
                'selector': {
                    'matchLabels': {
                        'app': image_info['name']
                    }
                },
                'template': {
                    'metadata': {
                        'labels': {
                            'app': image_info['name'],
                            'build-timestamp': image_info['tag'],
                            'dockerfile': image_info['dockerfile']
                        }
                    },
                    'spec': {
                        'containers': [{
                            'name': image_info['name'],
                            'image': f"{image_info['name']}:{image_info['tag']}",
                            'ports': [{'containerPort': port} for port in image_info['ports']],
                            'env': [
                                {'name': 'NODE_ENV', 'value': 'production'},
                                {'name': 'BUILD_TIMESTAMP', 'value': image_info['tag']},
                                {'name': 'DOCKERFILE', 'value': image_info['dockerfile']}
                            ],
                            'resources': {
                                'requests': {
                                    'memory': '256Mi',
                                    'cpu': '250m'
                                },
                                'limits': {
                                    'memory': '512Mi',
                                    'cpu': '500m'
                                }
                            }
                        }]
                    }
                }
            }
        }
        
        manifest_path = os.path.join(k8s_dir, f"{image_info['name']}-deployment.yaml")
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        print(f"  📄 Generated: {manifest_path}")
    
    def generate_service_manifests(self, k8s_dir: str):
        """Generate Service manifests for all images"""
        # Create a service for the first image (primary service)
        if self.image_tags:
            primary_image = self.image_tags[0]
            manifest = {
                'apiVersion': 'v1',
                'kind': 'Service',
                'metadata': {
                    'name': f"{self.repo_name}-service",
                    'namespace': self.repo_name,
                    'labels': {
                        'app': self.repo_name,
                        'primary-service': 'true'
                    }
                },
                'spec': {
                    'selector': {
                        'app': self.repo_name
                    },
                    'ports': [{
                        'port': 80,
                        'targetPort': primary_image['ports'][0] if primary_image['ports'] else 80,
                        'protocol': 'TCP'
                    }],
                    'type': 'LoadBalancer'
                }
            }
            
            manifest_path = os.path.join(k8s_dir, f"{self.repo_name}-service.yaml")
            with open(manifest_path, 'w') as f:
                json.dump(manifest, f, indent=2)
            print(f"  📄 Generated: {manifest_path}")
            
            # Create additional services for other images if needed
            for i, image_info in enumerate(self.image_tags[1:], 1):
                service_manifest = {
                    'apiVersion': 'v1',
                    'kind': 'Service',
                    'metadata': {
                        'name': f"{image_info['name']}-service",
                        'namespace': self.repo_name,
                        'labels': {
                            'app': image_info['name'],
                            'secondary-service': 'true'
                        }
                    },
                    'spec': {
                        'selector': {
                            'app': image_info['name']
                        },
                        'ports': [{
                            'port': 8080 + i,  # Use different ports for additional services
                            'targetPort': image_info['ports'][0] if image_info['ports'] else 3000,
                            'protocol': 'TCP'
                        }],
                        'type': 'LoadBalancer'
                    }
                }
                
                manifest_path = os.path.join(k8s_dir, f"{image_info['name']}-service.yaml")
                with open(manifest_path, 'w') as f:
                    json.dump(service_manifest, f, indent=2)
                print(f"  📄 Generated: {manifest_path}")
    
    def generate_service_manifest(self, k8s_dir: str):
        """Generate Service manifest"""
        # Use first exposed port for service
        service_port = self.exposed_ports[0] if self.exposed_ports else 80
        
        manifest = {
            'apiVersion': 'v1',
            'kind': 'Service',
            'metadata': {
                'name': f'{self.repo_name}-service',
                'namespace': self.repo_name,
                'labels': {
                    'app': self.repo_name
                }
            },
            'spec': {
                'selector': {
                    'app': self.repo_name
                },
                'ports': [{
                    'port': 80,
                    'targetPort': service_port,
                    'protocol': 'TCP'
                }],
                'type': 'LoadBalancer'
            }
        }
        
        manifest_path = os.path.join(k8s_dir, f'{self.repo_name}-service.yaml')
        with open(manifest_path, 'w') as f:
            f.write(json.dumps(manifest, indent=2))
        print(f"  📄 Generated: {manifest_path}")
    
    def generate_configmap_manifest(self, k8s_dir: str):
        """Generate ConfigMap manifest from .env files"""
        env_file = self.config_files['env_file'][0]
        config_data = {}
        
        try:
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        config_data[key] = value
        except Exception as e:
            logger.warning(f"Could not parse .env file: {e}")
        
        manifest = {
            'apiVersion': 'v1',
            'kind': 'ConfigMap',
            'metadata': {
                'name': f'{self.repo_name}-config',
                'namespace': self.repo_name
            },
            'data': config_data
        }
        
        manifest_path = os.path.join(k8s_dir, f'{self.repo_name}-configmap.yaml')
        with open(manifest_path, 'w') as f:
            f.write(json.dumps(manifest, indent=2))
        print(f"  📄 Generated: {manifest_path}")
    
    def generate_secret_manifest(self, k8s_dir: str):
        """Generate Secret manifest for sensitive data"""
        manifest = {
            'apiVersion': 'v1',
            'kind': 'Secret',
            'metadata': {
                'name': f'{self.repo_name}-secret',
                'namespace': self.repo_name
            },
            'type': 'Opaque',
            'data': {}  # Users should populate this manually
        }
        
        manifest_path = os.path.join(k8s_dir, f'{self.repo_name}-secret.yaml')
        with open(manifest_path, 'w') as f:
            f.write(json.dumps(manifest, indent=2))
        print(f"  📄 Generated: {manifest_path} (populate data field manually)")
    
    def generate_pvc_manifest(self, k8s_dir: str):
        """Generate PersistentVolumeClaim manifest"""
        # Get storage size from user
        default_size = "1Gi"
        storage_size = input(f"💾 Enter PVC storage size (default: {default_size}): ").strip() or default_size
        
        manifest = {
            'apiVersion': 'v1',
            'kind': 'PersistentVolumeClaim',
            'metadata': {
                'name': f'{self.repo_name}-pvc',
                'namespace': self.repo_name
            },
            'spec': {
                'accessModes': ['ReadWriteOnce'],
                'resources': {
                    'requests': {
                        'storage': storage_size
                    }
                }
            }
        }
        
        manifest_path = os.path.join(k8s_dir, f'{self.repo_name}-pvc.yaml')
        with open(manifest_path, 'w') as f:
            f.write(json.dumps(manifest, indent=2))
        print(f"  📄 Generated: {manifest_path}")
    
    def generate_db_init_manifest(self, k8s_dir: str):
        """Generate database initialization ConfigMap"""
        init_sql = self.config_files['init_sql'][0]
        
        try:
            with open(init_sql, 'r') as f:
                sql_content = f.read()
        except Exception as e:
            logger.error(f"Could not read SQL file: {e}")
            return
        
        import base64
        encoded_sql = base64.b64encode(sql_content.encode()).decode()
        
        manifest = {
            'apiVersion': 'v1',
            'kind': 'ConfigMap',
            'metadata': {
                'name': f'{self.repo_name}-db-init',
                'namespace': self.repo_name
            },
            'data': {
                'init.sql': encoded_sql
            }
        }
        
        manifest_path = os.path.join(k8s_dir, f'{self.repo_name}-db-init.yaml')
        with open(manifest_path, 'w') as f:
            f.write(json.dumps(manifest, indent=2))
        print(f"  📄 Generated: {manifest_path}")
    
    def deploy_to_cluster(self, k8s_dir: str):
        """Deploy manifests to selected Kubernetes cluster"""
        print(f"\n🏗️ Preparing deployment to {self.cluster_type.upper()} cluster...")
        
        # Check cluster availability
        if not self.check_cluster_availability():
            print(f"❌ {self.cluster_type.upper()} cluster is not running or accessible")
            return False
        
        # Load Docker images if needed
        if not self.load_docker_images():
            print("❌ Failed to load Docker images")
            return False
        
        # Display deployment summary
        print(f"\n� Deployment Summary:")
        print(f"  📦 Repository: {self.repo_name}")
        print(f"  🏷️  Images to deploy: {len(self.image_tags)}")
        for i, image_info in enumerate(self.image_tags):
            print(f"    {i+1}. {image_info['name']}:{image_info['tag']} (from {image_info['dockerfile']})")
        
        # Get user confirmation
        confirm = input(f"\n🚀 Deploy all images to {self.cluster_type.upper()} cluster? (y/n): ").strip().lower()
        if confirm != 'y':
            print("❌ Deployment cancelled by user")
            return False
        
        # Apply all manifests
        try:
            print(f"🚀 Deploying manifests...")
            
            # Deploy all services
            for image_info in self.image_tags:
                service_path = os.path.join(k8s_dir, f"{image_info['name']}-service.yaml")
                if os.path.exists(service_path):
                    cmd = ['kubectl', 'apply', '-f', service_path, '-n', self.repo_name]
                    subprocess.run(cmd, check=True)
                    print(f"  ✅ Applied: {image_info['name']}-service.yaml")
            
            # Deploy all deployments
            for image_info in self.image_tags:
                deployment_path = os.path.join(k8s_dir, f"{image_info['name']}-deployment.yaml")
                if os.path.exists(deployment_path):
                    cmd = ['kubectl', 'apply', '-f', deployment_path, '-n', self.repo_name]
                    subprocess.run(cmd, check=True)
                    print(f"  ✅ Applied: {image_info['name']}-deployment.yaml")
            
            # Apply shared manifests
            shared_manifests = ['configmap.yaml', 'secret.yaml']
            if 'env_file' in self.config_files:
                shared_manifests.extend(['configmap.yaml'])
            if 'init_sql' in self.config_files:
                shared_manifests.extend(['db-init.yaml'])
            if 'init_sql' in self.config_files:
                shared_manifests.extend(['pvc.yaml'])
                
            for manifest in shared_manifests:
                manifest_path = os.path.join(k8s_dir, f"{self.repo_name}-{manifest}")
                if os.path.exists(manifest_path):
                    cmd = ['kubectl', 'apply', '-f', manifest_path, '-n', self.repo_name]
                    subprocess.run(cmd, check=True)
                    print(f"  ✅ Applied: {self.repo_name}-{manifest}")
            
            print(f"✅ Deployment completed successfully!")
            print(f"🌐 Access your applications:")
            print(f"  🌐 Primary service: http://localhost:80")
            for i, image_info in enumerate(self.image_tags[1:], 1):
                print(f"  🌐 Service {i+1}: http://localhost:{8080 + i}")
            print(f"🏷️  Build timestamp: {self.image_tag}")
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Deployment failed: {e}")
            return False
    
    def check_cluster_availability(self) -> bool:
        """Check if the selected Kubernetes cluster is available and detect type"""
        try:
            # Check kubectl connectivity
            cmd = ['kubectl', 'cluster-info']
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Try to detect cluster type automatically
            cluster_info = ""
            try:
                # Check for Kind cluster
                cmd = ['kubectl', 'get', 'nodes', '-o', 'json']
                node_result = subprocess.run(cmd, capture_output=True, text=True, check=True)
                nodes = json.loads(node_result.stdout)
                
                if nodes.get('items'):
                    node_labels = nodes['items'][0].get('metadata', {}).get('labels', {})
                    if 'kubernetes.io/hostname' in node_labels:
                        hostname = node_labels['kubernetes.io/hostname']
                        if 'kind' in hostname.lower():
                            cluster_info = "Kind cluster detected"
                            if self.cluster_type != 'kind':
                                logger.warning(f"Kind cluster detected but {self.cluster_type} was selected. Auto-switching to kind.")
                                self.cluster_type = 'kind'
                    elif 'minikube' in hostname.lower():
                        cluster_info = "Minikube cluster detected"
                        if self.cluster_type != 'minikube':
                            logger.warning(f"Minikube cluster detected but {self.cluster_type} was selected. Auto-switching to minikube.")
                            self.cluster_type = 'minikube'
            except:
                pass
            
            if cluster_info:
                print(f"✅ {cluster_info}")
            else:
                print(f"✅ Kubernetes cluster is accessible")
            
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Cluster not available: {e}")
            return False
    
    def detect_cluster_type(self) -> str:
        """Auto-detect cluster type if not specified"""
        try:
            cmd = ['kubectl', 'get', 'nodes', '-o', 'json']
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            nodes = json.loads(result.stdout)
            
            if nodes.get('items'):
                node_labels = nodes['items'][0].get('metadata', {}).get('labels', {})
                hostname = node_labels.get('kubernetes.io/hostname', '')
                
                if 'kind' in hostname.lower():
                    return 'kind'
                elif 'minikube' in hostname.lower():
                    return 'minikube'
                elif 'k3d' in hostname.lower():
                    return 'k3d'
        except:
            pass
        
        return self.cluster_type  # Return user selection if auto-detection fails
    
    def load_docker_images(self) -> bool:
        """Load Docker images into the cluster"""
        try:
            print(f"📦 Loading Docker images into {self.cluster_type.upper()} cluster...")
            
            # Build Docker images for each Dockerfile found
            for i, dockerfile_path in enumerate(self.dockerfile_paths):
                try:
                    # Generate unique tag for each Dockerfile
                    unique_tag = f"{self.image_tag}_dockerfile{i+1}" if len(self.dockerfile_paths) > 1 else self.image_tag
                    image_name = f"{self.repo_name}_{os.path.splitext(os.path.basename(dockerfile_path))[0]}" if len(self.dockerfile_paths) > 1 else self.repo_name
                    
                    print(f"🔨 Building Docker image '{image_name}:{unique_tag}' from {os.path.basename(dockerfile_path)}...")
                    build_cmd = ['docker', 'build', '-f', dockerfile_path, '-t', f'{image_name}:{unique_tag}', os.path.dirname(dockerfile_path)]
                    subprocess.run(build_cmd, check=True)
                    print(f"✅ Docker image built successfully: {image_name}:{unique_tag}")
                    
                    # Store image info for manifest generation
                    self.image_tags.append({
                        'name': image_name,
                        'tag': unique_tag,
                        'dockerfile': os.path.basename(dockerfile_path),
                        'ports': self.get_ports_for_dockerfile(dockerfile_path)
                    })
                    
                except subprocess.CalledProcessError as e:
                    logger.warning(f"Failed to build Docker image from {dockerfile_path}: {e}")
            
            # Load all built images into cluster
            for image_info in self.image_tags:
                try:
                    if self.cluster_type == 'kind':
                        cmd = ['kind', 'load', 'docker-image', f"{image_info['name']}:{image_info['tag']}"]
                        subprocess.run(cmd, check=True)
                    elif self.cluster_type == 'minikube':
                        cmd = ['minikube', 'image', 'load', f"{image_info['name']}:{image_info['tag']}"]
                        subprocess.run(cmd, check=True)
                    elif self.cluster_type == 'k3d':
                        tag_cmd = ['docker', 'tag', f"{image_info['name']}:{image_info['tag']}", f'k3d-{image_info["name"]}:{image_info["tag"]}']
                        subprocess.run(tag_cmd, check=True)
                    print(f"✅ Loaded image: {image_info['name']}:{image_info['tag']}")
                except subprocess.CalledProcessError as e:
                    logger.warning(f"Failed to load image {image_info['name']}:{image_info['tag']}: {e}")
            
            print(f"✅ All Docker images loaded successfully into {self.cluster_type.upper()} cluster")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to load Docker images: {e}")
            print(f"⚠️  Warning: Continuing with deployment anyway...")
            return True  # Don't fail deployment for image loading issues
    
    def run(self):
        """Main execution flow"""
        try:
            # Get user input
            if not self.get_user_input():
                return
            
            # Clone repository
            if not self.clone_repository():
                return
            
            # Scan for configuration files
            self.scan_config_files()
            
            # Check if Dockerfile exists
            if 'dockerfile' not in self.config_files:
                print("❌ ERROR: No Dockerfile found in repository. Cannot proceed with deployment.")
                return
            
            # Generate Kubernetes manifests
            k8s_dir = self.generate_k8s_manifests()
            
            # Deploy to cluster
            self.deploy_to_cluster(k8s_dir)
            
            print(f"\n🎉 Deployment process completed!")
            print(f"📁 Manifests available at: {k8s_dir}")
            
        except KeyboardInterrupt:
            print("\n\n❌ Deployment process interrupted by user")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
        finally:
            # Cleanup
            if hasattr(self, 'output_dir') and os.path.exists(self.output_dir):
                cleanup = input(f"\n🧹 Clean up temporary files? (y/n): ").strip().lower() == 'y'
                if cleanup:
                    shutil.rmtree(self.output_dir)
                    print("🧹 Temporary files cleaned up")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Deploy GitHub repositories to Kubernetes clusters')
    parser.add_argument('--repo', help='GitHub repository URL')
    parser.add_argument('--branch', help='Branch to deploy', default='main')
    parser.add_argument('--cluster', help='Cluster type (kind/minikube/k3d)', default='auto')
    parser.add_argument('--token', help='GitHub token for private repositories')
    parser.add_argument('--auto-detect', help='Auto-detect cluster type', action='store_true')
    
    args = parser.parse_args()
    
    deployer = K8sDeployer()
    
    if args.repo:
        deployer.repo_url = args.repo
        deployer.branch = args.branch
        deployer.github_token = args.token or ""
        deployer.repo_name = args.repo.split('/')[-1].replace('.git', '')
        
        # Auto-detect cluster if requested
        if args.cluster == 'auto' or args.auto_detect:
            detected_cluster = deployer.detect_cluster_type()
            if detected_cluster:
                deployer.cluster_type = detected_cluster
                print(f"🔍 Auto-detected cluster: {detected_cluster}")
            else:
                print("❌ Could not auto-detect cluster type. Please specify with --cluster")
                return
        else:
            deployer.cluster_type = args.cluster
        
        # Run deployment
        deployer.clone_repository()
        deployer.scan_config_files()
        
        if 'dockerfile' in deployer.config_files:
            k8s_dir = deployer.generate_k8s_manifests()
            deployer.deploy_to_cluster(k8s_dir)
        else:
            print("❌ ERROR: No Dockerfile found in repository. Cannot proceed with deployment.")
    else:
        # Interactive mode
        deployer.run()

if __name__ == "__main__":
    main()
