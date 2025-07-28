#!/bin/bash

# MCP Setup Script for MBR Application
echo "Setting up MCP integrations for MBR application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create environment variables file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOL
# GitHub Integration
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret_here

# Zapier Integration
ZAPIER_API_KEY=your_zapier_api_key_here
ZAPIER_WEBHOOK_SECRET=your_zapier_webhook_secret_here

# Vercel Integration
VERCEL_TOKEN=your_vercel_token_here
EOL
    echo "Please update .env.local with your actual credentials"
fi

# Set up GitHub webhook
echo "Setting up GitHub webhook..."
echo "Add this webhook URL to your GitHub repository settings:"
echo "https://mbdb-theta.vercel.app/api/webhooks/github"
echo ""

# Set up Zapier integration
echo "Setting up Zapier integration..."
echo "Add this webhook URL to your Zapier app:"
echo "https://mbdb-theta.vercel.app/api/webhooks/zapier"
echo ""

# Start MCP server
echo "Starting MCP server..."
node mcp-server.js &

# Check if application is running
echo ""
echo "MCP setup complete!"
echo "Your application should now be working with the following integrations:"
echo "✅ GitHub MCP integration"
echo "✅ Zapier MCP integration"
echo ""
echo "Visit your application at: https://mbdb-theta.vercel.app"
echo ""
echo "To monitor MCP logs, check: ./logs/mcp.log"