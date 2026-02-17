#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Function to prompt for input
prompt() {
    local prompt_msg="$1"
    local default_val="$2"
    local input_val

    if [ -n "$default_val" ]; then
        read -p "$prompt_msg [$default_val]: " input_val
        echo "${input_val:-$default_val}"
    else
        while [ -z "$input_val" ]; do
            read -p "$prompt_msg: " input_val
        done
        echo "$input_val"
    fi
}

# Function to generate random 5-digit tag
generate_random_tag() {
    echo $((10000 + RANDOM % 90000))
}

# Function to validate GitHub URL
validate_github_url() {
    local url="$1"
    if [[ "$url" =~ ^https://github.com/[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+(\.git)?$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to extract repository name from URL
get_repo_name() {
    local url="$1"
    local repo_name=$(basename "$url" .git)
    echo "$repo_name"
}

# Function to extract exposed port from Dockerfile
get_exposed_port() {
    local dockerfile="$1"
    local port=$(grep -E '^EXPOSE ' "$dockerfile" | awk '{print $2}' | head -1)
    echo "${port:-80}"
}

# Function to create Kubernetes namespace
create_namespace() {
    local namespace="$1"
    log_info "Creating namespace: $namespace"
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: $namespace
  labels:
    name: $namespace
    app: $namespace
EOF
}

# Function to create ConfigMap from .env file
create_configmap() {
    local namespace="$1"
    local app_name="$2"
    local env_file="$3"
    local configmap_name="${app_name}-config"
    
    log_info "Creating ConfigMap: $configmap_name"
    
    # Extract environment variables from .env file
    local config_data=""
    while IFS= read -r line; do
        if [[ "$line" =~ ^[a-zA-Z_][a-zA-Z0-9_]*= ]]; then
            local key=$(echo "$line" | cut -d= -f1)
            local value=$(echo "$line" | cut -d= -f2-)
            config_data+="  $key: \"$value\"\n"
        fi
    done < "$env_file"
    
    cat <<EOF > "manifests-k8s/${app_name}-configmap.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: $configmap_name
  namespace: $namespace
  labels:
    app: $app_name
data:
${config_data}
EOF
    
    kubectl apply -f "manifests-k8s/${app_name}-configmap.yaml"
}

# Function to create Secret from .env file
create_secret() {
    local namespace="$1"
    local app_name="$2"
    local env_file="$3"
    local secret_name="${app_name}-secret"
    
    log_info "Creating Secret: $secret_name"
    
    # Extract sensitive environment variables (containing keywords like password, secret, key, token)
    local secret_data=""
    while IFS= read -r line; do
        if [[ "$line" =~ ^[a-zA-Z_][a-zA-Z0-9_]*= ]] && [[ "$line" =~ (password|secret|key|token|credential) ]]; then
            local key=$(echo "$line" | cut -d= -f1 | tr '[:upper:]' '[:lower:]')
            local value=$(echo "$line" | cut -d= -f2-)
            local base64_val=$(echo -n "$value" | base64)
            secret_data+="  $key: $base64_val\n"
        fi
    done < "$env_file"
    
    if [ -n "$secret_data" ]; then
        cat <<EOF > "manifests-k8s/${app_name}-secret.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: $secret_name
  namespace: $namespace
  labels:
    app: $app_name
type: Opaque
data:
${secret_data}
EOF
        
        kubectl apply -f "manifests-k8s/${app_name}-secret.yaml"
    else
        log_warning "No sensitive environment variables found for Secret creation"
    fi
}

# Function to create database deployment
create_database_deployment() {
    local namespace="$1"
    local app_name="$2"
    local db_type="$3"
    local pvc_size="$4"
    
    log_info "Creating ${db_type} database deployment"
    
    local db_image=""
    local db_port=""
    local db_volume_mount=""
    local db_env=""
    
    case "$db_type" in
        "postgres")
            db_image="postgres:15-alpine"
            db_port="5432"
            db_volume_mount="/var/lib/postgresql/data"
            db_env="
        - name: POSTGRES_DB
          value: ${app_name}_db
        - name: POSTGRES_USER
          value: ${app_name}_user
        - name: POSTGRES_PASSWORD
          value: ${app_name}_password"
            ;;
        "mysql")
            db_image="mysql:8.0"
            db_port="3306"
            db_volume_mount="/var/lib/mysql"
            db_env="
        - name: MYSQL_DATABASE
          value: ${app_name}_db
        - name: MYSQL_USER
          value: ${app_name}_user
        - name: MYSQL_PASSWORD
          value: ${app_name}_password
        - name: MYSQL_ROOT_PASSWORD
          value: ${app_name}_root_password"
            ;;
        "mongodb")
            db_image="mongo:6.0"
            db_port="27017"
            db_volume_mount="/data/db"
            db_env="
        - name: MONGO_INITDB_DATABASE
          value: ${app_name}_db
        - name: MONGO_INITDB_ROOT_USERNAME
          value: ${app_name}_user
        - name: MONGO_INITDB_ROOT_PASSWORD
          value: ${app_name}_password"
            ;;
        *)
            log_error "Unsupported database type: $db_type"
            return 1
            ;;
    esac
    
    # Create PVC
    cat <<EOF > "manifests-k8s/${app_name}-db-pvc.yaml"
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ${app_name}-db-pvc
  namespace: $namespace
  labels:
    app: $app_name
    component: database
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: $pvc_size
EOF
    
    # Create Deployment
    cat <<EOF > "manifests-k8s/${app_name}-db-deployment.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${app_name}-db
  namespace: $namespace
  labels:
    app: $app_name
    component: database
    db-type: $db_type
