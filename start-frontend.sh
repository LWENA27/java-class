#!/bin/bash

###############################################################################
# Simple HTTP Server for Frontend
# 
# TEACHING MOMENT:
# We need a web server because:
# 1. file:// protocol has CORS restrictions
# 2. Modern browsers block file:// accessing http://localhost:8080
# 3. Solution: Serve frontend on http://localhost:3000
###############################################################################

echo "=========================================="
echo "🚀 Starting Frontend Server"
echo "=========================================="
echo ""
echo "Frontend will be available at:"
echo "👉 http://localhost:3000/login.html"
echo ""
echo "Make sure backend is running on port 8080:"
echo "👉 http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

cd /var/www/html/smart-menu-saas/frontend

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 3000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 3000
else
    echo "❌ Error: Python is not installed"
    echo "Please install Python to run this server"
    exit 1
fi
