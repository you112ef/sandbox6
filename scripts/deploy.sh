#!/bin/bash

# VibeCode Terminal Deployment Script
# This script deploys the application to Vercel with proper configuration

set -e

echo "🚀 Starting VibeCode Terminal deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls | head -n 2 | tail -n 1 | awk '{print $2}')

echo "✅ Deployment complete!"
echo "🌐 Your application is available at: https://$DEPLOYMENT_URL"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in Vercel dashboard"
echo "2. Configure your database (PostgreSQL)"
echo "3. Add your API keys for AI providers"
echo "4. Test the application"
echo ""
echo "🔧 Environment variables to configure:"
echo "- POSTGRES_URL (required)"
echo "- OPENAI_API_KEY (recommended)"
echo "- ANTHROPIC_API_KEY (recommended)"
echo "- GOOGLE_AI_API_KEY (recommended)"
echo "- BETTER_AUTH_SECRET (required)"
echo ""
echo "📖 Documentation: https://github.com/you112ef/sandbox6"