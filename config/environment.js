/**
 * Configuration validation and environment variable helpers
 * Ensures all required environment variables are properly set
 */

// Required environment variables for Firebase
const REQUIRED_ENV_VARS = [
  'EXPO_PUBLIC_API_KEY',
  'EXPO_PUBLIC_AUTH_DOMAIN',
  'EXPO_PUBLIC_PROJECT_ID',
  'EXPO_PUBLIC_APP_ID'
];

// Optional environment variables with defaults
const OPTIONAL_ENV_VARS = {
  EXPO_PUBLIC_APP_NAME: 'ClassQR',
  EXPO_PUBLIC_APP_VERSION: '1.0.0',
  EXPO_PUBLIC_DEBUG_MODE: 'false'
};

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
export const validateEnvironment = () => {
  const missing = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      '📝 Please copy .env.example to .env and fill in your Firebase configuration.'
    );
  }
  
  console.log('✅ All required environment variables are set');
};

/**
 * Gets environment variable with optional default value
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not set
 * @returns {string} Environment variable value or default
 */
export const getEnv = (key, defaultValue = '') => {
  return process.env[key] || OPTIONAL_ENV_VARS[key] || defaultValue;
};

/**
 * Gets Firebase configuration from environment variables
 * @returns {object} Firebase configuration object
 */
export const getFirebaseConfig = () => {
  validateEnvironment();
  
  return {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
  };
};

/**
 * Checks if we're in development mode
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = () => {
  return getEnv('EXPO_PUBLIC_DEBUG_MODE', 'false').toLowerCase() === 'true' || __DEV__;
};

/**
 * Logs configuration status (without sensitive data)
 */
export const logConfigStatus = () => {
  if (isDevelopment()) {
    console.log('🔧 Configuration Status:');
    console.log(`  App Name: ${getEnv('EXPO_PUBLIC_APP_NAME')}`);
    console.log(`  App Version: ${getEnv('EXPO_PUBLIC_APP_VERSION')}`);
    console.log(`  Project ID: ${process.env.EXPO_PUBLIC_PROJECT_ID}`);
    console.log(`  Debug Mode: ${isDevelopment()}`);
  }
};