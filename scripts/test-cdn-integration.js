#!/usr/bin/env node

/**
 * CDN Integration Test Suite
 * Comprehensive testing of CDN deployment, security, performance, and fallback mechanisms
 */

const CDNSecurityScanner = require('../cdn-config/security/security-scanner');
const CDNPerformanceMonitor = require('../cdn-config/monitoring/performance-monitor');
const { CDNManager } = require('../cdn-config');
const https = require('https');
const fs = require('fs');
const path = require('path');

class CDNIntegrationTester {
  constructor(config = {}) {
    this.config = {
      domain: config.domain || process.env.TEST_DOMAIN || 'localhost',
      testUrls: config.testUrls || [
        '/',
        '/assets/app.js',
        '/assets/app.css',
        '/assets/logo.png',
        '/health'
      ],
      providers: config.providers || ['netlify', 'cloudflare', 'vercel'],
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      ...config
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      domain: this.config.domain,
      tests: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  // Run complete integration test suite
  async runAllTests() {
    console.log(`🚀 Starting CDN Integration Tests for: ${this.config.domain}`);
    console.log(`⏰ Timestamp: ${this.results.timestamp}\n`);

    try {
      // Test 1: Basic Connectivity
      await this.testBasicConnectivity();

      // Test 2: Security Configuration
      await this.testSecurityConfiguration();

      // Test 3: Performance and Caching
      await this.testPerformanceAndCaching();

      // Test 4: Header Configuration
      await this.testHeaderConfiguration();

      // Test 5: Compression and Optimization
      await this.testCompressionOptimization();

      // Test 6: Fallback Mechanisms
      await this.testFallbackMechanisms();

      // Test 7: Multi-provider Testing (if configured)
      await this.testMultiProvider();

      // Test 8: Load Testing
      await this.testLoadHandling();

      // Test 9: Geographic Distribution
      await this.testGeographicDistribution();

      // Test 10: Monitoring and Alerting
      await this.testMonitoringCapabilities();

      // Generate final report
      this.generateFinalReport();

      return this.results;

    } catch (error) {
      console.error(`❌ Test suite failed: ${error.message}`);
      this.results.error = error.message;
      return this.results;
    }
  }

  // Test 1: Basic Connectivity
  async testBasicConnectivity() {
    console.log('🔗 Testing Basic Connectivity...');
    
    const test = {
      name: 'Basic Connectivity',
      status: 'running',
      results: []
    };

    try {
      for (const testUrl of this.config.testUrls) {
        const url = `https://${this.config.domain}${testUrl}`;
        
        try {
          const response = await this.makeRequest(url);
          const result = {
            url: testUrl,
            statusCode: response.statusCode,
            success: response.statusCode >= 200 && response.statusCode < 400,
            responseTime: response.responseTime,
            contentLength: response.contentLength || 0
          };
          
          test.results.push(result);
          
          if (result.success) {
            console.log(`  ✅ ${testUrl} - ${result.statusCode} (${result.responseTime}ms)`);
          } else {
            console.log(`  ❌ ${testUrl} - ${result.statusCode}`);
          }
        } catch (error) {
          test.results.push({
            url: testUrl,
            success: false,
            error: error.message
          });
          console.log(`  ❌ ${testUrl} - ${error.message}`);
        }
      }

      const successfulRequests = test.results.filter(r => r.success).length;
      test.status = successfulRequests === test.results.length ? 'passed' : 'failed';
      test.summary = `${successfulRequests}/${test.results.length} URLs accessible`;

      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      this.updateSummary('failed');
    }

    this.results.tests.basicConnectivity = test;
    console.log(`📊 Basic Connectivity: ${test.status.toUpperCase()}\n`);
  }

  // Test 2: Security Configuration
  async testSecurityConfiguration() {
    console.log('🔒 Testing Security Configuration...');
    
    const test = {
      name: 'Security Configuration',
      status: 'running',
      results: {}
    };

    try {
      const scanner = new CDNSecurityScanner(this.config.domain);
      const securityResults = await scanner.runFullScan();
      
      test.results = securityResults;
      test.score = securityResults.scorePercentage;
      test.grade = securityResults.grade;
      test.vulnerabilities = securityResults.vulnerabilities.length;
      
      // Determine test status based on security score
      if (securityResults.scorePercentage >= 80) {
        test.status = 'passed';
      } else if (securityResults.scorePercentage >= 60) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      console.log(`  📊 Security Score: ${securityResults.scorePercentage}% (${securityResults.grade})`);
      console.log(`  🔍 Vulnerabilities Found: ${securityResults.vulnerabilities.length}`);
      
      if (securityResults.vulnerabilities.length > 0) {
        console.log('  🚨 Security Issues:');
        securityResults.vulnerabilities.forEach(vuln => {
          console.log(`    - [${vuln.severity.toUpperCase()}] ${vuln.description}`);
        });
      }

      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Security scan failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.securityConfiguration = test;
    console.log(`📊 Security Configuration: ${test.status.toUpperCase()}\n`);
  }

  // Test 3: Performance and Caching
  async testPerformanceAndCaching() {
    console.log('⚡ Testing Performance and Caching...');
    
    const test = {
      name: 'Performance and Caching',
      status: 'running',
      results: {}
    };

    try {
      const monitor = new CDNPerformanceMonitor({
        domain: this.config.domain,
        testUrls: this.config.testUrls
      });
      
      const perfResults = await monitor.runPerformanceCheck();
      
      test.results = perfResults;
      test.avgResponseTime = perfResults.aggregate.avgResponseTime;
      test.availability = perfResults.aggregate.availability;
      test.cacheHitRatio = perfResults.aggregate.cacheHitRatio;
      
      // Performance thresholds
      const responseTimeGood = test.avgResponseTime < 1000;
      const availabilityGood = test.availability > 99;
      const cacheRatioGood = test.cacheHitRatio > 70;
      
      if (responseTimeGood && availabilityGood && cacheRatioGood) {
        test.status = 'passed';
      } else if (test.avgResponseTime < 2000 && test.availability > 95) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      console.log(`  📈 Avg Response Time: ${Math.round(test.avgResponseTime)}ms`);
      console.log(`  📊 Availability: ${test.availability.toFixed(2)}%`);
      console.log(`  💾 Cache Hit Ratio: ${test.cacheHitRatio.toFixed(2)}%`);
      
      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Performance test failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.performanceAndCaching = test;
    console.log(`📊 Performance and Caching: ${test.status.toUpperCase()}\n`);
  }

  // Test 4: Header Configuration
  async testHeaderConfiguration() {
    console.log('📋 Testing Header Configuration...');
    
    const test = {
      name: 'Header Configuration',
      status: 'running',
      results: {}
    };

    try {
      const response = await this.makeRequest(`https://${this.config.domain}/`);
      const headers = response.headers;
      
      // Required security headers
      const requiredHeaders = {
        'x-frame-options': 'X-Frame-Options',
        'x-content-type-options': 'X-Content-Type-Options',
        'strict-transport-security': 'HSTS',
        'content-security-policy': 'CSP',
        'referrer-policy': 'Referrer Policy'
      };
      
      const headerTests = {};
      let passedHeaders = 0;
      
      for (const [headerKey, headerName] of Object.entries(requiredHeaders)) {
        const headerValue = headers[headerKey.toLowerCase()];
        const isPresent = !!headerValue;
        
        headerTests[headerName] = {
          present: isPresent,
          value: headerValue || 'Not set'
        };
        
        if (isPresent) {
          passedHeaders++;
          console.log(`  ✅ ${headerName}: ${headerValue}`);
        } else {
          console.log(`  ❌ ${headerName}: Not configured`);
        }
      }
      
      // Check caching headers for different resource types
      const staticAssetResponse = await this.makeRequest(`https://${this.config.domain}/assets/app.js`);
      if (staticAssetResponse.headers['cache-control']) {
        headerTests['Static Asset Caching'] = {
          present: true,
          value: staticAssetResponse.headers['cache-control']
        };
        console.log(`  ✅ Static Asset Caching: ${staticAssetResponse.headers['cache-control']}`);
      }
      
      test.results = headerTests;
      test.passedHeaders = passedHeaders;
      test.totalHeaders = Object.keys(requiredHeaders).length;
      
      // Determine status
      if (passedHeaders === test.totalHeaders) {
        test.status = 'passed';
      } else if (passedHeaders >= test.totalHeaders * 0.7) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Header test failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.headerConfiguration = test;
    console.log(`📊 Header Configuration: ${test.status.toUpperCase()}\n`);
  }

  // Test 5: Compression and Optimization
  async testCompressionOptimization() {
    console.log('🗜️ Testing Compression and Optimization...');
    
    const test = {
      name: 'Compression and Optimization',
      status: 'running',
      results: {}
    };

    try {
      const testUrls = [
        { path: '/', type: 'HTML' },
        { path: '/assets/app.js', type: 'JavaScript' },
        { path: '/assets/app.css', type: 'CSS' }
      ];
      
      const compressionResults = {};
      let passedTests = 0;
      
      for (const testUrl of testUrls) {
        try {
          const response = await this.makeRequest(`https://${this.config.domain}${testUrl.path}`, {
            'Accept-Encoding': 'gzip, deflate, br'
          });
          
          const encoding = response.headers['content-encoding'];
          const isCompressed = !!encoding;
          
          compressionResults[testUrl.type] = {
            compressed: isCompressed,
            encoding: encoding || 'none',
            size: response.contentLength || 0
          };
          
          if (isCompressed) {
            passedTests++;
            console.log(`  ✅ ${testUrl.type} compressed with ${encoding}`);
          } else {
            console.log(`  ⚠️ ${testUrl.type} not compressed`);
          }
        } catch (error) {
          compressionResults[testUrl.type] = {
            compressed: false,
            error: error.message
          };
          console.log(`  ❌ ${testUrl.type} test failed: ${error.message}`);
        }
      }
      
      test.results = compressionResults;
      test.passedTests = passedTests;
      test.totalTests = testUrls.length;
      
      // Determine status
      if (passedTests >= test.totalTests * 0.8) {
        test.status = 'passed';
      } else if (passedTests >= test.totalTests * 0.5) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Compression test failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.compressionOptimization = test;
    console.log(`📊 Compression and Optimization: ${test.status.toUpperCase()}\n`);
  }

  // Test 6: Fallback Mechanisms
  async testFallbackMechanisms() {
    console.log('🔄 Testing Fallback Mechanisms...');
    
    const test = {
      name: 'Fallback Mechanisms',
      status: 'running',
      results: {}
    };

    try {
      // Test CDN fallback capabilities
      const cdnManager = new CDNManager('netlify'); // Primary provider
      const fallbackResult = await cdnManager.testFallback();
      
      test.results = fallbackResult;
      
      const primaryAvailable = fallbackResult.primary.available;
      const secondaryAvailable = fallbackResult.secondary.available;
      const localAvailable = fallbackResult.local.available;
      
      console.log(`  📡 Primary CDN (${fallbackResult.primary.provider}): ${primaryAvailable ? '✅ Available' : '❌ Unavailable'}`);
      console.log(`  📡 Secondary CDN (${fallbackResult.secondary.provider}): ${secondaryAvailable ? '✅ Available' : '❌ Unavailable'}`);
      console.log(`  💾 Local Fallback: ${localAvailable ? '✅ Available' : '❌ Unavailable'}`);
      
      // Test status determination
      if (primaryAvailable && (secondaryAvailable || localAvailable)) {
        test.status = 'passed';
      } else if (primaryAvailable) {
        test.status = 'warning';
      } else if (secondaryAvailable || localAvailable) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Fallback test failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.fallbackMechanisms = test;
    console.log(`📊 Fallback Mechanisms: ${test.status.toUpperCase()}\n`);
  }

  // Test 7: Multi-provider Testing
  async testMultiProvider() {
    console.log('🌐 Testing Multi-provider Configuration...');
    
    const test = {
      name: 'Multi-provider Testing',
      status: 'running',
      results: {}
    };

    try {
      const providerResults = {};
      
      for (const provider of this.config.providers) {
        try {
          const cdnManager = new CDNManager(provider);
          const validation = await cdnManager.validateConfiguration();
          
          providerResults[provider] = {
            valid: validation.valid,
            errors: validation.errors,
            warnings: validation.warnings
          };
          
          if (validation.valid) {
            console.log(`  ✅ ${provider.toUpperCase()}: Configuration valid`);
          } else {
            console.log(`  ❌ ${provider.toUpperCase()}: ${validation.errors.join(', ')}`);
          }
        } catch (error) {
          providerResults[provider] = {
            valid: false,
            error: error.message
          };
          console.log(`  ❌ ${provider.toUpperCase()}: ${error.message}`);
        }
      }
      
      test.results = providerResults;
      
      const validProviders = Object.values(providerResults).filter(r => r.valid).length;
      
      if (validProviders >= 2) {
        test.status = 'passed';
      } else if (validProviders >= 1) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Multi-provider test failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.multiProvider = test;
    console.log(`📊 Multi-provider Testing: ${test.status.toUpperCase()}\n`);
  }

  // Test 8: Load Testing
  async testLoadHandling() {
    console.log('📈 Testing Load Handling...');
    
    const test = {
      name: 'Load Handling',
      status: 'running',
      results: {}
    };

    try {
      const concurrentRequests = 20;
      const testUrl = `https://${this.config.domain}/`;
      
      console.log(`  🚀 Making ${concurrentRequests} concurrent requests...`);
      
      const startTime = Date.now();
      const promises = Array(concurrentRequests).fill().map(() => this.makeRequest(testUrl));
      
      const responses = await Promise.allSettled(promises);
      const endTime = Date.now();
      
      const successful = responses.filter(r => r.status === 'fulfilled' && r.value.statusCode < 400).length;
      const failed = responses.length - successful;
      const avgTime = (endTime - startTime) / concurrentRequests;
      
      test.results = {
        totalRequests: concurrentRequests,
        successful: successful,
        failed: failed,
        successRate: (successful / concurrentRequests) * 100,
        avgResponseTime: avgTime,
        totalTime: endTime - startTime
      };
      
      console.log(`  📊 Success Rate: ${test.results.successRate.toFixed(2)}% (${successful}/${concurrentRequests})`);
      console.log(`  ⏱️ Average Response Time: ${avgTime.toFixed(2)}ms`);
      console.log(`  🕐 Total Time: ${test.results.totalTime}ms`);
      
      // Determine status
      if (test.results.successRate >= 95 && avgTime < 2000) {
        test.status = 'passed';
      } else if (test.results.successRate >= 90) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Load test failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.loadHandling = test;
    console.log(`📊 Load Handling: ${test.status.toUpperCase()}\n`);
  }

  // Test 9: Geographic Distribution
  async testGeographicDistribution() {
    console.log('🗺️ Testing Geographic Distribution...');
    
    const test = {
      name: 'Geographic Distribution',
      status: 'running',
      results: {}
    };

    try {
      // Simulate testing from different regions
      const regions = ['us-east-1', 'eu-west-1', 'ap-southeast-1'];
      const regionResults = {};
      
      for (const region of regions) {
        try {
          // Add simulated latency based on region
          const baseLatency = this.getRegionLatency(region);
          const startTime = Date.now();
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, baseLatency));
          
          const response = await this.makeRequest(`https://${this.config.domain}/`);
          const totalTime = Date.now() - startTime;
          
          regionResults[region] = {
            success: response.statusCode < 400,
            responseTime: totalTime,
            statusCode: response.statusCode,
            simulatedLatency: baseLatency
          };
          
          console.log(`  🌍 ${region}: ${response.statusCode} (${totalTime}ms)`);
        } catch (error) {
          regionResults[region] = {
            success: false,
            error: error.message
          };
          console.log(`  ❌ ${region}: ${error.message}`);
        }
      }
      
      test.results = regionResults;
      
      const successfulRegions = Object.values(regionResults).filter(r => r.success).length;
      const avgLatency = Object.values(regionResults)
        .filter(r => r.success && r.responseTime)
        .reduce((sum, r) => sum + r.responseTime, 0) / successfulRegions;
      
      test.avgLatency = avgLatency;
      test.successfulRegions = successfulRegions;
      
      // Determine status
      if (successfulRegions === regions.length && avgLatency < 3000) {
        test.status = 'passed';
      } else if (successfulRegions >= regions.length * 0.8) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Geographic distribution test failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.geographicDistribution = test;
    console.log(`📊 Geographic Distribution: ${test.status.toUpperCase()}\n`);
  }

  // Test 10: Monitoring Capabilities
  async testMonitoringCapabilities() {
    console.log('📊 Testing Monitoring Capabilities...');
    
    const test = {
      name: 'Monitoring Capabilities',
      status: 'running',
      results: {}
    };

    try {
      const monitor = new CDNPerformanceMonitor({
        domain: this.config.domain,
        testUrls: ['/'],
        thresholds: {
          responseTime: 2000,
          availability: 99.0,
          errorRate: 5.0
        }
      });
      
      // Test monitoring initialization
      const monitoringTest = await monitor.runPerformanceCheck();
      const status = monitor.getStatus();
      
      test.results = {
        monitoringWorks: !!monitoringTest,
        status: status,
        metricsAvailable: Object.keys(monitor.metrics).length > 0
      };
      
      console.log(`  📈 Monitoring System: ${test.results.monitoringWorks ? '✅ Working' : '❌ Failed'}`);
      console.log(`  📊 Metrics Available: ${test.results.metricsAvailable ? '✅ Yes' : '❌ No'}`);
      console.log(`  🔍 Status: ${status.status}`);
      
      // Determine status
      if (test.results.monitoringWorks && test.results.metricsAvailable) {
        test.status = 'passed';
      } else if (test.results.monitoringWorks) {
        test.status = 'warning';
      } else {
        test.status = 'failed';
      }
      
      this.updateSummary(test.status);

    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      console.log(`  ❌ Monitoring test failed: ${error.message}`);
      this.updateSummary('failed');
    }

    this.results.tests.monitoringCapabilities = test;
    console.log(`📊 Monitoring Capabilities: ${test.status.toUpperCase()}\n`);
  }

  // Helper method to make HTTP requests
  async makeRequest(url, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
      const { URL } = require('url');
      const urlObj = new URL(url);
      const startTime = Date.now();
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'CDN-Integration-Tester/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          ...extraHeaders
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            responseTime: Date.now() - startTime,
            contentLength: parseInt(res.headers['content-length'] || '0')
          });
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.abort();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  // Get simulated region latency
  getRegionLatency(region) {
    const latencies = {
      'us-east-1': 50,
      'us-west-2': 80,
      'eu-west-1': 120,
      'eu-central-1': 140,
      'ap-southeast-1': 200,
      'ap-northeast-1': 180
    };
    
    return latencies[region] || 150;
  }

  // Update test summary
  updateSummary(status) {
    this.results.summary.total++;
    
    if (status === 'passed') {
      this.results.summary.passed++;
    } else if (status === 'warning') {
      this.results.summary.warnings++;
    } else {
      this.results.summary.failed++;
    }
  }

  // Generate final report
  generateFinalReport() {
    console.log('=' .repeat(80));
    console.log('📋 CDN INTEGRATION TEST REPORT');
    console.log('=' .repeat(80));
    console.log(`Domain: ${this.results.domain}`);
    console.log(`Test Time: ${this.results.timestamp}`);
    console.log(`\nSUMMARY:`);
    console.log(`Total Tests: ${this.results.summary.total}`);
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`⚠️ Warnings: ${this.results.summary.warnings}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    
    const successRate = (this.results.summary.passed / this.results.summary.total) * 100;
    console.log(`\n📊 Success Rate: ${successRate.toFixed(2)}%`);
    
    // Overall status
    let overallStatus;
    if (this.results.summary.failed === 0 && this.results.summary.warnings === 0) {
      overallStatus = '🟢 EXCELLENT';
    } else if (this.results.summary.failed === 0) {
      overallStatus = '🟡 GOOD (with warnings)';
    } else if (this.results.summary.failed <= 2) {
      overallStatus = '🟠 NEEDS ATTENTION';
    } else {
      overallStatus = '🔴 CRITICAL ISSUES';
    }
    
    console.log(`\n🎯 Overall Status: ${overallStatus}`);
    
    // Save detailed report
    const reportPath = path.join(process.cwd(), 'cdn-integration-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);
    
    console.log('=' .repeat(80));
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const domain = args[0] || process.env.TEST_DOMAIN;
  
  if (!domain) {
    console.error('❌ Error: Domain is required');
    console.log('Usage: node test-cdn-integration.js <domain>');
    console.log('   or: TEST_DOMAIN=example.com node test-cdn-integration.js');
    process.exit(1);
  }
  
  const tester = new CDNIntegrationTester({ domain });
  
  try {
    await tester.runAllTests();
    
    // Exit with appropriate code based on results
    if (tester.results.summary.failed > 0) {
      process.exit(1);
    } else if (tester.results.summary.warnings > 0) {
      process.exit(2);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run CLI if called directly
if (require.main === module) {
  main();
}

module.exports = CDNIntegrationTester;