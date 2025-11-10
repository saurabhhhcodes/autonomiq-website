#!/usr/bin/env python3
"""
Local Development Server for AxonFlow Platform
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements_local.txt"], check=True)
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        sys.exit(1)

def start_backend():
    """Start the FastAPI backend"""
    print("🚀 Starting backend server...")
    backend_path = Path("backend/main_simple.py")
    
    if not backend_path.exists():
        print("❌ Backend file not found")
        sys.exit(1)
    
    try:
        # Start backend server
        backend_process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", 
            "backend.main_simple:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
        
        print("✅ Backend server started at http://localhost:8000")
        return backend_process
        
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        sys.exit(1)

def start_frontend():
    """Start the frontend server"""
    print("🌐 Starting frontend server...")
    
    try:
        # Start simple HTTP server for frontend
        frontend_process = subprocess.Popen([
            sys.executable, "-m", "http.server", "3000"
        ])
        
        print("✅ Frontend server started at http://localhost:3000")
        return frontend_process
        
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        sys.exit(1)

def main():
    """Main function to run local development environment"""
    print("🎯 AxonFlow Platform - Local Development")
    print("=" * 50)
    
    # Install requirements
    install_requirements()
    
    # Start backend
    backend_process = start_backend()
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start frontend
    frontend_process = start_frontend()
    
    # Wait a moment for frontend to start
    time.sleep(2)
    
    print("\n🎉 AxonFlow Platform is running locally!")
    print("=" * 50)
    print("📱 Frontend: http://localhost:3000")
    print("🔧 Backend API: http://localhost:8000")
    print("📊 API Docs: http://localhost:8000/docs")
    print("💚 Health Check: http://localhost:8000/health")
    print("=" * 50)
    print("Press Ctrl+C to stop all servers")
    
    # Open browser
    try:
        webbrowser.open("http://localhost:3000")
    except:
        pass
    
    try:
        # Wait for processes
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Servers stopped")

if __name__ == "__main__":
    main()