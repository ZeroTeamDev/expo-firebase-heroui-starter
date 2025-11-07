#!/bin/bash

# Firebase Functions Deploy Script
# Created by Kien AI (leejungkiin@gmail.com)

set -e

echo "🔨 Building Firebase Functions..."
cd functions
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"
cd ..

echo "🚀 Deploying Firebase Functions..."
firebase deploy --only functions

echo "✅ Deployment complete!"