spec:
  replicas: 1
  selector:
    matchLabels:
      app: $app_name
      component: database
      db-type: $db_type
  template:
    metadata:
      labels:
        app: $app_name
        component: database
        db-type: $db_type
    spec:
      containers:
      - name: ${app_name}-db
        image: $db_image
        ports:
        - containerPort: $db_port
          name: db-port
        volumeMounts:
        - name: db-storage
          mountPath: $db_volume_mount
        env:
${db_env}
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      volumes:
      - name: db-storage
        persistentVolumeClaim:
          claimName: ${app_name}-db-pvc
EOF
    
    # Create Service
    cat <<EOF > "manifests-k8s/${app_name}-db-service.yaml"
apiVersion: v1
kind: Service
metadata:
  name: ${app_name}-db
  namespace: $namespace
  labels:
    app: $app_name
    component: database
    db-type: $db_type
spec:
  type: ClusterIP
  ports:
  - port: $db_port
    targetPort: $db_port
    protocol: TCP
    name: db-port
  selector:
    app: $app_name
    component: database
    db-type: $db_type
EOF
    
    # Apply database manifests
    kubectl apply -f "manifests-k8s/${app_name}-db-pvc.yaml"
    kubectl apply -f "manifests-k8s/${app_name}-db-deployment.yaml"
    kubectl apply -f "manifests-k8s/${app_name}-db-service.yaml"
    
    log_success "Database deployment created successfully"
}

# Function to execute SQL initialization
execute_sql_init() {
    local namespace="$1"
    local app_name="$2"
    local db_type="$3"
    local sql_file="$4"
    
    log_info "Waiting for database to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/${app_name}-db -n "$namespace"
    
    # Wait for pod to be running
    local pod_name=$(kubectl get pods -n "$namespace" -l app="$app_name",component=database -o jsonpath='{.items[0].metadata.name}')
    kubectl wait --for=condition=ready pod "$pod_name" -n "$namespace" --timeout=60s
    
    log_info "Executing SQL initialization: $sql_file"
    
    case "$db_type" in
        "postgres")
            kubectl cp "$sql_file" "$namespace/$pod_name:/tmp/init.sql"
            kubectl exec -n "$namespace" "$pod_name" -- psql -U "${app_name}_user" -d "${app_name}_db" -f /tmp/init.sql
            ;;
        "mysql")
            kubectl cp "$sql_file" "$namespace/$pod_name:/tmp/init.sql"
            kubectl exec -n "$namespace" "$pod_name" -- mysql -u"${app_name}_user" -p"${app_name}_password" "${app_name}_db" -f /tmp/init.sql
            ;;
        "mongodb")
            # MongoDB initialization might require different approach
            log_warning "MongoDB initialization not fully implemented. Skipping SQL execution."
            ;;
    esac
    
    log_success "SQL initialization completed successfully"
}

