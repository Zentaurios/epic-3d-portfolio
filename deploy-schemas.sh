#!/bin/bash

# Deploy schemas to your portfolio Sanity project
echo "🚀 Deploying schemas to Sanity project 'portfolio' (ntqs7f5z)..."

# Deploy the GraphQL schema
npx sanity deploy

echo "✅ Schemas deployed successfully!"
echo ""
echo "Your Sanity setup is now complete:"
echo "- Project ID: ntqs7f5z"
echo "- Project Name: portfolio" 
echo "- Dataset: production"
echo ""
echo "You can now:"
echo "1. Run 'npm run dev' to start your Next.js app"
echo "2. Visit https://www.sanity.io/manage/project/ntqs7f5z to manage content"
echo "3. Add content through the Sanity Studio"
