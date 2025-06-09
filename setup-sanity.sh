#!/bin/bash

# Quick Sanity setup script
echo "Setting up Sanity for your Epic 3D Portfolio..."

# Login to Sanity
echo "1. Logging into Sanity..."
npx sanity login

# Create a new project
echo "2. Creating a new Sanity project..."
npx sanity projects create --name "Epic 3D Portfolio" --dataset production

# Get the project ID
echo "3. Getting project information..."
PROJECT_ID=$(npx sanity projects list --json | jq -r '.[0].id')

# Update the environment file
echo "4. Updating .env.local with project ID..."
sed -i.bak "s/your_project_id_here/$PROJECT_ID/g" .env.local

# Deploy schemas
echo "5. Deploying schemas to Sanity..."
npx sanity deploy

echo "✅ Sanity setup complete!"
echo "Project ID: $PROJECT_ID"
echo "Dataset: production"
echo ""
echo "Your .env.local file has been updated."
echo "You can now run 'npm run dev' to start your application."
