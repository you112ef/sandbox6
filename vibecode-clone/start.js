#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Vibecode Clone Platform...\n');

// Check if required directories exist
const requiredDirs = ['frontend', 'backend', 'ai-agent-manager'];
const missingDirs = requiredDirs.filter(dir => !fs.existsSync(path.join(__dirname, dir)));

if (missingDirs.length > 0) {
  console.error('❌ Missing required directories:', missingDirs.join(', '));
  console.log('Please ensure you have the complete project structure.');
  process.exit(1);
}

// Check if node_modules exist
const checkNodeModules = (dir) => {
  const nodeModulesPath = path.join(__dirname, dir, 'node_modules');
  return fs.existsSync(nodeModulesPath);
};

const needsInstall = requiredDirs.filter(dir => !checkNodeModules(dir));

if (needsInstall.length > 0) {
  console.log('📦 Installing dependencies...');
  console.log('Missing node_modules in:', needsInstall.join(', '));
  console.log('Run: npm install\n');
}

// Start services
const services = [];

// Start Frontend (Next.js)
console.log('🌐 Starting Frontend (Next.js) on port 3000...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

frontend.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data}`);
});

frontend.stderr.on('data', (data) => {
  console.log(`[Frontend] ${data}`);
});

services.push({ name: 'Frontend', process: frontend });

// Start Backend API
console.log('🔧 Starting Backend API on port 8000...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data}`);
});

backend.stderr.on('data', (data) => {
  console.log(`[Backend] ${data}`);
});

services.push({ name: 'Backend', process: backend });

// Start AI Agent Manager
console.log('🤖 Starting AI Agent Manager on port 8001...');
const aiAgents = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'ai-agent-manager'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

aiAgents.stdout.on('data', (data) => {
  console.log(`[AI Agents] ${data}`);
});

aiAgents.stderr.on('data', (data) => {
  console.log(`[AI Agents] ${data}`);
});

services.push({ name: 'AI Agents', process: aiAgents });

// Show startup information
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Vibecode Clone Platform is starting up!');
  console.log('='.repeat(60));
  console.log('');
  console.log('📍 Access Points:');
  console.log('   Frontend:        http://localhost:3000');
  console.log('   Backend API:     http://localhost:8000');
  console.log('   AI Agent Manager: http://localhost:8001');
  console.log('');
  console.log('🔐 Demo Accounts:');
  console.log('   Demo User:  demo@vibecode.dev  / demo123');
  console.log('   Admin:      admin@vibecode.dev / admin123');
  console.log('');
  console.log('📚 Documentation:');
  console.log('   README:     ./README.md');
  console.log('   API Docs:   ./docs/API_DOCUMENTATION.md');
  console.log('   Architecture: ./docs/ARCHITECTURE.md');
  console.log('');
  console.log('🛑 To stop all services: Ctrl+C');
  console.log('='.repeat(60));
}, 2000);

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Vibecode Clone Platform...');
  
  services.forEach(service => {
    console.log(`   Stopping ${service.name}...`);
    service.process.kill('SIGTERM');
  });
  
  setTimeout(() => {
    console.log('✅ All services stopped. Goodbye!');
    process.exit(0);
  }, 1000);
});

// Handle service exits
services.forEach(service => {
  service.process.on('exit', (code) => {
    if (code !== 0) {
      console.log(`❌ ${service.name} exited with code ${code}`);
    }
  });
});