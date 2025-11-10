#!/bin/bash

# Rebuild Native Modules Script
# Created by Kien AI (leejungkiin@gmail.com)
#
# This script rebuilds native modules for iOS and Android
# Run this after installing new native modules like expo-image-picker

set -e

echo "🔨 Rebuilding Native Modules..."
echo ""

# Check if we're in the project root
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the project root"
  exit 1
fi

# Step 1: Clean and prebuild
echo "📦 Step 1: Running expo prebuild --clean..."
npx expo prebuild --clean

# Step 2: Install iOS pods
if [ -d "ios" ]; then
  echo "📱 Step 2: Installing iOS pods..."
  cd ios
  
  # Check if running on Apple Silicon and ensure we use arm64
  # Use arch command to force arm64 execution to avoid Rosetta2 issues
  if [[ $(uname -m) == "arm64" ]] || [[ $(arch) == "arm64" ]]; then
    echo "🍎 Detected Apple Silicon (arm64), ensuring native architecture..."
    env /usr/bin/arch -arm64 /bin/bash -c "pod install"
  else
    # For Intel Macs, check if we're in Rosetta2 and warn
    if [[ $(arch) == "i386" ]] && [[ $(uname -m) == "x86_64" ]]; then
      echo "⚠️  Warning: Running in Rosetta2 mode. Forcing arm64..."
      env /usr/bin/arch -arm64 /bin/bash -c "pod install"
    else
      pod install
    fi
  fi
  
  cd ..
  echo "✅ iOS pods installed"
else
  echo "⚠️  iOS directory not found, skipping pod install"
fi

# Step 3: Instructions
echo ""
echo "✅ Native modules rebuild complete!"
echo ""
echo "Next steps:"
echo "  For iOS:   npx expo run:ios"
echo "  For Android: npx expo run:android"
echo ""
echo "Note: If you're using Expo Go, you need to use development build instead:"
echo "  npx expo run:ios --device"
echo ""

