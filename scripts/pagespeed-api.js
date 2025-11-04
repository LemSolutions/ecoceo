#!/usr/bin/env node

/**
 * PageSpeed Insights API Integration
 * Uses Google's PageSpeed Insights API to analyze website performance
 * 
 * Free tier: 25,000 requests per day
 * Get API key: https://console.cloud.google.com/apis/credentials
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || '';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const STRATEGY = process.env.STRATEGY || 'mobile'; // 'mobile' or 'desktop'
const OUTPUT_DIR = path.join(process.cwd(), 'performance-reports');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!API_KEY) {
  console.error('❌ Error: GOOGLE_PAGESPEED_API_KEY environment variable is required');
  console.error('\n💡 To get your API key:');
  console.error('   1. Go to: https://console.cloud.google.com/apis/credentials');
  console.error('   2. Create a new API key or use existing one');
  console.error('   3. Enable "PageSpeed Insights API" for your project');
  console.error('   4. Set it in your .env.local file:');
  console.error('      GOOGLE_PAGESPEED_API_KEY=your_api_key_here');
  console.error('\n📝 Or run with:');
  console.error('   GOOGLE_PAGESPEED_API_KEY=your_key npm run analyze:pagespeed');
  process.exit(1);
}

const API_URL = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL)}&strategy=${STRATEGY}&key=${API_KEY}`;

console.log('🚀 Starting PageSpeed Insights API analysis...');
console.log(`📊 Analyzing: ${SITE_URL}`);
console.log(`📱 Strategy: ${STRATEGY}`);
console.log(`📁 Reports will be saved to: ${OUTPUT_DIR}\n`);

// Make API request
https.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);

      if (result.error) {
        console.error('❌ API Error:', result.error.message);
        if (result.error.status === 'INVALID_ARGUMENT') {
          console.error('   Check your API key and URL');
        } else if (result.error.status === 'PERMISSION_DENIED') {
          console.error('   API key may not have PageSpeed Insights API enabled');
        }
        process.exit(1);
      }

      // Extract scores
      const lighthouseResult = result.lighthouseResult;
      const categories = lighthouseResult.categories;
      const audits = lighthouseResult.audits;

      console.log('✅ Analysis completed!\n');
      console.log('📊 Performance Scores:');
      console.log(`   Performance: ${Math.round(categories.performance?.score * 100 || 0)}/100`);
      console.log(`   Accessibility: ${Math.round(categories.accessibility?.score * 100 || 0)}/100`);
      console.log(`   Best Practices: ${Math.round(categories['best-practices']?.score * 100 || 0)}/100`);
      console.log(`   SEO: ${Math.round(categories.seo?.score * 100 || 0)}/100`);

      // Core Web Vitals
      console.log('\n⚡ Core Web Vitals:');
      const lcp = audits['largest-contentful-paint'];
      const fid = audits['max-potential-fid'] || audits['first-input-delay'];
      const cls = audits['cumulative-layout-shift'];
      
      if (lcp) {
        const lcpValue = (lcp.numericValue / 1000).toFixed(2);
        const lcpRating = lcp.score >= 0.75 ? '✅ Good' : lcp.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor';
        console.log(`   LCP (Largest Contentful Paint): ${lcpValue}s ${lcpRating}`);
      }
      
      if (fid) {
        const fidValue = fid.numericValue?.toFixed(0) || 'N/A';
        const fidRating = fid.score >= 0.75 ? '✅ Good' : fid.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor';
        console.log(`   FID (First Input Delay): ${fidValue}ms ${fidRating}`);
      }
      
      if (cls) {
        const clsValue = cls.numericValue?.toFixed(3) || 'N/A';
        const clsRating = cls.score >= 0.75 ? '✅ Good' : cls.score >= 0.5 ? '⚠️ Needs Improvement' : '❌ Poor';
        console.log(`   CLS (Cumulative Layout Shift): ${clsValue} ${clsRating}`);
      }

      // Key metrics
      console.log('\n📈 Key Metrics:');
      const metrics = [
        { key: 'first-contentful-paint', label: 'First Contentful Paint' },
        { key: 'speed-index', label: 'Speed Index' },
        { key: 'total-blocking-time', label: 'Total Blocking Time' },
        { key: 'interactive', label: 'Time to Interactive' }
      ];

      metrics.forEach(({ key, label }) => {
        const audit = audits[key];
        if (audit && audit.numericValue !== undefined) {
          const value = (audit.numericValue / 1000).toFixed(2);
          console.log(`   ${label}: ${value}s`);
        }
      });

      // Opportunities (improvements)
      console.log('\n💡 Top Opportunities:');
      const opportunities = Object.values(audits)
        .filter(audit => audit.details && audit.details.type === 'opportunity' && audit.numericValue)
        .sort((a, b) => b.numericValue - a.numericValue)
        .slice(0, 5);

      opportunities.forEach((opp, index) => {
        const savings = (opp.numericValue / 1000).toFixed(2);
        console.log(`   ${index + 1}. ${opp.title}: Save ~${savings}s`);
      });

      // Save JSON report
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const jsonReportPath = path.join(OUTPUT_DIR, `pagespeed-${STRATEGY}-${timestamp}.json`);
      fs.writeFileSync(jsonReportPath, JSON.stringify(result, null, 2));
      console.log(`\n📄 Full report saved to: ${jsonReportPath}`);

      // Generate summary HTML
      const htmlReportPath = path.join(OUTPUT_DIR, `pagespeed-${STRATEGY}-${timestamp}.html`);
      const html = generateHTMLReport(result, SITE_URL, STRATEGY);
      fs.writeFileSync(htmlReportPath, html);
      console.log(`📄 HTML report saved to: ${htmlReportPath}`);

      console.log('\n✨ Analysis complete!');
      console.log('💡 Tip: Open the HTML report in your browser for detailed results');

    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Response:', data.substring(0, 500));
      process.exit(1);
    }
  });
}).on('error', (error) => {
  console.error('❌ Request error:', error.message);
  console.error('\n💡 Check:');
  console.error('   - Your internet connection');
  console.error('   - API key is correct');
  console.error('   - PageSpeed Insights API is enabled');
  process.exit(1);
});

function generateHTMLReport(data, url, strategy) {
  const categories = data.lighthouseResult.categories;
  const audits = data.lighthouseResult.audits;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PageSpeed Insights Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .score-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .score-value { font-size: 48px; font-weight: bold; margin: 10px 0; }
    .score-good { color: #0cce6b; }
    .score-ok { color: #ffa400; }
    .score-bad { color: #f44336; }
    .metrics { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .opportunities { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .opportunity { padding: 15px; margin: 10px 0; background: #fff3cd; border-left: 4px solid #ffa400; border-radius: 4px; }
    h1 { color: #333; }
    h2 { color: #555; margin: 20px 0 10px 0; }
    .info { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 PageSpeed Insights Report</h1>
      <p class="info">URL: ${url}</p>
      <p class="info">Strategy: ${strategy}</p>
      <p class="info">Date: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="scores">
      <div class="score-card">
        <h3>Performance</h3>
        <div class="score-value ${getScoreClass(categories.performance?.score)}">${Math.round(categories.performance?.score * 100 || 0)}</div>
      </div>
      <div class="score-card">
        <h3>Accessibility</h3>
        <div class="score-value ${getScoreClass(categories.accessibility?.score)}">${Math.round(categories.accessibility?.score * 100 || 0)}</div>
      </div>
      <div class="score-card">
        <h3>Best Practices</h3>
        <div class="score-value ${getScoreClass(categories['best-practices']?.score)}">${Math.round(categories['best-practices']?.score * 100 || 0)}</div>
      </div>
      <div class="score-card">
        <h3>SEO</h3>
        <div class="score-value ${getScoreClass(categories.seo?.score)}">${Math.round(categories.seo?.score * 100 || 0)}</div>
      </div>
    </div>
    
    <div class="metrics">
      <h2>⚡ Core Web Vitals</h2>
      ${generateMetric(audits['largest-contentful-paint'], 'LCP')}
      ${generateMetric(audits['max-potential-fid'] || audits['first-input-delay'], 'FID')}
      ${generateMetric(audits['cumulative-layout-shift'], 'CLS')}
    </div>
    
    <div class="opportunities">
      <h2>💡 Top Opportunities</h2>
      ${generateOpportunities(audits)}
    </div>
  </div>
</body>
</html>`;

  function getScoreClass(score) {
    if (score >= 0.9) return 'score-good';
    if (score >= 0.5) return 'score-ok';
    return 'score-bad';
  }

  function generateMetric(audit, label) {
    if (!audit || audit.numericValue === undefined) return '';
    const value = (audit.numericValue / 1000).toFixed(2);
    const rating = audit.score >= 0.75 ? '✅' : audit.score >= 0.5 ? '⚠️' : '❌';
    return `<div class="metric"><span>${rating} ${label}</span><span>${value}s</span></div>`;
  }

  function generateOpportunities(audits) {
    const opps = Object.values(audits)
      .filter(audit => audit.details && audit.details.type === 'opportunity' && audit.numericValue)
      .sort((a, b) => b.numericValue - a.numericValue)
      .slice(0, 5);
    
    return opps.map(opp => {
      const savings = (opp.numericValue / 1000).toFixed(2);
      return `<div class="opportunity"><strong>${opp.title}</strong><br>Save ~${savings}s</div>`;
    }).join('');
  }
}

