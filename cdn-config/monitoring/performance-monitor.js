/**
 * CDN Performance Monitor
 * Comprehensive monitoring and performance testing for CDN deployments
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

class CDNPerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      domain: config.domain,
      testUrls: config.testUrls || [],
      regions: config.regions || ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
      thresholds: {
        responseTime: config.thresholds?.responseTime || 2000, // 2 seconds
        availability: config.thresholds?.availability || 99.0, // 99%
        errorRate: config.thresholds?.errorRate || 5.0, // 5%
        ...config.thresholds
      },
      alerting: config.alerting || {},
      storage: config.storage || './monitoring-data'
    };
    
    this.metrics = {
      responseTime: [],
      availability: [],
      throughput: [],
      errorRate: [],
      cacheHitRatio: [],
      bandwidthUsage: []
    };
    
    this.alerts = [];
    this.isMonitoring = false;
    
    // Ensure storage directory exists
    if (!fs.existsSync(this.config.storage)) {
      fs.mkdirSync(this.config.storage, { recursive: true });
    }
  }

  // Start continuous monitoring
  async startMonitoring(intervalMs = 60000) {
    if (this.isMonitoring) {
      console.log('Monitoring already running');
      return;
    }
    
    this.isMonitoring = true;
    console.log(`Starting CDN monitoring for ${this.config.domain} (interval: ${intervalMs}ms)`);
    
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.runPerformanceCheck();
        await this.checkHealth();
        await this.analyzeMetrics();
        await this.saveMetrics();
      } catch (error) {
        console.error('Monitoring cycle failed:', error);
        this.recordAlert('monitoring_error', `Monitoring cycle failed: ${error.message}`, 'high');
      }
    }, intervalMs);
    
    // Initial check
    await this.runPerformanceCheck();
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('CDN monitoring stopped');
  }

  // Run comprehensive performance check
  async runPerformanceCheck() {
    const timestamp = new Date().toISOString();
    console.log(`Running performance check at ${timestamp}`);
    
    const results = {
      timestamp,
      domain: this.config.domain,
      tests: []
    };
    
    try {
      // Test main domain
      const mainTest = await this.testEndpoint(this.config.domain, '/');
      results.tests.push(mainTest);
      
      // Test additional URLs
      for (const testUrl of this.config.testUrls) {
        const urlTest = await this.testEndpoint(this.config.domain, testUrl);
        results.tests.push(urlTest);
      }
      
      // Test from different regions (simulated)
      const regionalTests = await this.testFromRegions();
      results.regionalTests = regionalTests;
      
      // Calculate aggregate metrics
      const aggregateMetrics = this.calculateAggregateMetrics(results.tests);
      results.aggregate = aggregateMetrics;
      
      // Store metrics
      this.storeMetrics(aggregateMetrics);
      
      // Check for alerts
      this.checkAlertConditions(aggregateMetrics);
      
      return results;
      
    } catch (error) {
      console.error('Performance check failed:', error);
      this.recordAlert('performance_check_failed', error.message, 'high');
      throw error;
    }
  }

  // Test specific endpoint
  async testEndpoint(domain, path = '/') {
    const testStart = Date.now();
    const testResult = {
      url: `https://${domain}${path}`,
      timestamp: new Date().toISOString(),
      metrics: {}
    };
    
    try {
      // DNS Resolution Time
      const dnsStart = Date.now();
      await this.resolveDNS(domain);
      testResult.metrics.dnsTime = Date.now() - dnsStart;
      
      // TCP Connection Time
      const tcpStart = Date.now();
      const connectionInfo = await this.testTCPConnection(domain, 443);
      testResult.metrics.tcpTime = Date.now() - tcpStart;
      testResult.metrics.connected = connectionInfo.connected;
      
      // SSL Handshake Time
      const sslStart = Date.now();
      const sslInfo = await this.testSSLHandshake(domain);
      testResult.metrics.sslTime = Date.now() - sslStart;
      testResult.metrics.sslProtocol = sslInfo.protocol;
      
      // HTTP Request Time
      const httpStart = Date.now();
      const response = await this.makeHTTPRequest(`https://${domain}${path}`);
      testResult.metrics.httpTime = Date.now() - httpStart;
      
      // Response metrics
      testResult.metrics.statusCode = response.statusCode;
      testResult.metrics.responseSize = response.contentLength || response.body?.length || 0;
      testResult.metrics.headers = response.headers;
      
      // Cache metrics
      testResult.metrics.cacheStatus = this.extractCacheStatus(response.headers);
      testResult.metrics.cacheHit = testResult.metrics.cacheStatus === 'HIT';
      
      // Total time
      testResult.metrics.totalTime = Date.now() - testStart;
      
      // First Byte Time (TTFB)
      testResult.metrics.ttfb = testResult.metrics.dnsTime + 
                                testResult.metrics.tcpTime + 
                                testResult.metrics.sslTime + 
                                (response.firstByteTime || 0);
      
      // Content delivery metrics
      if (response.body) {
        const contentStart = Date.now();
        // Simulate content processing
        testResult.metrics.contentTime = Date.now() - contentStart;
      }
      
      // Success indicators
      testResult.success = response.statusCode >= 200 && response.statusCode < 400;
      testResult.error = null;
      
    } catch (error) {
      testResult.success = false;
      testResult.error = error.message;
      testResult.metrics.totalTime = Date.now() - testStart;
      console.error(`Endpoint test failed for ${testResult.url}:`, error);
    }
    
    return testResult;
  }

  // Test from different regions (simulated)
  async testFromRegions() {
    const regionalTests = {};
    
    for (const region of this.config.regions) {
      try {
        // Simulate testing from different regions
        // In production, this would use actual regional endpoints or services
        const regionTest = await this.simulateRegionalTest(region);
        regionalTests[region] = regionTest;
      } catch (error) {
        regionalTests[region] = {
          error: error.message,
          success: false
        };
      }
    }
    
    return regionalTests;
  }

  // Simulate regional testing
  async simulateRegionalTest(region) {
    // Add simulated latency based on region
    const baseLatency = this.getRegionLatency(region);
    const jitter = Math.random() * 100; // Random jitter up to 100ms
    
    const simulatedDelay = baseLatency + jitter;
    await new Promise(resolve => setTimeout(resolve, simulatedDelay));
    
    const test = await this.testEndpoint(this.config.domain, '/');
    
    // Add simulated regional characteristics
    test.region = region;
    test.metrics.simulatedLatency = simulatedDelay;
    test.metrics.totalTime += simulatedDelay;
    
    return test;
  }

  // Get base latency for region (simulated)
  getRegionLatency(region) {
    const latencies = {
      'us-east-1': 50,
      'us-west-2': 80,
      'eu-west-1': 120,
      'eu-central-1': 140,
      'ap-southeast-1': 200,
      'ap-northeast-1': 180,
      'sa-east-1': 300
    };
    
    return latencies[region] || 150;
  }

  // DNS resolution test
  async resolveDNS(domain) {
    return new Promise((resolve, reject) => {
      const dns = require('dns');
      dns.resolve4(domain, (err, addresses) => {
        if (err) {
          reject(new Error(`DNS resolution failed: ${err.message}`));
        } else {
          resolve(addresses);
        }
      });
    });
  }

  // TCP connection test
  async testTCPConnection(hostname, port) {
    return new Promise((resolve, reject) => {
      const net = require('net');
      const socket = new net.Socket();
      const timeout = 10000;
      
      const timer = setTimeout(() => {
        socket.destroy();
        reject(new Error('TCP connection timeout'));
      }, timeout);
      
      socket.connect(port, hostname, () => {
        clearTimeout(timer);
        socket.destroy();
        resolve({ connected: true });
      });
      
      socket.on('error', (err) => {
        clearTimeout(timer);
        reject(new Error(`TCP connection failed: ${err.message}`));
      });
    });
  }

  // SSL handshake test
  async testSSLHandshake(hostname) {
    return new Promise((resolve, reject) => {
      const tls = require('tls');
      const options = {
        host: hostname,
        port: 443,
        servername: hostname
      };
      
      const socket = tls.connect(options, () => {
        const protocol = socket.getProtocol();
        const cipher = socket.getCipher();
        socket.destroy();
        resolve({ protocol, cipher });
      });
      
      socket.on('error', (err) => {
        reject(new Error(`SSL handshake failed: ${err.message}`));
      });
      
      setTimeout(() => {
        socket.destroy();
        reject(new Error('SSL handshake timeout'));
      }, 10000);
    });
  }

  // Make HTTP request with detailed timing
  async makeHTTPRequest(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: 30000,
        headers: {
          'User-Agent': 'CDN-Performance-Monitor/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache'
        }
      };
      
      const protocol = urlObj.protocol === 'https:' ? https : http;
      let firstByteTime = null;
      let body = '';
      
      const req = protocol.request(options, (res) => {
        const startTime = Date.now();
        
        res.on('data', (chunk) => {
          if (firstByteTime === null) {
            firstByteTime = Date.now() - startTime;
          }
          body += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            contentLength: parseInt(res.headers['content-length'] || '0'),
            firstByteTime: firstByteTime
          });
        });
      });
      
      req.on('error', (err) => {
        reject(new Error(`HTTP request failed: ${err.message}`));
      });
      
      req.on('timeout', () => {
        req.abort();
        reject(new Error('HTTP request timeout'));
      });
      
      req.end();
    });
  }

  // Extract cache status from headers
  extractCacheStatus(headers) {
    // Check various CDN cache status headers
    const cacheHeaders = [
      'x-cache',
      'x-cache-status', 
      'cf-cache-status',
      'x-served-by',
      'x-fastly-cache-status'
    ];
    
    for (const header of cacheHeaders) {
      const value = headers[header];
      if (value) {
        if (value.toLowerCase().includes('hit')) return 'HIT';
        if (value.toLowerCase().includes('miss')) return 'MISS';
        if (value.toLowerCase().includes('bypass')) return 'BYPASS';
      }
    }
    
    return 'UNKNOWN';
  }

  // Calculate aggregate metrics
  calculateAggregateMetrics(tests) {
    const successfulTests = tests.filter(t => t.success);
    const failedTests = tests.filter(t => !t.success);
    
    if (successfulTests.length === 0) {
      return {
        availability: 0,
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        errorRate: 100,
        cacheHitRatio: 0,
        totalTests: tests.length,
        successfulTests: 0,
        failedTests: failedTests.length
      };
    }
    
    const responseTimes = successfulTests.map(t => t.metrics.totalTime);
    const cacheHits = successfulTests.filter(t => t.metrics.cacheHit).length;
    
    return {
      availability: (successfulTests.length / tests.length) * 100,
      avgResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      p95ResponseTime: this.calculatePercentile(responseTimes, 95),
      p99ResponseTime: this.calculatePercentile(responseTimes, 99),
      errorRate: (failedTests.length / tests.length) * 100,
      cacheHitRatio: (cacheHits / successfulTests.length) * 100,
      totalTests: tests.length,
      successfulTests: successfulTests.length,
      failedTests: failedTests.length,
      avgTTFB: successfulTests.reduce((sum, t) => sum + (t.metrics.ttfb || 0), 0) / successfulTests.length,
      avgContentSize: successfulTests.reduce((sum, t) => sum + (t.metrics.responseSize || 0), 0) / successfulTests.length
    };
  }

  // Calculate percentile
  calculatePercentile(values, percentile) {
    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  // Store metrics in memory and optionally to disk
  storeMetrics(metrics) {
    const timestamp = Date.now();
    
    // Store in memory
    this.metrics.responseTime.push({
      timestamp,
      avg: metrics.avgResponseTime,
      min: metrics.minResponseTime,
      max: metrics.maxResponseTime,
      p95: metrics.p95ResponseTime,
      p99: metrics.p99ResponseTime
    });
    
    this.metrics.availability.push({
      timestamp,
      value: metrics.availability
    });
    
    this.metrics.errorRate.push({
      timestamp,
      value: metrics.errorRate
    });
    
    this.metrics.cacheHitRatio.push({
      timestamp,  
      value: metrics.cacheHitRatio
    });
    
    // Keep only last 1000 data points in memory
    Object.keys(this.metrics).forEach(key => {
      if (this.metrics[key].length > 1000) {
        this.metrics[key] = this.metrics[key].slice(-1000);
      }
    });
  }

  // Check for alert conditions
  checkAlertConditions(metrics) {
    const alerts = [];
    
    // Response time alerts
    if (metrics.avgResponseTime > this.config.thresholds.responseTime) {
      alerts.push({
        type: 'response_time',
        severity: 'warning',
        message: `Average response time (${metrics.avgResponseTime}ms) exceeds threshold (${this.config.thresholds.responseTime}ms)`,
        value: metrics.avgResponseTime,
        threshold: this.config.thresholds.responseTime
      });
    }
    
    // Availability alerts
    if (metrics.availability < this.config.thresholds.availability) {
      alerts.push({
        type: 'availability',
        severity: 'critical',
        message: `Availability (${metrics.availability.toFixed(2)}%) below threshold (${this.config.thresholds.availability}%)`,
        value: metrics.availability,
        threshold: this.config.thresholds.availability
      });
    }
    
    // Error rate alerts
    if (metrics.errorRate > this.config.thresholds.errorRate) {
      alerts.push({
        type: 'error_rate',
        severity: 'warning',
        message: `Error rate (${metrics.errorRate.toFixed(2)}%) exceeds threshold (${this.config.thresholds.errorRate}%)`,
        value: metrics.errorRate,
        threshold: this.config.thresholds.errorRate
      });
    }
    
    // Process alerts
    for (const alert of alerts) {
      this.recordAlert(alert.type, alert.message, alert.severity, alert);
    }
  }

  // Record alert
  recordAlert(type, message, severity, details = {}) {
    const alert = {
      id: `${type}_${Date.now()}`,
      type,
      message,
      severity,
      timestamp: new Date().toISOString(),
      details,
      acknowledged: false
    };
    
    this.alerts.push(alert);
    console.log(`ALERT [${severity.toUpperCase()}]: ${message}`);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
    
    // Send alert if configured
    if (this.config.alerting.webhook) {
      this.sendWebhookAlert(alert);
    }
  }

  // Send webhook alert
  async sendWebhookAlert(alert) {
    try {
      const webhookUrl = this.config.alerting.webhook;
      const payload = {
        text: `CDN Alert: ${alert.message}`,
        alert: alert,
        domain: this.config.domain
      };
      
      await this.makeHTTPRequest(webhookUrl, 'POST', JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }

  // Health check
  async checkHealth() {
    try {
      const healthResult = await this.testEndpoint(this.config.domain, '/health');
      
      if (!healthResult.success) {
        this.recordAlert('health_check_failed', 'Health check endpoint failed', 'critical');
      }
      
      return healthResult;
    } catch (error) {
      this.recordAlert('health_check_error', `Health check error: ${error.message}`, 'high');
      return null;
    }
  }

  // Analyze metrics for trends
  async analyzeMetrics() {
    if (this.metrics.responseTime.length < 10) return; // Need minimum data points
    
    const recentMetrics = this.metrics.responseTime.slice(-10);
    const olderMetrics = this.metrics.responseTime.slice(-20, -10);
    
    if (olderMetrics.length === 0) return;
    
    const recentAvg = recentMetrics.reduce((sum, m) => sum + m.avg, 0) / recentMetrics.length;
    const olderAvg = olderMetrics.reduce((sum, m) => sum + m.avg, 0) / olderMetrics.length;
    
    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    // Alert on significant performance degradation
    if (changePercent > 50) {
      this.recordAlert(
        'performance_degradation',
        `Performance degraded by ${changePercent.toFixed(1)}% over recent measurements`,
        'warning',
        { recentAvg, olderAvg, changePercent }
      );
    }
    
    // Alert on performance improvement (positive news)
    if (changePercent < -30) {
      this.recordAlert(
        'performance_improvement',
        `Performance improved by ${Math.abs(changePercent).toFixed(1)}% over recent measurements`,
        'info',
        { recentAvg, olderAvg, changePercent }
      );
    }
  }

  // Save metrics to disk
  async saveMetrics() {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        domain: this.config.domain,
        metrics: this.metrics,
        alerts: this.alerts.slice(-50) // Save last 50 alerts
      };
      
      const filename = path.join(this.config.storage, `metrics-${Date.now()}.json`);
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
      
      // Clean up old files (keep last 24 hours of data)
      this.cleanupOldMetrics();
      
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }

  // Clean up old metric files
  cleanupOldMetrics() {
    try {
      const files = fs.readdirSync(this.config.storage);
      const metricsFiles = files.filter(f => f.startsWith('metrics-') && f.endsWith('.json'));
      
      const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
      
      for (const file of metricsFiles) {
        const filePath = path.join(this.config.storage, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old metrics:', error);
    }
  }

  // Get current status
  getStatus() {
    const latestMetrics = this.getLatestMetrics();
    const activeAlerts = this.alerts.filter(a => !a.acknowledged);
    
    return {
      domain: this.config.domain,
      isMonitoring: this.isMonitoring,
      lastCheck: latestMetrics?.timestamp || null,
      metrics: latestMetrics,
      activeAlerts: activeAlerts.length,
      totalAlerts: this.alerts.length,
      uptime: this.calculateUptime(),
      status: this.determineOverallStatus(latestMetrics, activeAlerts)
    };
  }

  // Get latest metrics
  getLatestMetrics() {
    if (this.metrics.responseTime.length === 0) return null;
    
    const latest = this.metrics.responseTime[this.metrics.responseTime.length - 1];
    const latestAvailability = this.metrics.availability[this.metrics.availability.length - 1];
    const latestErrorRate = this.metrics.errorRate[this.metrics.errorRate.length - 1];
    const latestCacheHit = this.metrics.cacheHitRatio[this.metrics.cacheHitRatio.length - 1];
    
    return {
      timestamp: latest.timestamp,
      responseTime: latest,
      availability: latestAvailability?.value || 0,
      errorRate: latestErrorRate?.value || 0,
      cacheHitRatio: latestCacheHit?.value || 0
    };
  }

  // Calculate uptime percentage
  calculateUptime() {
    if (this.metrics.availability.length === 0) return 100;
    
    const availabilitySum = this.metrics.availability.reduce((sum, a) => sum + a.value, 0);
    return availabilitySum / this.metrics.availability.length;
  }

  // Determine overall status
  determineOverallStatus(metrics, activeAlerts) {
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
    const warningAlerts = activeAlerts.filter(a => a.severity === 'warning');
    
    if (criticalAlerts.length > 0) return 'critical';
    if (warningAlerts.length > 0) return 'warning';
    if (!metrics) return 'unknown';
    if (metrics.availability < 95) return 'degraded';
    
    return 'healthy';
  }

  // Generate performance report
  generateReport(timeRange = '1h') {
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const cutoffTime = now - (timeRanges[timeRange] || timeRanges['1h']);
    
    const filteredMetrics = {
      responseTime: this.metrics.responseTime.filter(m => m.timestamp >= cutoffTime),
      availability: this.metrics.availability.filter(m => m.timestamp >= cutoffTime),
      errorRate: this.metrics.errorRate.filter(m => m.timestamp >= cutoffTime),
      cacheHitRatio: this.metrics.cacheHitRatio.filter(m => m.timestamp >= cutoffTime)
    };
    
    const report = {
      domain: this.config.domain,
      timeRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalDataPoints: filteredMetrics.responseTime.length,
        averageResponseTime: this.calculateAverage(filteredMetrics.responseTime, 'avg'),
        averageAvailability: this.calculateAverage(filteredMetrics.availability, 'value'),
        averageErrorRate: this.calculateAverage(filteredMetrics.errorRate, 'value'),
        averageCacheHitRatio: this.calculateAverage(filteredMetrics.cacheHitRatio, 'value')
      },
      charts: {
        responseTime: filteredMetrics.responseTime,
        availability: filteredMetrics.availability,
        errorRate: filteredMetrics.errorRate,
        cacheHitRatio: filteredMetrics.cacheHitRatio
      },
      alerts: this.alerts.filter(a => new Date(a.timestamp).getTime() >= cutoffTime),
      recommendations: this.generatePerformanceRecommendations(filteredMetrics)
    };
    
    return report;
  }

  // Calculate average for metrics
  calculateAverage(metrics, field) {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m[field], 0) / metrics.length;
  }

  // Generate performance recommendations
  generatePerformanceRecommendations(metrics) {
    const recommendations = [];
    
    const avgResponseTime = this.calculateAverage(metrics.responseTime, 'avg');
    const avgCacheHit = this.calculateAverage(metrics.cacheHitRatio, 'value');
    const avgAvailability = this.calculateAverage(metrics.availability, 'value');
    
    if (avgResponseTime > 1000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: 'Optimize Response Time',
        description: 'Average response time is high',
        suggestions: [
          'Enable compression (gzip/brotli)',
          'Optimize image sizes and formats',
          'Implement better caching strategies',
          'Consider using a CDN with more edge locations'
        ]
      });
    }
    
    if (avgCacheHit < 80) {
      recommendations.push({
        type: 'caching',
        priority: 'medium',
        title: 'Improve Cache Hit Ratio',
        description: 'Cache hit ratio is below optimal',
        suggestions: [
          'Review cache headers configuration',
          'Increase cache TTL for static assets',
          'Implement cache warming strategies',
          'Optimize cache key generation'
        ]
      });
    }
    
    if (avgAvailability < 99) {
      recommendations.push({
        type: 'reliability',
        priority: 'critical',
        title: 'Improve Availability',
        description: 'Availability is below target',
        suggestions: [
          'Implement multiple origin servers',
          'Set up health checks and failover',
          'Review error handling and retry logic',
          'Consider multi-CDN setup for redundancy'
        ]
      });
    }
    
    return recommendations;
  }
}

module.exports = CDNPerformanceMonitor;