# Function to create Kubernetes deployment and service
create_k8s_resources() {
    local namespace="$1"
    local app_name="$2"
    local image_name="$3"
    local image_tag="$4"
    local port="$5"
    local env_file="$6"
    
    log_info "Creating Kubernetes deployment for $app_name"
    
    # Create Deployment
    cat <<EOF > "manifests-k8s/${app_name}-deployment.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $app_name
  namespace: $namespace
  labels:
    app: $app_name
spec:
  replicas: 2
  selector:
    matchLabels:
      app: $app_name
  template:
    metadata:
      labels:
        app: $app_name
    spec:
      containers:
      - name: $app_name
        image: $image_name:$image_tag
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: $port
          name: http
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
        livenessProbe:
          httpGet:
            path: /
            port: $port
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: $port
          initialDelaySeconds: 5
          periodSeconds: 5
EOF
    
    # Add environment variables from ConfigMap if available
    if [ -n "$env_file" ]; then
        cat <<EOF >> "manifests-k8s/${app_name}-deployment.yaml"
        envFrom:
        - configMapRef:
            name: ${app_name}-config
EOF
        
        # Check if secret exists and add to deployment
        if [ -f "manifests-k8s/${app_name}-secret.yaml" ]; then
            cat <<EOF >> "manifests-k8s/${app_name}-deployment.yaml"
        - secretRef:
            name: ${app_name}-secret
EOF
        fi
    fi
    
    # Create Service
    cat <<EOF > "manifests-k8s/${app_name}-service.yaml"
apiVersion: v1
kind: Service
metadata:
  name: $app_name
  namespace: $namespace
  labels:
    app: $app_name
spec:
  type: NodePort
  ports:
  - port: $port
    targetPort: $port
    nodePort: $((30000 + RANDOM % 1000))
    protocol: TCP
    name: http
  selector:
    app: $app_name
EOF
    
    # Apply the manifests
    kubectl apply -f "manifests-k8s/${app_name}-deployment.yaml"
    kubectl apply -f "manifests-k8s/${app_name}-service.yaml"
    
    log_success "Kubernetes resources created successfully"
}

# Main script starts here
log_info "🚀 Starting GitHub to Kind deployment automation"

# 1. Prompt for GitHub repository URL
while true; do
    GITHUB_URL=$(prompt "Enter GitHub repository URL (e.g., https://github.com/user/repo.git)")
    if validate_github_url "$GITHUB_URL"; then
        break
    else
        log_error "Invalid GitHub URL. Please enter a valid URL."
    fi
done

# 2. Prompt for GitHub authentication token
GITHUB_TOKEN=$(prompt "Enter GitHub Personal Access Token (PAT)")

# 3. Extract repository name and clone
REPO_NAME=$(get_repo_name "$GITHUB_URL")
log_info "Cloning repository: $REPO_NAME"

if [ -d "$REPO_NAME" ]; then
    log_warning "Repository directory already exists. Updating..."
    cd "$REPO_NAME"
    git pull
    cd ..
else
    git clone "$GITHUB_URL" "$REPO_NAME"
fi

cd "$REPO_NAME"

# 4. Prompt for branch selection
log_info "Available branches:"
git branch -r
BRANCH=$(prompt "Enter branch name to deploy")
git checkout "$BRANCH"

# 5. Prompt for PVC size
PVC_SIZE=$(prompt "Enter PVC size for database (e.g., 1Gi)" "1Gi")

# 6. Create manifests directory
mkdir -p manifests-k8s

