#!/usr/bin/env node

/**
 * Environment Validation Script
 * Run this script to validate your .env configuration
 * 
 * Usage: node scripts/validate-env.js
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const REQUIRED_VARS = [
  'EXPO_PUBLIC_API_KEY',
  'EXPO_PUBLIC_AUTH_DOMAIN',
  'EXPO_PUBLIC_PROJECT_ID',
  'EXPO_PUBLIC_APP_ID'
];

// Optional environment variables with defaults
const OPTIONAL_VARS = {
  'EXPO_PUBLIC_DATABASE_URL': 'Not set (Realtime Database features may not work)',
  'EXPO_PUBLIC_STORAGE_BUCKET': 'Not set (File storage features may not work)',
  'EXPO_PUBLIC_MESSAGING_SENDER_ID': 'Not set (Push notifications may not work)',
  'EXPO_PUBLIC_MEASUREMENT_ID': 'Not set (Analytics may not work)',
  'EXPO_PUBLIC_APP_NAME': 'ClassQR',
  'EXPO_PUBLIC_APP_VERSION': '1.0.0'
};

console.log('🔍 ClassQR Environment Validation\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Please copy .env.example to .env and configure your Firebase credentials.\n');
  console.log('   cp .env.example .env\n');
  process.exit(1);
}

// Load .env file manually for validation
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

let hasErrors = false;

// Check required variables
console.log('🔑 Required Variables:');
REQUIRED_VARS.forEach(varName => {
  const value = envVars[varName];
  if (!value || value === 'your_api_key_here' || value === 'your_project_id_here' || value.includes('your_')) {
    console.log(`   ❌ ${varName}: Missing or not configured`);
    hasErrors = true;
  } else {
    // Mask sensitive values for display
    const maskedValue = value.length > 10 ? value.slice(0, 10) + '...' : value;
    console.log(`   ✅ ${varName}: ${maskedValue}`);
  }
});

// Check optional variables
console.log('\n📋 Optional Variables:');
Object.keys(OPTIONAL_VARS).forEach(varName => {
  const value = envVars[varName];
  if (!value || value.includes('your_')) {
    console.log(`   ⚠️  ${varName}: ${OPTIONAL_VARS[varName]}`);
  } else {
    const maskedValue = value.length > 10 ? value.slice(0, 10) + '...' : value;
    console.log(`   ✅ ${varName}: ${maskedValue}`);
  }
});

// Validate Firebase project ID format
const projectId = envVars['EXPO_PUBLIC_PROJECT_ID'];
if (projectId && !/^[a-z0-9-]+$/.test(projectId)) {
  console.log('\n⚠️  Warning: Firebase project ID should only contain lowercase letters, numbers, and hyphens.');
  hasErrors = true;
}

// Validate API key format
const apiKey = envVars['EXPO_PUBLIC_API_KEY'];
if (apiKey && !apiKey.startsWith('AIza')) {
  console.log('\n⚠️  Warning: Firebase API key should start with "AIza".');
  hasErrors = true;
}

// Summary
console.log('\n📊 Summary:');
if (hasErrors) {
  console.log('❌ Environment configuration has issues that need to be fixed.');
  console.log('📖 See docs/ENVIRONMENT_SETUP.md for detailed setup instructions.');
  process.exit(1);
} else {
  console.log('✅ Environment configuration looks good!');
  console.log('🚀 You can now run: npx expo start');
}