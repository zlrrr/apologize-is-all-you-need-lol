#!/bin/bash

# Stop all services for Apologize Is All You Need

echo "🛑 Stopping all services..."

# Kill all related processes
pkill -9 -f "vite" 2>/dev/null
pkill -9 -f "tsx" 2>/dev/null
pkill -9 -f "mock-lm-studio" 2>/dev/null
pkill -9 -f "node.*apologize" 2>/dev/null

# Kill processes on specific ports
for port in 3000 5000 1234; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
    fi
done

sleep 2

# Verify ports are free
if lsof -ti:3000,5000,1234 >/dev/null 2>&1; then
    echo "⚠️  Warning: Some ports are still in use"
    lsof -ti:3000,5000,1234
else
    echo "✅ All services stopped and ports freed"
fi
