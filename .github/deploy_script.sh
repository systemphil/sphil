#!/bin/bash

echo "🚀 Deployment script starting..."

# Function to print usage
print_usage() {
    echo "Usage: $0 <PROJECT_ID> <PROJECT_NUMBER> <REGION> <SERVICE> <TAG> '<SECRET1> <SECRET2> ...' '<CONFIG_KEY>:<CONFIG_VALUE> ...'"
    echo "Example: $0 my-project 43543524523 us-central1 my-service latest 'MONGO_URI DB_NAME' 'port:8080 memory:2Gi cpu:2'"
}

# Check if we have at least 6 arguments
if [ $# -lt 6 ]; then
    print_usage
    exit 1
fi

# Assign common variables
PROJECT_ID="$1"
PROJECT_NUMBER="$2"
REGION="$3"
SERVICE="$4"
TAG="$5"
SECRETS="$6"
DEPLOY_CONFIG="$7"

# Process secrets
declare -a secrets
for secret in $SECRETS; do
    secrets+=("$secret")
done

# Process deploy config
declare -A config
for item in $DEPLOY_CONFIG; do
    IFS=':' read -r key value <<< "$item"
    config["$key"]="$value"
done

# Generate the --set-secrets argument
set_secrets_arg=""
for secret in "${secrets[@]}"; do
    echo "${secret}=projects/${PROJECT_NUMBER}/secrets/${secret}:latest"
    set_secrets_arg+="${secret}=projects/${PROJECT_NUMBER}/secrets/${secret}:latest,"
done
set_secrets_arg=${set_secrets_arg%,}  # Remove trailing comma

# Generate the deploy command with dynamic config
deploy_command="gcloud beta run deploy $SERVICE \\
    --platform=managed \\
    --region=$REGION \\
    --image=\"$REGION-docker.pkg.dev/$PROJECT_ID/$SERVICE/$SERVICE:$TAG\" \\"

# Add dynamic config options
for key in "${!config[@]}"; do
    value="${config[$key]}"
    if [ -n "$value" ]; then
        deploy_command+="
    --$key=$value \\"
    else
        deploy_command+="
    --$key \\"
    fi
done

# Add set-secrets to the command
deploy_command+="
    --set-secrets=$set_secrets_arg"

# Execute the deploy command
echo "⚙️ Executing deploy command..."
eval "$deploy_command"