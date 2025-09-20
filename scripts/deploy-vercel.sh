#!/bin/bash

echo "🚀 Starting Vercel Deployment for VibeCode Terminal..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "Failed to install Vercel CLI. Aborting deployment."
        exit 1
    fi
fi

# Check for environment variables
if [ -z "$VERCEL_TOKEN" ]; then
    echo "Warning: VERCEL_TOKEN not set. You may need to login manually."
fi

# Run type check
echo "Running TypeScript type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "TypeScript errors found. Aborting deployment."
    exit 1
fi

# Build the application
echo "Building the Next.js application..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed. Aborting deployment."
    exit 1
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
if [ -n "$VERCEL_TOKEN" ]; then
    vercel --prod --token $VERCEL_TOKEN
else
    vercel --prod
fi

if [ $? -ne 0 ]; then
    echo "Vercel deployment failed."
    exit 1
fi

echo "✅ Vercel Deployment Completed Successfully!"
echo "Your application should now be live on Vercel."