#!/bin/bash

# Firebase Functions Check Script
# Created by Kien AI (leejungkiin@gmail.com)
#
# Checks if Firebase Functions are deployed and accessible

set -e

echo "🔍 Checking Firebase Functions deployment status..."
echo ""

# List all deployed functions
firebase functions:list

echo ""
echo "✅ Functions check complete!"

