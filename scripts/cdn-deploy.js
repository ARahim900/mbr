#!/usr/bin/env node

/**
 * CDN Deployment Script
 * Comprehensive CDN deployment automation with security, performance, and fallback mechanisms
 */

const { CDNManager } = require('../cdn-config');
const CDNSecurityScanner = require('../cdn-config/security/security-scanner');
const CDNPerformanceMonitor = require('../cdn-config/monitoring/performance-monitor');
const fs = require('fs');
const path = require('path');

class CDNDeployment {
  constructor() {
    this.config = this.loadConfiguration();
    this.logger = this.createLogger();
  }

  // Load configuration from environment and config files
  loadConfiguration() {
    const defaultConfig = {
      // CDN Provider
      provider: process.env.CDN_PROVIDER || 'netlify',
      
      // Domain configuration
      domain: process.env.DOMAIN || process.env.NETLIFY_URL || 'localhost',
      customDomains: process.env.CUSTOM_DOMAINS ? process.env.CUSTOM_DOMAINS.split(',') : [],
      
      // Build configuration
      buildCommand: process.env.BUILD_COMMAND || 'npm run build:production',
      buildDirectory: process.env.BUILD_DIR || 'dist',
      
      // Deployment options
      environment: process.env.NODE_ENV || 'production',
      dryRun: process.env.DRY_RUN === 'true',
      force: process.env.FORCE_DEPLOY === 'true',
      
      // Security options
      enableSecurityScan: process.env.ENABLE_SECURITY_SCAN !== 'false',
      securityThreshold: parseInt(process.env.SECURITY_THRESHOLD || '70'),
      
      // Performance monitoring
      enableMonitoring: process.env.ENABLE_MONITORING !== 'false',
      monitoringInterval: parseInt(process.env.MONITORING_INTERVAL || '300000'), // 5 minutes
      
      // Fallback configuration
      enableFallback: process.env.ENABLE_FALLBACK !== 'false',
      fallbackProvider: process.env.FALLBACK_PROVIDER || 'netlify',
      
      // Alerting
      webhookUrl: process.env.WEBHOOK_URL,
      slackChannel: process.env.SLACK_CHANNEL,
      
      // Feature flags
      enableCompression: process.env.ENABLE_COMPRESSION !== 'false',
      enableImageOptimization: process.env.ENABLE_IMAGE_OPTIMIZATION !== 'false',
      enableHTTP2: process.env.ENABLE_HTTP2 !== 'false',
      enableBrotli: process.env.ENABLE_BROTLI !== 'false'
    };

    // Load from config file if exists
    const configFile = path.resolve(process.cwd(), 'cdn.config.js');
    if (fs.existsSync(configFile)) {
      try {
        const fileConfig = require(configFile);
        return { ...defaultConfig, ...fileConfig };
      } catch (error) {
        console.warn('Warning: Failed to load cdn.config.js:', error.message);
      }
    }

    return defaultConfig;
  }