# 7. Scan for Dockerfiles
DOCKERFILES=$(find . -name "Dockerfile" | sed 's|^\./||')

if [ -z "$DOCKERFILES" ]; then
    log_error "No Dockerfiles found in repository"
    exit 1
fi

# 8. Prompt for image tag
read -p "Use random 5-digit tag? (y/N): " use_random_tag
if [[ "$use_random_tag" =~ ^[Yy]$ ]]; then
    IMAGE_TAG=$(generate_random_tag)
else
    IMAGE_TAG=$(prompt "Enter custom image tag")
fi

log_info "Using image tag: $IMAGE_TAG"

# 9. Build Docker images
for dockerfile in $DOCKERFILES; do
    dir=$(dirname "$dockerfile")
    if [ "$dir" = "." ]; then
        subdir=""
        app_name="$REPO_NAME"
    else
        subdir=$(echo "$dir" | tr '/' '-')
        app_name="${REPO_NAME}-${subdir}"
    fi
    
    image_name="localhost:5000/${app_name}"
    
    log_info "Building image: $image_name:$IMAGE_TAG (from $dockerfile)"
    docker build -t "$image_name:$IMAGE_TAG" -f "$dockerfile" "$dir"
done

# 10. Scan for .env files and create ConfigMaps/Secrets
ENV_FILES=$(find . -name "*.env" | sed 's|^\./||')
for env_file in $ENV_FILES; do
    dir=$(dirname "$env_file")
    if [ "$dir" = "." ]; then
        subdir=""
        app_name="$REPO_NAME"
    else
        subdir=$(echo "$dir" | tr '/' '-')
        app_name="${REPO_NAME}-${subdir}"
    fi
    
    create_configmap "$REPO_NAME" "$app_name" "$env_file"
    create_secret "$REPO_NAME" "$app_name" "$env_file"
done

# 11. Detect database type from .env files
DB_TYPE=""
DB_HOST=""
for env_file in $ENV_FILES; do
    if grep -q "DATABASE_HOST" "$env_file"; then
        DB_HOST=$(grep "DATABASE_HOST" "$env_file" | cut -d= -f2-)
        if [[ "$DB_HOST" =~ (postgres|mysql|mongodb) ]]; then
            DB_TYPE=$(echo "$DB_HOST" | grep -oE "(postgres|mysql|mongodb)")
            break
        elif [[ "$DB_HOST" == *"localhost"* || "$DB_HOST" == *"127.0.0.1"* ]]; then
            log_warning "DATABASE_HOST is localhost. Using default postgres database."
            DB_TYPE="postgres"
            break
        fi
    fi
done

# 12. Scan for SQL files
SQL_FILES=$(find . -name "*.sql" | sed 's|^\./||')

# 13. Check for Kind cluster
if ! command -v kind >/dev/null 2>&1; then
    log_error "Kind is not installed. Please install Kind from https://kind.sigs.k8s.io/"
    exit 1
fi

CLUSTER_NAME="kind"
if [ "$(kind get clusters 2>/dev/null | wc -l)" -eq 0 ]; then
    read -p "No Kind cluster detected. Create one? (y/N): " create_cluster
    if [[ "$create_cluster" =~ ^[Yy]$ ]]; then
        log_info "Creating Kind cluster..."
        kind create cluster --name "$CLUSTER_NAME"
    else
        log_error "Kind cluster required. Exiting."
        exit 1
    fi
else
    log_info "Existing Kind cluster found: $CLUSTER_NAME"
fi

# 14. Load images into Kind cluster
for dockerfile in $DOCKERFILES; do
    dir=$(dirname "$dockerfile")
    if [ "$dir" = "." ]; then
        subdir=""
        app_name="$REPO_NAME"
    else
        subdir=$(echo "$dir" | tr '/' '-')
        app_name="${REPO_NAME}-${subdir}"
    fi
    
    image_name="localhost:5000/${app_name}"
    
    log_info "Loading image into Kind cluster: $image_name:$IMAGE_TAG"
    kind load docker-image "$image_name:$IMAGE_TAG" --name "$CLUSTER_NAME"
