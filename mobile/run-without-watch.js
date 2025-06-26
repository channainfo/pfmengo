#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables to minimize file watching
const env = {
  ...process.env,
  WATCHMAN_DISABLE: '1',
  METRO_CACHE_DIR: path.join(__dirname, '.metro-cache'),
  EXPO_USE_FAST_REFRESH: 'false',
  EXPO_DEVTOOLS_LISTEN_ADDRESS: '0.0.0.0',
};

// Start Expo with minimal configuration
const expo = spawn('npx', ['expo', 'start', '--no-dev', '--minify'], {
  env,
  stdio: 'inherit',
  cwd: __dirname,
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
  process.exit(1);
});

expo.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Expo exited with code ${code}`);
  }
  process.exit(code);
});

X-KS-Api-Key