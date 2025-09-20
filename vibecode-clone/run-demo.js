#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Vibecode Clone Demo Server...\n');

// Create a simple demo server
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'demo-static')));

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'demo@vibecode.dev',
    password: 'demo123',
    name: 'Demo User',
    role: 'USER'
  },
  {
    id: '2', 
    email: 'admin@vibecode.dev',
    password: 'admin123',
    name: 'Administrator',
    role: 'ADMIN'
  }
];

const mockWorkspaces = [
  {
    id: '1',
    name: 'My React App',
    description: 'A modern React application with TypeScript',
    type: 'TERMINAL',
    status: 'ACTIVE',
    aiAgent: 'Claude Code',
    lastActivity: '2 hours ago',
    collaborators: 3
  },
  {
    id: '2',
    name: 'Next.js Blog', 
    description: 'Personal blog built with Next.js and MDX',
    type: 'TERMINAL',
    status: 'ACTIVE',
    aiAgent: 'GPT-5 Codex',
    lastActivity: '1 day ago',
    collaborators: 1
  }
];

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vibecode Clone - Demo</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container { 
                background: white;
                padding: 3rem;
                border-radius: 1rem;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 600px;
                margin: 2rem;
            }
            .logo { 
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 2rem;
            }
            .logo-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }
            h1 { 
                color: #333;
                margin-bottom: 1rem;
                font-size: 2.5rem;
            }
            .subtitle {
                color: #666;
                margin-bottom: 2rem;
                font-size: 1.2rem;
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            .feature {
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .feature h3 {
                color: #333;
                margin-bottom: 0.5rem;
            }
            .feature p {
                color: #666;
                font-size: 0.9rem;
            }
            .demo-accounts {
                background: #e3f2fd;
                padding: 1.5rem;
                border-radius: 8px;
                margin: 2rem 0;
                border-left: 4px solid #2196f3;
            }
            .demo-accounts h3 {
                color: #1976d2;
                margin-bottom: 1rem;
            }
            .account {
                background: white;
                padding: 0.8rem;
                margin: 0.5rem 0;
                border-radius: 4px;
                font-family: monospace;
            }
            .btn {
                display: inline-block;
                padding: 1rem 2rem;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 0.5rem;
                transition: transform 0.2s;
            }
            .btn:hover {
                transform: translateY(-2px);
            }
            .status {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                margin: 1rem 0;
                color: #28a745;
            }
            .status-dot {
                width: 8px;
                height: 8px;
                background: #28a745;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            .endpoints {
                text-align: left;
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
                font-family: monospace;
                font-size: 0.9rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <div class="logo-icon">VC</div>
                <h1>Vibecode Clone</h1>
            </div>
            
            <p class="subtitle">منصة التطوير المدعومة بالذكاء الاصطناعي</p>
            
            <div class="status">
                <div class="status-dot"></div>
                <span>الخادم التجريبي يعمل</span>
            </div>

            <div class="features">
                <div class="feature">
                    <h3>🤖 AI Agents</h3>
                    <p>Multiple AI assistants for code generation</p>
                </div>
                <div class="feature">
                    <h3>👥 Collaboration</h3>
                    <p>Real-time editing and team features</p>
                </div>
                <div class="feature">
                    <h3>🚀 Deployment</h3>
                    <p>One-click deployment to multiple platforms</p>
                </div>
                <div class="feature">
                    <h3>📋 Templates</h3>
                    <p>Pre-built starter projects and boilerplates</p>
                </div>
            </div>

            <div class="demo-accounts">
                <h3>🔐 Demo Accounts</h3>
                <div class="account">
                    <strong>Demo User:</strong> demo@vibecode.dev / demo123
                </div>
                <div class="account">
                    <strong>Admin:</strong> admin@vibecode.dev / admin123
                </div>
            </div>

            <div class="endpoints">
                <strong>📡 API Endpoints:</strong><br>
                • POST /api/auth/login - User authentication<br>
                • GET /api/workspaces - List workspaces<br>
                • GET /api/templates - Browse templates<br>
                • GET /api/health - Server health check
            </div>

            <div>
                <a href="/api/health" class="btn">🔍 Health Check</a>
                <a href="/api/workspaces" class="btn">📁 View Workspaces</a>
                <a href="/api/templates" class="btn">📋 Browse Templates</a>
            </div>

            <p style="margin-top: 2rem; color: #666; font-size: 0.9rem;">
                This is a functional demo of the Vibecode Clone platform.<br>
                All features are working and can be tested through the API endpoints.
            </p>
        </div>
    </body>
    </html>
  `);
});

// Auth API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid email or password'
      }
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
      token: 'demo-jwt-token-' + user.id,
      message: 'Login successful!'
    }
  });
});

// Workspaces API
app.get('/api/workspaces', (req, res) => {
  res.json({
    success: true,
    data: mockWorkspaces,
    meta: {
      total: mockWorkspaces.length,
      page: 1,
      limit: 20
    }
  });
});

// Templates API  
app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: '1',
      name: 'React TypeScript App',
      description: 'Modern React application with TypeScript and Vite',
      category: 'WEB',
      tags: ['react', 'typescript', 'vite'],
      featured: true,
      downloads: 1250
    },
    {
      id: '2', 
      name: 'Next.js Full-Stack',
      description: 'Complete Next.js application with authentication',
      category: 'WEB',
      tags: ['nextjs', 'typescript', 'auth'],
      featured: true,
      downloads: 890
    },
    {
      id: '3',
      name: 'Node.js API',
      description: 'RESTful API server with Express and TypeScript', 
      category: 'API',
      tags: ['nodejs', 'express', 'api'],
      featured: false,
      downloads: 650
    }
  ];

  res.json({
    success: true,
    data: templates
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'vibecode-clone-demo',
    version: '1.0.0',
    features: {
      authentication: 'active',
      workspaces: 'active', 
      templates: 'active',
      aiAgents: 'simulated'
    }
  });
});

// AI Demo endpoint
app.post('/api/ai/execute', (req, res) => {
  const { prompt } = req.body;
  
  // Simulate AI response
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        response: `AI Response: I can help you with "${prompt}". This is a demo response showing how the AI agent would assist with your request.`,
        usage: {
          tokens: 45
        }
      }
    });
  }, 1000);
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🎉 Vibecode Clone Demo Server Started!');
  console.log('='.repeat(60));
  console.log('');
  console.log('🌐 Server URL: http://localhost:' + PORT);
  console.log('📡 API Base:   http://localhost:' + PORT + '/api');
  console.log('');
  console.log('🔐 Demo Accounts:');
  console.log('   demo@vibecode.dev / demo123');
  console.log('   admin@vibecode.dev / admin123');
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log('   GET  /              - Demo homepage');
  console.log('   POST /api/auth/login - Authentication');
  console.log('   GET  /api/workspaces - List workspaces');
  console.log('   GET  /api/templates  - Browse templates');
  console.log('   GET  /api/health     - Health check');
  console.log('   POST /api/ai/execute - AI demo');
  console.log('');
  console.log('🛑 Press Ctrl+C to stop the server');
  console.log('='.repeat(60));
});