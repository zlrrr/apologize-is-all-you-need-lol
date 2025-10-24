#!/bin/bash

# Restart all services for Apologize Is All You Need

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# First, stop all running services
echo "🛑 Stopping existing services..."
./scripts/stop.sh

sleep 2

# Then start fresh
echo ""
echo "🚀 Starting fresh services..."
./scripts/start.sh
