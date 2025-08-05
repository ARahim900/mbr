/**
 * Netlify CDN Provider Configuration
 * Handles Netlify-specific CDN setup, security, and optimization
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class NetlifyCDNProvider {
  constructor() {
    this.name = 'netlify';
    this.baseUrl = process.env.NETLIFY_URL || 'https://app.netlify.com';
    this.apiToken = process.env.NETLIFY_AUTH_TOKEN;
    this.siteId = process.env.NETLIFY_SITE_ID;
  }

  // Generate Netlify-specific configuration
  generateConfig({ headers, cacheRules, optimization, fallback }) {
    const netlifyConfig = {
      build: {
        command: "npm run build:production",
        publish: "dist",
        ignore: "/bin/false"
      },
      
      'build.environment': {
        NODE_VERSION: "20.15.1",
        NPM_VERSION: "10",
        NPM_CONFIG_FUND: "false",
        NPM_CONFIG_AUDIT: "false",
        NPM_CONFIG_LEGACY_PEER_DEPS: "true",
        NODE_OPTIONS: "--max-old-space-size=8192",
        SKIP_PREFLIGHT_CHECK: "true",
        CI: "true",
        NPM_FLAGS: "--legacy-peer-deps",
        NETLIFY_USE_YARN: "false",
        NETLIFY_USE_PNPM: "false"
      },

      // Security and Performance Headers
      headers: [
        {
          for: "/*",
          values: {
            // Security Headers
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Content-Security-Policy': headers['Content-Security-Policy'],
            
            // Performance Headers
            'X-Served-By': 'Netlify-CDN',
            'X-Cache-Status': 'MISS',
            'Vary': 'Accept-Encoding, Accept',
            
            // CORS Headers
            'Access-Control-Allow-Origin': headers['Access-Control-Allow-Origin'] || '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
            'Access-Control-Max-Age': '86400'
          }
        },
        
        // Static Assets - Long-term caching
        {
          for: "/assets/*",
          values: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Expires': new Date(Date.now() + 31536000000).toUTCString(),
            'X-Asset-Type': 'static'
          }
        },
        
        // JavaScript and CSS files
        {
          for: "/*.{js,css,mjs}",
          values: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Type': 'text/javascript; charset=utf-8'
          }
        },
        
        // Font files
        {
          for: "/*.{woff,woff2,ttf,otf,eot}",
          values: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'font/woff2'
          }
        },
        
        // Image files with optimization
        {
          for: "/*.{jpg,jpeg,png,gif,webp,svg,ico,avif}",
          values: {
            'Cache-Control': 'public, max-age=2592000', // 30 days
            'Vary': 'Accept',
            'X-Image-Optimized': 'true'
          }
        },
        
        // HTML files - Short caching for updates
        {
          for: "/*.html",
          values: {
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'X-Content-Type': 'text/html; charset=utf-8'
          }
        },
        
        // Service Worker - No caching
        {
          for: "/sw.js",
          values: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Service-Worker-Allowed': '/'
          }
        },
        
        // Manifest and config files
        {
          for: "/*.{json,xml,txt}",
          values: {
            'Cache-Control': 'public, max-age=86400' // 1 day
          }
        }
      ],

      // Redirects for SPA routing
      redirects: [
        {
          from: "/api/*",
          to: "/.netlify/functions/:splat",
          status: 200
        },
        {
          from: "/*",
          to: "/index.html",
          status: 200
        }
      ],

      // Functions configuration
      functions: {
        node_bundler: "esbuild",
        external_node_modules: ["sharp", "canvas"],
        included_files: ["dist/**/*"]
      },

      // Plugin configuration for optimization
      plugins: [
        {
          package: "@netlify/plugin-sitemap"
        },
        {
          package: "netlify-plugin-cache",
          inputs: {
            paths: ["node_modules", ".cache"]
          }
        }
      ],

      // Edge functions for advanced caching
      edge_functions: [
        {
          function: "cache-control",
          path: "/assets/*"
        }
      ]
    };

    return netlifyConfig;
  }

  // Generate netlify.toml content
  generateTomlConfig(config) {
    let toml = '';
    
    // Build section
    toml += '[build]\n';
    toml += `  command = "${config.build.command}"\n`;
    toml += `  publish = "${config.build.publish}"\n`;
    toml += `  ignore = "${config.build.ignore}"\n\n`;
    
    // Build environment
    toml += '[build.environment]\n';
    Object.entries(config['build.environment']).forEach(([key, value]) => {
      toml += `  ${key} = "${value}"\n`;
    });
    toml += '\n';
    
    // Headers
    config.headers.forEach(headerRule => {
      toml += `[[headers]]\n`;
      toml += `  for = "${headerRule.for}"\n`;
      toml += `  [headers.values]\n`;
      Object.entries(headerRule.values).forEach(([key, value]) => {
        toml += `    ${key} = "${value}"\n`;
      });
      toml += '\n';
    });
    
    // Redirects
    config.redirects.forEach(redirect => {
      toml += `[[redirects]]\n`;
      toml += `  from = "${redirect.from}"\n`;
      toml += `  to = "${redirect.to}"\n`;  
      toml += `  status = ${redirect.status}\n\n`;
    });
    
    // Functions
    toml += '[functions]\n';
    Object.entries(config.functions).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        toml += `  ${key} = [${value.map(v => `"${v}"`).join(', ')}]\n`;
      } else {
        toml += `  ${key} = "${value}"\n`;
      }
    });
    
    return toml;
  }

  // Validate Netlify configuration
  async validate() {
    const results = { valid: true, errors: [], warnings: [] };
    
    // Check required environment variables
    if (!this.apiToken) {
      results.warnings.push('NETLIFY_AUTH_TOKEN not set - deployment may fail');
    }
    
    if (!this.siteId) {
      results.warnings.push('NETLIFY_SITE_ID not set - deployment may fail');
    }
    
    // Check if netlify.toml exists and is valid
    const netlifyConfigPath = path.resolve(process.cwd(), 'netlify.toml');
    if (!fs.existsSync(netlifyConfigPath)) {
      results.warnings.push('netlify.toml not found - configuration will be generated');
    }
    
    // Validate build directory exists
    const buildDir = path.resolve(process.cwd(), 'dist');
    if (!fs.existsSync(buildDir)) {
      results.warnings.push('Build directory (dist) not found - run build first');
    }
    
    return results;
  }

  // Deploy to Netlify
  async deploy(config) {
    try {
      // Generate netlify.toml
      const tomlContent = this.generateTomlConfig(config);
      const tomlPath = path.resolve(process.cwd(), 'netlify.toml');
      
      // Backup existing config
      if (fs.existsSync(tomlPath)) {
        fs.copyFileSync(tomlPath, `${tomlPath}.backup.${Date.now()}`);
      }
      
      // Write new config
      fs.writeFileSync(tomlPath, tomlContent);
      
      console.log('Netlify configuration updated successfully');
      console.log(`Configuration written to: ${tomlPath}`);
      
      // If API token is available, trigger deployment
      if (this.apiToken && this.siteId) {
        console.log('Triggering Netlify deployment...');
        const deployResult = await this.triggerDeploy();
        return {
          success: true,
          config: tomlContent,
          deployment: deployResult
        };
      }
      
      return {
        success: true,
        config: tomlContent,
        message: 'Configuration updated. Manual deployment required.'
      };
      
    } catch (error) {
      console.error('Netlify deployment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Trigger Netlify deployment via API
  async triggerDeploy() {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        clear_cache: true
      });
      
      const options = {
        hostname: 'api.netlify.com',
        port: 443,
        path: `/api/v1/sites/${this.siteId}/builds`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'User-Agent': 'MBR-CDN-Manager/1.0'
        }
      };
      
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const result = JSON.parse(responseData);
              resolve({
                success: true,
                deployId: result.id,
                status: result.state,
                url: result.deploy_ssl_url || result.ssl_url
              });
            } catch (error) {
              resolve({
                success: true,
                message: 'Deployment triggered successfully'
              });
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.write(data);
      req.end();
    });
  }

  // Health check
  async healthCheck() {
    const url = this.baseUrl || 'https://netlify.com';
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: new URL(url).hostname,
        port: 443,
        path: '/status',
        method: 'GET',
        timeout: 5000
      };
      
      const req = https.request(options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ status: 'healthy', responseTime: Date.now() });
        } else {
          reject(new Error(`Health check failed: HTTP ${res.statusCode}`));
        }
      });
      
      req.on('timeout', () => {
        req.abort();
        reject(new Error('Health check timeout'));
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.end();
    });
  }

  // Monitor Netlify site performance
  async monitor() {
    if (!this.apiToken || !this.siteId) {
      throw new Error('API token and site ID required for monitoring');
    }
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.netlify.com',
        port: 443,
        path: `/api/v1/sites/${this.siteId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'User-Agent': 'MBR-CDN-Manager/1.0'
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const siteInfo = JSON.parse(data);
              resolve({
                status: 'active',
                url: siteInfo.ssl_url || siteInfo.url,
                lastDeploy: siteInfo.published_deploy?.published_at,
                buildStatus: siteInfo.published_deploy?.state,
                bandwidth: siteInfo.account_usage_capability?.bandwidth,
                storage: siteInfo.account_usage_capability?.storage
              });
            } catch (error) {
              reject(new Error(`Failed to parse monitoring data: ${error.message}`));
            }
          } else {
            reject(new Error(`Monitoring failed: HTTP ${res.statusCode}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.end();
    });
  }
}

module.exports = new NetlifyCDNProvider();