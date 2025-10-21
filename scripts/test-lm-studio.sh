#!/bin/bash

# LM Studio Connection Test Script
# This script tests the connection to LM Studio API

echo "🚀 Starting LM Studio Connection Test..."
echo ""

cd "$(dirname "$0")/.." || exit 1

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found, using .env.example values"
    export LM_STUDIO_URL="http://127.0.0.1:1234"
else
    source .env
fi

echo "Testing LM Studio at: ${LM_STUDIO_URL:-http://127.0.0.1:1234}"
echo ""

# Run the TypeScript test file
cd backend || exit 1
npx tsx src/test-lm-studio.ts