  // Create logger
  createLogger() {
    return {
      info: (message) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
      warn: (message) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),  
      error: (message) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
      success: (message) => console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`)
    };
  }

  // Main deployment flow
  async deploy() {
    this.logger.info('Starting CDN deployment process...');
    this.logger.info(`Provider: ${this.config.provider}`);
    this.logger.info(`Domain: ${this.config.domain}`);
    this.logger.info(`Environment: ${this.config.environment}`);
    this.logger.info(`Dry Run: ${this.config.dryRun}`);

    try {
      // Step 1: Pre-deployment validation
      await this.preDeploymentChecks();

      // Step 2: Build application
      await this.buildApplication();

      // Step 3: Deploy to primary CDN
      const primaryResult = await this.deployToPrimary();

      // Step 4: Deploy to fallback CDN (if enabled)
      let fallbackResult = null;
      if (this.config.enableFallback && this.config.fallbackProvider !== this.config.provider) {
        fallbackResult = await this.deployToFallback();
      }

      // Step 5: Run security scan
      let securityResult = null;
      if (this.config.enableSecurityScan) {
        securityResult = await this.runSecurityScan();
      }

      // Step 6: Performance testing
      const performanceResult = await this.runPerformanceTests();

      // Step 7: Start monitoring (if enabled)
      if (this.config.enableMonitoring) {
        await this.startMonitoring();
      }

      // Step 8: Generate deployment report
      const report = this.generateDeploymentReport({
        primary: primaryResult,
        fallback: fallbackResult,
        security: securityResult,
        performance: performanceResult
      });

      // Step 9: Send notifications
      await this.sendNotifications(report);

      this.logger.success('CDN deployment completed successfully!');
      return report;

    } catch (error) {
      this.logger.error(`Deployment failed: ${error.message}`);
      
      // Send failure notification
      await this.sendFailureNotification(error);
      
      throw error;
    }
  }

  // Pre-deployment validation
  async preDeploymentChecks() {
    this.logger.info('Running pre-deployment checks...');

    // Check if build directory exists
    const buildPath = path.resolve(process.cwd(), this.config.buildDirectory);
    if (!fs.existsSync(buildPath)) {
      throw new Error(`Build directory not found: ${buildPath}`);
    }

    // Check environment variables
    const requiredEnvVars = this.getRequiredEnvVars();
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      this.logger.warn(`Missing environment variables: ${missingVars.join(', ')}`);
      
      if (!this.config.force) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }
    }

    // Validate CDN provider configuration
    const cdnManager = new CDNManager(this.config.provider);
    const validation = await cdnManager.validateConfiguration();
    
    if (!validation.valid && !this.config.force) {
      throw new Error(`CDN configuration validation failed: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => this.logger.warn(warning));
    }

    this.logger.success('Pre-deployment checks passed');
  }

  // Get required environment variables based on provider
  getRequiredEnvVars() {
    const commonVars = [];
    const providerVars = {
      'cloudflare': ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ZONE_ID'],
      'cloudfront': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
      'fastly': ['FASTLY_API_TOKEN'],
      'netlify': [], // Netlify can work without tokens for public repos
      'vercel': [] // Vercel can work without tokens for public repos
    };

    return [...commonVars, ...(providerVars[this.config.provider] || [])];
  }

  // Build application
  async buildApplication() {
    if (this.config.dryRun) {
      this.logger.info('Skipping build (dry run mode)');
      return;
    }

    this.logger.info(`Building application: ${this.config.buildCommand}`);

    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      const [command, ...args] = this.config.buildCommand.split(' ');
      
      const buildProcess = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          NODE_ENV: this.config.environment
        }
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          this.logger.success('Application built successfully');
          resolve();
        } else {
          reject(new Error(`Build failed with exit code ${code}`));
        }
      });

      buildProcess.on('error', (error) => {
        reject(new Error(`Build process failed: ${error.message}`));
      });
    });
  }

  // Deploy to primary CDN
  async deployToPrimary() {
    this.logger.info(`Deploying to primary CDN: ${this.config.provider}`);

    const cdnManager = new CDNManager(this.config.provider);
    
    const deployOptions = {
      dryRun: this.config.dryRun,
      force: this.config.force
    };

    const result = await cdnManager.deploy(deployOptions);
    
    if (result.success) {
      this.logger.success(`Primary CDN deployment successful`);
      if (result.url) {
        this.logger.info(`Deployment URL: ${result.url}`);
      }
    } else {
      throw new Error(`Primary CDN deployment failed: ${result.error}`);
    }

    return result;
  }

  // Deploy to fallback CDN
  async deployToFallback() {
    this.logger.info(`Deploying to fallback CDN: ${this.config.fallbackProvider}`);

    try {
      const fallbackManager = new CDNManager(this.config.fallbackProvider);
      
      const deployOptions = {
        dryRun: this.config.dryRun,
        force: this.config.force
      };

      const result = await fallbackManager.deploy(deployOptions);
      
      if (result.success) {
        this.logger.success(`Fallback CDN deployment successful`);
      } else {
        this.logger.warn(`Fallback CDN deployment failed: ${result.error}`);
      }

      return result;
    } catch (error) {
      this.logger.warn(`Fallback deployment failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Run security scan
  async runSecurityScan() {
    if (this.config.dryRun) {
      this.logger.info('Skipping security scan (dry run mode)');
      return null;
    }

    this.logger.info('Running security scan...');

    try {
      const scanner = new CDNSecurityScanner(this.config.domain);
      const results = await scanner.runFullScan();
      
      this.logger.info(`Security scan completed. Score: ${results.scorePercentage}% (${results.grade})`);
      
      if (results.scorePercentage < this.config.securityThreshold) {
        const message = `Security score ${results.scorePercentage}% is below threshold ${this.config.securityThreshold}%`;
        
        if (!this.config.force) {
          throw new Error(message);
        } else {
          this.logger.warn(message);
        }
      }

      // Log vulnerabilities
      if (results.vulnerabilities.length > 0) {
        this.logger.warn(`Found ${results.vulnerabilities.length} security vulnerabilities:`);
        results.vulnerabilities.forEach(vuln => {
          this.logger.warn(`- [${vuln.severity.toUpperCase()}] ${vuln.description}`);
        });
      }

      return results;
    } catch (error) {
      this.logger.error(`Security scan failed: ${error.message}`);
      
      if (!this.config.force) {
        throw error;
      }
      
      return { error: error.message };
    }
  }

  // Run performance tests
  async runPerformanceTests() {
    if (this.config.dryRun) {
      this.logger.info('Skipping performance tests (dry run mode)');
      return null;
    }

    this.logger.info('Running performance tests...');

    try {
      const monitor = new CDNPerformanceMonitor({
        domain: this.config.domain,
        testUrls: ['/', '/assets/app.js', '/assets/app.css'],
        thresholds: {
          responseTime: 2000,
          availability: 99.0,
          errorRate: 5.0
        }
      });

      const results = await monitor.runPerformanceCheck();
      
      const avgResponseTime = results.aggregate.avgResponseTime;
      const availability = results.aggregate.availability;
      
      this.logger.info(`Performance test completed. Avg response time: ${avgResponseTime}ms, Availability: ${availability}%`);
      
      // Check performance thresholds
      if (avgResponseTime > 3000) {
        this.logger.warn(`Response time ${avgResponseTime}ms is higher than recommended`);
      }
      
      if (availability < 99) {
        this.logger.warn(`Availability ${availability}% is below recommended threshold`);
      }

      return results;
    } catch (error) {
      this.logger.error(`Performance test failed: ${error.message}`);
      return { error: error.message };
    }
  }

  // Start monitoring
  async startMonitoring() {
    this.logger.info('Starting CDN monitoring...');

    try {
      const monitor = new CDNPerformanceMonitor({
        domain: this.config.domain,
        testUrls: ['/', '/assets/app.js'],
        thresholds: {
          responseTime: 2000,
          availability: 99.0,
          errorRate: 5.0
        },
        alerting: {
          webhook: this.config.webhookUrl
        }
      });

      // Start monitoring in background
      monitor.startMonitoring(this.config.monitoringInterval);
      
      this.logger.success('CDN monitoring started');
      
      // Save monitoring instance for later reference
      this.monitor = monitor;
      
      return { success: true, interval: this.config.monitoringInterval };
    } catch (error) {
      this.logger.error(`Failed to start monitoring: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Generate deployment report
  generateDeploymentReport(results) {
    const report = {
      deployment: {
        timestamp: new Date().toISOString(),
        provider: this.config.provider,
        domain: this.config.domain,
        environment: this.config.environment,
        success: true
      },
      primary: results.primary,
      fallback: results.fallback,
      security: results.security,
      performance: results.performance,
      summary: {
        totalTests: 0,
        passedTests: 0,
        warnings: [],
        errors: []
      }
    };

    // Calculate summary
    if (results.security) {
      report.summary.totalTests++;
      if (!results.security.error) {
        report.summary.passedTests++;
      } else {
        report.summary.errors.push('Security scan failed');
      }
      
      if (results.security.vulnerabilities) {
        results.security.vulnerabilities.forEach(vuln => {
          if (vuln.severity === 'high' || vuln.severity === 'critical') {
            report.summary.errors.push(`Security: ${vuln.description}`);
          } else {
            report.summary.warnings.push(`Security: ${vuln.description}`);
          }
        });
      }
    }

    if (results.performance) {
      report.summary.totalTests++;
      if (!results.performance.error) {
        report.summary.passedTests++;
      } else {
        report.summary.errors.push('Performance test failed');
      }
    }

    // Save report to file
    const reportPath = path.join(process.cwd(), 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.logger.info(`Deployment report saved to: ${reportPath}`);

    return report;
  }

  // Send notifications
  async sendNotifications(report) {
    const message = this.formatNotificationMessage(report);

    // Send webhook notification
    if (this.config.webhookUrl) {
      try {
        await this.sendWebhookNotification(message, report);
        this.logger.info('Webhook notification sent');
      } catch (error) {
        this.logger.warn(`Failed to send webhook notification: ${error.message}`);
      }
    }

    // Send Slack notification
    if (this.config.slackChannel) {
      try {
        await this.sendSlackNotification(message, report);
        this.logger.info('Slack notification sent');
      } catch (error) {
        this.logger.warn(`Failed to send Slack notification: ${error.message}`);
      }
    }
  }

  // Format notification message
  formatNotificationMessage(report) {
    const status = report.summary.errors.length > 0 ? '❌ FAILED' : '✅ SUCCESS';
    const domain = report.deployment.domain;
    const provider = report.deployment.provider;
    
    let message = `CDN Deployment ${status}\n`;
    message += `Domain: ${domain}\n`;
    message += `Provider: ${provider}\n`;
    message += `Environment: ${report.deployment.environment}\n`;
    message += `Timestamp: ${report.deployment.timestamp}\n\n`;

    if (report.security && !report.security.error) {
      message += `🔒 Security Score: ${report.security.scorePercentage}% (${report.security.grade})\n`;
    }

    if (report.performance && !report.performance.error) {
      message += `⚡ Avg Response Time: ${Math.round(report.performance.aggregate.avgResponseTime)}ms\n`;
      message += `📊 Availability: ${report.performance.aggregate.availability.toFixed(2)}%\n`;
    }

    if (report.summary.warnings.length > 0) {
      message += `\n⚠️ Warnings:\n${report.summary.warnings.map(w => `- ${w}`).join('\n')}\n`;
    }

    if (report.summary.errors.length > 0) {
      message += `\n❌ Errors:\n${report.summary.errors.map(e => `- ${e}`).join('\n')}\n`;
    }

    return message;
  }

  // Send webhook notification
  async sendWebhookNotification(message, report) {
    const https = require('https');
    const { URL } = require('url');

    const url = new URL(this.config.webhookUrl);
    
    const data = JSON.stringify({
      text: message,
      report: report,
      timestamp: new Date().toISOString()
    });

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`Webhook request failed: ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  // Send Slack notification
  async sendSlackNotification(message, report) {
    // Implement Slack notification logic here
    // This would typically use Slack's webhook API
    console.log('Slack notification:', message);
  }

  // Send failure notification
  async sendFailureNotification(error) {
    const message = `❌ CDN Deployment FAILED\n`;
    message += `Domain: ${this.config.domain}\n`;
    message += `Provider: ${this.config.provider}\n`;
    message += `Error: ${error.message}\n`;
    message += `Timestamp: ${new Date().toISOString()}`;

    if (this.config.webhookUrl) {
      try {
        await this.sendWebhookNotification(message, { error: error.message });
      } catch (notifError) {
        this.logger.warn(`Failed to send failure notification: ${notifError.message}`);
      }
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'deploy';

  const deployment = new CDNDeployment();

  try {
    switch (command) {
      case 'deploy':
        await deployment.deploy();
        break;
        
      case 'validate':
        await deployment.preDeploymentChecks();
        console.log('✅ Configuration validation passed');
        break;
        
      case 'build':
        await deployment.buildApplication();
        break;
        
      case 'security-scan':
        const domain = args[1] || deployment.config.domain;
        const scanner = new CDNSecurityScanner(domain);
        const results = await scanner.runFullScan();
        console.log(JSON.stringify(results, null, 2));
        break;
        
      case 'performance-test':
        const testDomain = args[1] || deployment.config.domain;
        const monitor = new CDNPerformanceMonitor({ domain: testDomain });
        const perfResults = await monitor.runPerformanceCheck();
        console.log(JSON.stringify(perfResults, null, 2));
        break;
        
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Available commands: deploy, validate, build, security-scan, performance-test');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

// Run CLI if called directly
if (require.main === module) {
  main();
}

module.exports = CDNDeployment;