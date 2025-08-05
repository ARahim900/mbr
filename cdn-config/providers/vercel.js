/**
 * Vercel CDN Provider Configuration
 * Handles Vercel-specific CDN setup, security, and optimization
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class VercelCDNProvider {
  constructor() {
    this.name = 'vercel';
    this.apiToken = process.env.VERCEL_TOKEN;
    this.teamId = process.env.VERCEL_TEAM_ID;
    this.projectId = process.env.VERCEL_PROJECT_ID;
    this.baseUrl = 'https://api.vercel.com';
  }

  // Generate Vercel configuration
  generateConfig({ headers, cacheRules, optimization, fallback }) {
    const vercelConfig = {
      // vercel.json configuration
      version: 2,
      
      // Build configuration
      builds: [
        {
          src: "package.json",
          use: "@vercel/static-build",
          config: {
            buildCommand: "npm run build:production",
            outputDirectory: "dist"
          }
        }
      ],

      // Routes and rewrites
      routes: [
        // Static assets with long-term caching
        {
          src: "^/assets/(.*)",
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Asset-Type": "static"
          }
        },
        
        // Font files
        {
          src: "^/.*\\.(woff|woff2|ttf|otf|eot)$",
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*"
          }
        },
        
        // Image files
        {
          src: "^/.*\\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$",
          headers: {
            "Cache-Control": "public, max-age=2592000",
            "Vary": "Accept"
          }
        },
        
        // JavaScript and CSS files
        {
          src: "^/.*\\.(js|css|mjs)$",
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable"
          }
        },
        
        // API routes - no caching
        {
          src: "^/api/(.*)",
          headers: {
            "Cache-Control": "private, no-cache, no-store, must-revalidate"
          }
        },
        
        // SPA fallback - all other routes go to index.html
        {
          src: "^/(?!api).*",
          dest: "/index.html",
          headers: {
            "Cache-Control": "public, max-age=0, must-revalidate"
          }
        }
      ],

      // Global headers
      headers: [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Frame-Options",
              value: "DENY"
            },
            {
              key: "X-Content-Type-Options", 
              value: "nosniff"
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block"
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin"
            },
            {
              key: "Permissions-Policy",
              value: "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
            },
            {
              key: "Strict-Transport-Security",
              value: "max-age=31536000; includeSubDomains; preload"
            },
            {
              key: "Content-Security-Policy",
              value: headers['Content-Security-Policy']
            },
            {
              key: "X-Served-By",
              value: "Vercel-CDN"
            },
            {
              key: "Access-Control-Allow-Origin",
              value: headers['Access-Control-Allow-Origin'] || "*"
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS, HEAD"
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization, X-Requested-With, Accept, Origin"
            },
            {
              key: "Access-Control-Max-Age",
              value: "86400"
            }
          ]
        }
      ],

      // Redirects
      redirects: [
        {
          source: "/api/(.*)",
          destination: "/api/$1",
          permanent: false
        }
      ],

      // Rewrites for SPA
      rewrites: [
        {
          source: "/((?!api|_next|_static|favicon.ico).*)",
          destination: "/index.html"
        }
      ],

      // Environment variables
      env: {
        NODE_ENV: "production",
        VITE_CDN_URL: process.env.VERCEL_URL || ""
      },

      // Function configuration
      functions: {
        "api/**/*.js": {
          maxDuration: 30
        }
      },

      // Cron jobs (if needed)
      crons: [],

      // Images optimization
      images: {
        domains: [
          "cdn.jsdelivr.net",
          "unpkg.com",
          "github.com",
          "githubusercontent.com"
        ],
        formats: ["image/webp", "image/avif"]
      }
    };

    return vercelConfig;
  }

  // Generate vercel.json content
  generateJsonConfig(config) {
    return JSON.stringify(config, null, 2);
  }

  // Validate Vercel configuration
  async validate() {
    const results = { valid: true, errors: [], warnings: [] };
    
    if (!this.apiToken) {
      results.warnings.push('VERCEL_TOKEN not set - deployment may require manual authentication');
    }
    
    if (!this.projectId) {
      results.warnings.push('VERCEL_PROJECT_ID not set - will create new project');
    }
    
    // Check if vercel.json exists
    const vercelConfigPath = path.resolve(process.cwd(), 'vercel.json');
    if (!fs.existsSync(vercelConfigPath)) {
      results.warnings.push('vercel.json not found - configuration will be generated');
    }
    
    // Check build directory
    const buildDir = path.resolve(process.cwd(), 'dist');
    if (!fs.existsSync(buildDir)) {
      results.warnings.push('Build directory (dist) not found - run build first');
    }
    
    // Test API connection if token available
    if (this.apiToken) {
      try {
        await this.testApiConnection();
      } catch (error) {
        results.warnings.push(`API connection test failed: ${error.message}`);
      }
    }
    
    return results;
  }

  // Test Vercel API connection
  async testApiConnection() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.vercel.com',
        port: 443,
        path: '/v2/user',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      };
      
      const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          reject(new Error(`API test failed: HTTP ${res.statusCode}`));
        }
      });
      
      req.on('error', reject);
      req.end();
    });
  }

  // Deploy to Vercel
  async deploy(config) {
    try {
      const vercelConfig = this.generateConfig(config);
      
      // Generate vercel.json
      const jsonContent = this.generateJsonConfig(vercelConfig);
      const jsonPath = path.resolve(process.cwd(), 'vercel.json');
      
      // Backup existing config
      if (fs.existsSync(jsonPath)) {
        fs.copyFileSync(jsonPath, `${jsonPath}.backup.${Date.now()}`);
      }
      
      // Write new config
      fs.writeFileSync(jsonPath, jsonContent);
      
      console.log('Vercel configuration updated successfully');
      console.log(`Configuration written to: ${jsonPath}`);
      
      // If API token is available, trigger deployment
      if (this.apiToken) {
        console.log('Triggering Vercel deployment...');
        const deployResult = await this.triggerDeploy();
        return {
          success: true,
          config: jsonContent,
          deployment: deployResult
        };
      }
      
      return {
        success: true,
        config: jsonContent,
        message: 'Configuration updated. Use "vercel --prod" to deploy manually.'
      };
      
    } catch (error) {
      console.error('Vercel deployment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Trigger Vercel deployment
  async triggerDeploy() {
    try {
      // Create deployment
      const deploymentData = {
        name: 'mbr-water-management',
        deploymentId: `deployment-${Date.now()}`,
        meta: {
          source: 'cdn-manager'
        }
      };
      
      // If project exists, use it
      if (this.projectId) {
        deploymentData.projectId = this.projectId;
      }
      
      const deployment = await this.makeApiRequest('POST', '/v13/deployments', deploymentData);
      
      return {
        success: true,
        deploymentId: deployment.id,
        url: deployment.url,
        status: deployment.readyState
      };
      
    } catch (error) {
      console.error('Deployment trigger failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create or update Vercel project
  async createProject(projectData) {
    const data = {
      name: projectData.name || 'mbr-water-management',
      framework: 'vite',
      buildCommand: 'npm run build:production',
      outputDirectory: 'dist',
      installCommand: 'npm install',
      devCommand: 'npm run dev',
      rootDirectory: '.',
      ...projectData
    };
    
    if (this.teamId) {
      data.teamId = this.teamId;
    }
    
    return this.makeApiRequest('POST', '/v10/projects', data);
  }

  // Update project environment variables
  async updateEnvironmentVariables(envVars) {
    if (!this.projectId) {
      throw new Error('Project ID required to update environment variables');
    }
    
    const promises = Object.entries(envVars).map(([key, value]) => {
      return this.makeApiRequest('POST', `/v10/projects/${this.projectId}/env`, {
        key,
        value,
        type: 'encrypted',
        target: ['production', 'preview', 'development']
      });
    });
    
    return Promise.all(promises);
  }

  // Get deployment logs
  async getDeploymentLogs(deploymentId) {
    return this.makeApiRequest('GET', `/v2/deployments/${deploymentId}/events`);
  }

  // Make Vercel API request
  async makeApiRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const postData = data ? JSON.stringify(data) : null;
      
      const options = {
        hostname: 'api.vercel.com',
        port: 443,
        path: path,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'MBR-CDN-Manager/1.0'
        }
      };
      
      if (postData) {
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }
      
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const result = responseData ? JSON.parse(responseData) : {};
              resolve(result);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error.message}`));
          }
        });
      });
      
      req.on('error', reject);
      
      if (postData) {
        req.write(postData);
      }
      
      req.end();
    });
  }

  // Health check
  async healthCheck() {
    try {
      if (this.apiToken) {
        await this.testApiConnection();
      }
      return { status: 'healthy', responseTime: Date.now() };
    } catch (error) {
      throw new Error(`Vercel health check failed: ${error.message}`);
    }
  }

  // Monitor Vercel project
  async monitor() {
    if (!this.projectId) {
      throw new Error('Project ID required for monitoring');
    }
    
    try {
      const project = await this.makeApiRequest('GET', `/v9/projects/${this.projectId}`);
      const deployments = await this.makeApiRequest('GET', `/v6/deployments?projectId=${this.projectId}&limit=5`);
      
      return {
        status: 'active',
        projectName: project.name,
        framework: project.framework,
        lastDeployment: deployments.deployments[0],
        deploymentCount: deployments.deployments.length,
        customDomains: project.alias || [],
        lastCheck: Date.now()
      };
    } catch (error) {
      throw new Error(`Vercel monitoring failed: ${error.message}`);
    }
  }

  // Get project analytics
  async getAnalytics(timeframe = '1d') {
    if (!this.projectId) {
      throw new Error('Project ID required for analytics');
    }
    
    try {
      const analytics = await this.makeApiRequest('GET', `/v2/analytics?projectId=${this.projectId}&from=${timeframe}`);
      return analytics;
    } catch (error) {
      throw new Error(`Analytics retrieval failed: ${error.message}`);
    }
  }
}

module.exports = new VercelCDNProvider();