#!/bin/bash

# Pre-build Check Script for Expo
# Created by Kien AI (leejungkiin@gmail.com)
#
# Checks if Firebase Functions are deployed before building Expo app
# Can be skipped with --skip-functions-check flag

set -e

SKIP_CHECK=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    --skip-functions-check|--skip-functions)
      SKIP_CHECK=true
      shift
      ;;
    *)
      # Unknown option
      ;;
  esac
done

if [ "$SKIP_CHECK" = true ]; then
  echo "⏭️  Skipping Firebase Functions check (--skip-functions-check flag provided)"
  exit 0
fi

echo "🔍 Checking Firebase Functions deployment status before build..."
echo ""

# Check if firebase CLI is available
if ! command -v firebase &> /dev/null; then
  echo "⚠️  Firebase CLI not found. Skipping functions check."
  echo "   Install with: npm install -g firebase-tools"
  exit 0
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
  echo "⚠️  Not logged in to Firebase. Skipping functions check."
  echo "   Login with: firebase login"
  exit 0
fi

# List functions and check if uploadFile exists
FUNCTIONS_OUTPUT=$(firebase functions:list 2>/dev/null || echo "")

if [ -z "$FUNCTIONS_OUTPUT" ]; then
  echo "⚠️  Could not retrieve functions list. Skipping check."
  exit 0
fi

# Check if uploadFile function exists
if echo "$FUNCTIONS_OUTPUT" | grep -q "uploadFile"; then
  echo "✅ uploadFile function is deployed"
  echo ""
  echo "$FUNCTIONS_OUTPUT"
  echo ""
  echo "✅ Pre-build check passed!"
else
  echo "⚠️  uploadFile function not found in deployed functions"
  echo ""
  echo "Deployed functions:"
  echo "$FUNCTIONS_OUTPUT"
  echo ""
  echo "💡 To deploy functions, run: npm run functions:deploy"
  echo "   Or skip this check: npm run build -- --skip-functions-check"
  echo ""
  read -p "Continue with build anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Build cancelled. Please deploy functions first."
    exit 1
  fi
fi

