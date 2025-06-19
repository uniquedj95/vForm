#!/bin/bash

# VForm Demo Setup Script

set -e

echo "🚀 Setting up VForm Demo..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the VForm root directory"
    exit 1
fi

# Build the main VForm library
echo "📦 Building VForm library..."
npm install
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: VForm build failed - dist directory not found"
    exit 1
fi

echo "✅ VForm library built successfully"

# Setup demo application
echo "📱 Setting up demo application..."
cd demo

# Install demo dependencies
echo "📥 Installing demo dependencies..."
npm install

echo "✅ Demo setup complete!"
echo ""
echo "🎉 Ready to run the demo!"
echo ""
echo "To start the demo:"
echo "  cd demo"
echo "  npm run dev"
echo ""
echo "The demo will be available at http://localhost:3000"
