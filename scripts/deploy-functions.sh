#!/bin/bash

# Firebase Functions Deploy Script
# Created by Kien AI (leejungkiin@gmail.com)
#
# Usage:
#   ./scripts/deploy-functions.sh              # Deploy all functions
#   ./scripts/deploy-functions.sh uploadFile    # Deploy specific function
#   ./scripts/deploy-functions.sh --check       # Check deployment status

set -e

FUNCTION_NAME="${1:-}"

# Check if --check flag is provided
if [ "$1" == "--check" ] || [ "$1" == "-c" ]; then
  echo "🔍 Checking Firebase Functions deployment status..."
  firebase functions:list
  exit 0
fi

echo "🔨 Building Firebase Functions..."
cd functions

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"
cd ..

# Deploy specific function or all functions
if [ -n "$FUNCTION_NAME" ]; then
  echo "🚀 Deploying function: $FUNCTION_NAME..."
  firebase deploy --only functions:$FUNCTION_NAME
else
  echo "🚀 Deploying all Firebase Functions..."
  firebase deploy --only functions
fi

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployment complete!"
  echo ""
  echo "📋 Deployed functions:"
  firebase functions:list
else
  echo "❌ Deployment failed!"
  exit 1
fi

