#!/bin/bash

# Apologize Is All You Need - Start Script
# This script starts all services needed to run the application

set -e

echo "🚀 Starting Apologize Is All You Need..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js >= 18.0.0"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be >= 18.0.0${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node -v) detected"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Dependencies not found, installing..."
    npm run install:all
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC}  .env file not found, creating from example..."
    cp .env.example .env
    echo -e "${GREEN}✓${NC} Created .env file"
    echo ""
fi

# Source environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if LM Studio is running (optional)
echo "🔍 Checking for LM Studio..."
LM_STUDIO_URL=${LM_STUDIO_URL:-http://127.0.0.1:1234}
if curl -s "$LM_STUDIO_URL/v1/models" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} LM Studio is running at $LM_STUDIO_URL"
else
    echo -e "${YELLOW}⚠${NC}  LM Studio not detected at $LM_STUDIO_URL"
    echo "   You can:"
    echo "   1. Start LM Studio manually"
    echo "   2. Use mock server: cd backend && npx tsx src/mock-lm-studio.ts"
    echo ""
    read -p "Do you want to start the mock LM Studio server? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting mock LM Studio server..."
        cd backend
        npx tsx src/mock-lm-studio.ts &
        MOCK_PID=$!
        cd ..
        sleep 2
        echo -e "${GREEN}✓${NC} Mock LM Studio server started (PID: $MOCK_PID)"
    fi
fi

echo ""
echo "🎯 Starting application services..."
echo ""
echo "Backend: http://localhost:${BACKEND_PORT:-5000}"
echo "Frontend: http://localhost:3000"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Start the application
npm run dev
