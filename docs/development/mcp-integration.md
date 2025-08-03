# MCP Integration Documentation

## Overview
This document describes the Model Context Protocol (MCP) integrations that have been implemented for the MBR application.

## What Has Been Implemented

### 1. **MCP Configuration Structure**
- **Main Configuration**: `mcp.config.json` - Central configuration for all MCP integrations
- **GitHub Configuration**: `.mcp/github-config.json` - GitHub-specific MCP settings
- **Zapier Configuration**: `.mcp/zapier-config.json` - Zapier automation settings

### 2. **Webhook Endpoints**
- **GitHub Webhook**: `/api/webhooks/github` - Handles GitHub events (push, PR, issues)
- **Zapier Webhook**: `/api/webhooks/zapier` - Handles Zapier automation events

### 3. **MCP Server**
- **Server Implementation**: `mcp-server.js` - Core MCP server handling integrations
- Features:
  - Auto-sync capabilities
  - Real-time updates
  - Error recovery
  - Comprehensive logging

### 4. **Integration Features**

#### GitHub Integration
- Automatic deployment triggers on push to main branch
- Issue tracking and synchronization
- Pull request automation
- Webhook security with signature verification

#### Zapier Integration
- Bidirectional data synchronization
- Support for multiple event types:
  - GitHub events forwarding
  - Database update notifications
  - Custom notification sending
- API key authentication

## Setup Instructions

1. **Run the setup script**:
   ```bash
   chmod +x setup-mcp.sh
   ./setup-mcp.sh
   ```

2. **Configure environment variables** in `.env.local`:
   - `GITHUB_WEBHOOK_SECRET`
   - `ZAPIER_API_KEY`
   - `ZAPIER_WEBHOOK_SECRET`

3. **Set up webhooks**:
   - GitHub: Add `https://mbdb-theta.vercel.app/api/webhooks/github` to repository settings
   - Zapier: Configure `https://mbdb-theta.vercel.app/api/webhooks/zapier` in your Zaps

## Recent Commits

The following enhancements have been committed to your repository:
- ✅ MCP GitHub configuration
- ✅ MCP Zapier configuration  
- ✅ Main MCP configuration
- ✅ GitHub webhook endpoint
- ✅ Zapier webhook endpoint
- ✅ MCP server implementation
- ✅ Setup script for easy deployment

## Application Status

Your application has been successfully enhanced with MCP integrations and should now be working with:
- Automated GitHub workflows
- Zapier automation capabilities
- Real-time synchronization
- Enhanced error recovery

Visit your application at: https://mbdb-theta.vercel.app

## Monitoring

- MCP logs are available at: `./logs/mcp.log`
- Check webhook status in your GitHub repository settings
- Monitor Zapier task history in your Zapier dashboard