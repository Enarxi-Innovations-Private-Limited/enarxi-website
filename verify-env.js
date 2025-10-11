#!/usr/bin/env node

/**
 * Quick script to verify .env file has real Cloudinary credentials
 * Run: node verify-env.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  
  console.log('🔍 Checking .env file for Cloudinary credentials...\n');
  
  const lines = envContent.split('\n');
  const credentials = {
    VITE_CLOUDINARY_CLOUD_NAME: null,
    VITE_CLOUDINARY_API_KEY: null,
    VITE_CLOUDINARY_API_SECRET: null,
  };
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed.includes('=')) return;
    
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();
    
    if (credentials.hasOwnProperty(key.trim())) {
      credentials[key.trim()] = value;
    }
  });
  
  let hasIssues = false;
  
  // Check CLOUD_NAME
  if (!credentials.VITE_CLOUDINARY_CLOUD_NAME) {
    console.log('❌ VITE_CLOUDINARY_CLOUD_NAME: Missing');
    hasIssues = true;
  } else if (credentials.VITE_CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
    console.log('❌ VITE_CLOUDINARY_CLOUD_NAME: Still using placeholder value "your_cloud_name"');
    hasIssues = true;
  } else {
    console.log(`✅ VITE_CLOUDINARY_CLOUD_NAME: Set (${credentials.VITE_CLOUDINARY_CLOUD_NAME})`);
  }
  
  // Check API_KEY
  if (!credentials.VITE_CLOUDINARY_API_KEY) {
    console.log('❌ VITE_CLOUDINARY_API_KEY: Missing');
    hasIssues = true;
  } else if (credentials.VITE_CLOUDINARY_API_KEY === 'my-api-key') {
    console.log('❌ VITE_CLOUDINARY_API_KEY: Still using placeholder value "my-api-key"');
    hasIssues = true;
  } else {
    console.log(`✅ VITE_CLOUDINARY_API_KEY: Set (${credentials.VITE_CLOUDINARY_API_KEY.substring(0, 4)}...)`);
  }
  
  // Check API_SECRET
  if (!credentials.VITE_CLOUDINARY_API_SECRET) {
    console.log('❌ VITE_CLOUDINARY_API_SECRET: Missing');
    hasIssues = true;
  } else if (credentials.VITE_CLOUDINARY_API_SECRET === 'my-api-secret') {
    console.log('❌ VITE_CLOUDINARY_API_SECRET: Still using placeholder value "my-api-secret"');
    hasIssues = true;
  } else {
    console.log(`✅ VITE_CLOUDINARY_API_SECRET: Set (${credentials.VITE_CLOUDINARY_API_SECRET.substring(0, 4)}...)`);
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (hasIssues) {
    console.log('\n⚠️  ISSUES FOUND!');
    console.log('\n📝 Action Required:');
    console.log('1. Open .env file');
    console.log('2. Replace placeholder values with real Cloudinary credentials');
    console.log('3. Get credentials from: https://cloudinary.com/console');
    console.log('4. Restart your dev server (Ctrl+C and npm run dev)');
    console.log('\n📖 See CLOUDINARY_SETUP_GUIDE.md for detailed instructions');
  } else {
    console.log('\n✅ All Cloudinary credentials are set!');
    console.log('\n⚠️  IMPORTANT: Restart your dev server if you just updated .env');
    console.log('   (Vite only loads environment variables on startup)');
  }
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('❌ .env file not found!');
    console.log('\n📝 Action Required:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Replace placeholder values with real Cloudinary credentials');
    console.log('3. Get credentials from: https://cloudinary.com/console');
  } else {
    console.error('Error reading .env file:', error.message);
  }
}
