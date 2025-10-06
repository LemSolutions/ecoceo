require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Test Sanity connection and About data
const sanity = require('@sanity/client');

const client = sanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-12-05',
  useCdn: false, // Don't use CDN for testing
  token: process.env.SANITY_API_TOKEN, // Optional, for write operations
});

async function testAboutData() {
  console.log('🔍 Testing Sanity About data...');
  console.log('📋 Configuration:');
  console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log(`   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-12-05'}`);
  console.log('');

  try {
    // Test 1: Check if we can connect to Sanity
    console.log('1️⃣ Testing Sanity connection...');
    const allAbout = await client.fetch('*[_type == "about"]');
    console.log(`✅ Connected to Sanity successfully`);
    console.log(`📊 Found ${allAbout.length} About documents`);
    console.log('');

    // Test 2: Check active About sections
    console.log('2️⃣ Checking active About sections...');
    const activeAbout = await client.fetch('*[_type == "about" && isActive == true]');
    console.log(`📊 Found ${activeAbout.length} active About sections`);
    
    if (activeAbout.length > 0) {
      console.log('✅ Active About sections found:');
      activeAbout.forEach((about, index) => {
        console.log(`   ${index + 1}. ID: ${about._id}`);
        console.log(`      Title: ${about.title || 'No title'}`);
        console.log(`      Subtitle: ${about.subtitle || 'No subtitle'}`);
        console.log(`      Description: ${about.description ? about.description.substring(0, 100) + '...' : 'No description'}`);
        console.log(`      Features: ${about.features ? about.features.length : 0} items`);
        console.log(`      Stats: ${about.stats ? about.stats.length : 0} items`);
        console.log(`      Image: ${about.image ? 'Yes' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No active About sections found');
    }

    // Test 3: Check any About sections (fallback)
    console.log('3️⃣ Checking all About sections (fallback)...');
    if (allAbout.length > 0) {
      console.log('✅ About sections found (for fallback):');
      allAbout.forEach((about, index) => {
        console.log(`   ${index + 1}. ID: ${about._id}`);
        console.log(`      Title: ${about.title || 'No title'}`);
        console.log(`      Is Active: ${about.isActive ? 'Yes' : 'No'}`);
        console.log(`      Description: ${about.description ? about.description.substring(0, 50) + '...' : 'No description'}`);
        console.log('');
      });
    } else {
      console.log('❌ No About sections found at all');
    }

    // Test 4: Test the exact query used in the app
    console.log('4️⃣ Testing exact About query from app...');
    const aboutQuery = `*[_type == "about" && isActive == true][0] {
      _id,
      title,
      subtitle,
      description,
      image,
      features,
      stats
    }`;
    
    const result = await client.fetch(aboutQuery);
    console.log(`📊 Query result:`, result ? 'Data found' : 'No data');
    if (result) {
      console.log('✅ About data structure:');
      console.log(`   ID: ${result._id}`);
      console.log(`   Title: ${result.title}`);
      console.log(`   Subtitle: ${result.subtitle}`);
      console.log(`   Description: ${result.description ? 'Present' : 'Missing'}`);
      console.log(`   Image: ${result.image ? 'Present' : 'Missing'}`);
      console.log(`   Features: ${result.features ? result.features.length : 0} items`);
      console.log(`   Stats: ${result.stats ? result.stats.length : 0} items`);
    }

  } catch (error) {
    console.error('❌ Error testing Sanity About data:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      response: error.response?.body
    });
  }
}

testAboutData();