done

# 15. Create Kubernetes namespace
create_namespace "$REPO_NAME"

# 16. Deploy database if needed
if [ -n "$DB_TYPE" ] && [ -n "$SQL_FILES" ]; then
    log_info "Database type detected: $DB_TYPE"
    create_database_deployment "$REPO_NAME" "$REPO_NAME" "$DB_TYPE" "$PVC_SIZE"
    
    # Execute SQL files
    for sql_file in $SQL_FILES; do
        log_info "Executing SQL file: $sql_file"
        execute_sql_init "$REPO_NAME" "$REPO_NAME" "$DB_TYPE" "$sql_file" || {
            log_error "SQL execution failed. Retrying..."
            kubectl delete -f "manifests-k8s/${REPO_NAME}-db-deployment.yaml"
            kubectl delete -f "manifests-k8s/${REPO_NAME}-db-service.yaml"
            kubectl delete -f "manifests-k8s/${REPO_NAME}-db-pvc.yaml"
            create_database_deployment "$REPO_NAME" "$REPO_NAME" "$DB_TYPE" "$PVC_SIZE"
            execute_sql_init "$REPO_NAME" "$REPO_NAME" "$DB_TYPE" "$sql_file"
        }
    done
elif [ -n "$DB_TYPE" ]; then
    log_info "Database type detected: $DB_TYPE, but no SQL files found"
    create_database_deployment "$REPO_NAME" "$REPO_NAME" "$DB_TYPE" "$PVC_SIZE"
elif [ -n "$SQL_FILES" ]; then
    log_warning "SQL files found, but no DATABASE_HOST detected. Skipping database deployment."
fi

# 17. Deploy applications
for dockerfile in $DOCKERFILES; do
    dir=$(dirname "$dockerfile")
    if [ "$dir" = "." ]; then
        subdir=""
        app_name="$REPO_NAME"
    else
        subdir=$(echo "$dir" | tr '/' '-')
        app_name="${REPO_NAME}-${subdir}"
    fi
    
    image_name="localhost:5000/${app_name}"
    port=$(get_exposed_port "$dockerfile")
    
    # Find corresponding .env file
    env_file=""
    if [ -f "$dir/.env" ]; then
        env_file="$dir/.env"
    elif [ -f "./.env" ]; then
        env_file="./.env"
    fi
    
    create_k8s_resources "$REPO_NAME" "$app_name" "$image_name" "$IMAGE_TAG" "$port" "$env_file"
done

# 18. Wait for deployments to be ready
log_info "Waiting for deployments to be ready..."
for deployment in $(kubectl get deployments -n "$REPO_NAME" -o jsonpath='{.items[*].metadata.name}'); do
    kubectl wait --for=condition=available --timeout=300s deployment/"$deployment" -n "$REPO_NAME"
done

# 19. Display deployment status
log_info "📊 Deployment Status"
echo "Namespace: $REPO_NAME"
kubectl get all -n "$REPO_NAME"

# 20. Provide access information
log_success "✅ Deployment complete!"

# Get service details
SERVICE_NAME="${REPO_NAME}"
if kubectl get service "$SERVICE_NAME" -n "$REPO_NAME" >/dev/null 2>&1; then
    SERVICE_PORT=$(kubectl get service "$SERVICE_NAME" -n "$REPO_NAME" -o jsonpath='{.spec.ports[0].nodePort}')
    log_info "🌐 Application accessible at: http://localhost:$SERVICE_PORT"
    log_info "💡 To port-forward directly:"
    log_info "   kubectl port-forward service/$SERVICE_NAME 9090:$(kubectl get service "$SERVICE_NAME" -n "$REPO_NAME" -o jsonpath='{.spec.ports[0].port}') -n $REPO_NAME --address 0.0.0.0"
else
    log_warning "No service found with name $SERVICE_NAME. Check available services above."
fi
