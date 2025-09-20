#!/bin/bash

# VibeCode Terminal Deployment Script
echo "🚀 VibeCode Terminal Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Start the application
    echo "🚀 Starting application..."
    echo "📱 Open your browser to: http://localhost:3000"
    echo "🛑 Press Ctrl+C to stop the server"
    
    npm start
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi