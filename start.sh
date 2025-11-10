#!/bin/bash

echo "🎯 AxonFlow Platform - Local Development Setup"
echo "=============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

# Install requirements
echo "📦 Installing requirements..."
pip3 install -r requirements_local.txt

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
python3 -m uvicorn main_simple:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend server..."
python3 -m http.server 3000 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 2

echo ""
echo "🎉 AxonFlow Platform is running locally!"
echo "=============================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo "💚 Health Check: http://localhost:8000/health"
echo "=============================================="
echo "Press Ctrl+C to stop all servers"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait