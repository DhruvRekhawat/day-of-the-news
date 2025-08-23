#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting bias analysis worker...');

// Start the worker
const worker = spawn('node', [
  path.join(__dirname, '../workers/bias-analysis.worker.ts')
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

worker.on('error', (error) => {
  console.error('❌ Worker error:', error);
  process.exit(1);
});

worker.on('exit', (code) => {
  console.log(`📊 Worker exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down worker...');
  worker.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down worker...');
  worker.kill('SIGTERM');
});
