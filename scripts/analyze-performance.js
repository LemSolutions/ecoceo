#!/usr/bin/env node

/**
 * Performance Analysis Script
 * Uses Lighthouse to analyze website performance
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(process.cwd(), 'performance-reports');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportPath = path.join(OUTPUT_DIR, `lighthouse-report-${timestamp}.html`);
const jsonReportPath = path.join(OUTPUT_DIR, `lighthouse-report-${timestamp}.json`);

console.log('🚀 Starting Lighthouse performance analysis...');
console.log(`📊 Analyzing: ${SITE_URL}`);
console.log(`📁 Reports will be saved to: ${OUTPUT_DIR}`);

// Lighthouse command
const lighthouseArgs = [
  SITE_URL,
  '--output=html',
  '--output=json',
  '--output-path=' + reportPath,
  '--chrome-flags="--headless"',
  '--only-categories=performance,accessibility,best-practices,seo',
  '--view'
];

const lighthouse = spawn('lighthouse', lighthouseArgs, {
  stdio: 'inherit',
  shell: true
});

lighthouse.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Performance analysis completed!');
    console.log(`📄 HTML Report: ${reportPath}`);
    console.log(`📄 JSON Report: ${jsonReportPath}`);
    console.log('\n💡 Tips:');
    console.log('   - Open the HTML report in your browser to see detailed results');
    console.log('   - Check the JSON report for programmatic access to metrics');
    console.log('   - Run this script after making performance improvements');
    
    // Try to read and display summary if JSON exists
    if (fs.existsSync(jsonReportPath)) {
      try {
        const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
        const scores = report.categories;
        
        console.log('\n📊 Performance Scores:');
        console.log(`   Performance: ${Math.round(scores.performance?.score * 100 || 0)}/100`);
        console.log(`   Accessibility: ${Math.round(scores.accessibility?.score * 100 || 0)}/100`);
        console.log(`   Best Practices: ${Math.round(scores['best-practices']?.score * 100 || 0)}/100`);
        console.log(`   SEO: ${Math.round(scores.seo?.score * 100 || 0)}/100`);
        
        // Display key metrics
        if (report.audits) {
          console.log('\n⚡ Key Metrics:');
          const metrics = [
            'first-contentful-paint',
            'largest-contentful-paint',
            'total-blocking-time',
            'cumulative-layout-shift',
            'speed-index'
          ];
          
          metrics.forEach(metric => {
            const audit = report.audits[metric];
            if (audit) {
              const value = audit.numericValue !== undefined 
                ? `${audit.numericValue.toFixed(2)}${audit.numericUnit || ''}` 
                : audit.displayValue || 'N/A';
              console.log(`   ${audit.title}: ${value}`);
            }
          });
        }
      } catch (error) {
        console.log('Could not parse JSON report for summary');
      }
    }
  } else {
    console.error('\n❌ Lighthouse analysis failed with code:', code);
    process.exit(1);
  }
});

lighthouse.on('error', (error) => {
  console.error('❌ Error running Lighthouse:', error);
  console.error('\n💡 Make sure:');
  console.error('   1. Lighthouse is installed: npm install -g lighthouse');
  console.error('   2. Your site is running (e.g., npm run dev)');
  console.error('   3. Chrome/Chromium is installed');
  process.exit(1);
});

