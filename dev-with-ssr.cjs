#!/usr/bin/env node

const { exec } = require('child_process');
const { watch } = require('fs');
const path = require('path');

console.log('🚀 Starting development with SSR...\n');

let serverProcess = null;
let isBuilding = false;

function startServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }

  console.log('🌐 Starting SSR server...');
  serverProcess = exec('node build/server.js', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Server error:', error.message);
      return;
    }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
}

function buildAndStart() {
  if (isBuilding) return;
  isBuilding = true;

  console.log('📦 Building SSR...');

  const buildProcess = exec('npm run build:ssr');

  buildProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  buildProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  buildProcess.on('close', (code) => {
    isBuilding = false;
    if (code === 0) {
      console.log('✅ Build complete!\n');
      startServer();
    } else {
      console.error('❌ Build failed');
    }
  });
}

// Initial build and start
buildAndStart();

// Watch for changes in src directory
console.log('👀 Watching src/ for changes...\n');

watch('./src', { recursive: true }, (eventType, filename) => {
  if (!isBuilding && filename &&
      (filename.endsWith('.tsx') ||
       filename.endsWith('.ts') ||
       filename.endsWith('.js') ||
       filename.endsWith('.jsx'))) {

    console.log(`\n🔄 File changed: ${filename}`);
    buildAndStart();
  }
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development server...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});