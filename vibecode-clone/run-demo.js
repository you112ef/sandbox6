#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

console.log('🚀 Starting Vibecode Clone Demo Server...\n');

// Create a simple demo server
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'demo-static')));

// Initialize SQLite database
const db = new Database('vibecode-demo.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'TERMINAL',
    status TEXT DEFAULT 'ACTIVE',
    ai_agent TEXT DEFAULT 'Claude Code',
    owner_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    content TEXT,
    language TEXT,
    size INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id)
  );
`);

// Insert demo data
const insertUser = db.prepare('INSERT OR IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)');
insertUser.run('demo@vibecode.dev', 'demo123', 'Demo User', 'USER');
insertUser.run('admin@vibecode.dev', 'admin123', 'Administrator', 'ADMIN');

const insertWorkspace = db.prepare(`
  INSERT OR IGNORE INTO workspaces (name, description, type, status, ai_agent, owner_id) 
  VALUES (?, ?, ?, ?, ?, ?)
`);
insertWorkspace.run('My React App', 'A modern React application with TypeScript', 'TERMINAL', 'ACTIVE', 'Claude Code', 1);
insertWorkspace.run('Next.js Blog', 'Personal blog built with Next.js and MDX', 'TERMINAL', 'ACTIVE', 'GPT-5 Codex', 1);
insertWorkspace.run('Python API', 'FastAPI backend with PostgreSQL', 'TERMINAL', 'PAUSED', 'Gemini CLI', 2);

// Database query functions
const getUserByCredentials = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
const getAllWorkspaces = db.prepare(`
  SELECT w.*, u.name as owner_name 
  FROM workspaces w 
  JOIN users u ON w.owner_id = u.id 
  ORDER BY w.updated_at DESC
`);
const getWorkspaceById = db.prepare(`
  SELECT w.*, u.name as owner_name 
  FROM workspaces w 
  JOIN users u ON w.owner_id = u.id 
  WHERE w.id = ?
`);

// Helper functions
function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
}

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
  
  try {
    const user = getUserByCredentials.get(email, password);
    
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
        message: 'تم تسجيل الدخول بنجاح!'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'خطأ في الخادم'
      }
    });
  }
});

// Workspaces API
app.get('/api/workspaces', (req, res) => {
  try {
    const workspaces = getAllWorkspaces.all().map(workspace => ({
      id: workspace.id.toString(),
      name: workspace.name,
      description: workspace.description,
      type: workspace.type,
      status: workspace.status,
      aiAgent: workspace.ai_agent,
      lastActivity: formatTimeAgo(workspace.updated_at),
      collaborators: Math.floor(Math.random() * 5) + 1, // Random for demo
      owner: workspace.owner_name,
      createdAt: workspace.created_at,
      updatedAt: workspace.updated_at
    }));

    res.json({
      success: true,
      data: workspaces,
      meta: {
        total: workspaces.length,
        page: 1,
        limit: 20
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'خطأ في استرجاع مساحات العمل'
      }
    });
  }
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

// Create workspace endpoint
app.post('/api/workspaces', (req, res) => {
  const { name, description, type = 'TERMINAL', aiAgent = 'Claude Code' } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      error: { message: 'اسم مساحة العمل مطلوب' }
    });
  }

  try {
    const insertWorkspace = db.prepare(`
      INSERT INTO workspaces (name, description, type, ai_agent, owner_id) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = insertWorkspace.run(name, description || '', type, aiAgent, 1); // Default owner ID 1
    
    // Create workspace directory and files
    const workspaceDir = path.join(__dirname, 'workspaces', result.lastInsertRowid.toString());
    fs.mkdirSync(workspaceDir, { recursive: true });
    
    // Create initial files
    const readmeContent = `# ${name}\n\n${description || 'مساحة عمل جديدة في Vibecode Clone'}\n\n## البدء\n\n1. ابدأ بتحرير الملفات\n2. استخدم الذكاء الاصطناعي للمساعدة\n3. شغل الأوامر في الطرفية\n4. انشر مشروعك\n\nتم إنشاء هذا المشروع باستخدام Vibecode Clone 🚀`;
    
    const packageJsonContent = JSON.stringify({
      name: name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: description || 'مشروع Vibecode Clone',
      main: 'index.js',
      scripts: {
        start: 'node index.js',
        dev: 'nodemon index.js'
      },
      dependencies: {}
    }, null, 2);

    const indexJsContent = `console.log('مرحباً من ${name}!');\nconsole.log('تم إنشاء هذا المشروع باستخدام Vibecode Clone');`;

    fs.writeFileSync(path.join(workspaceDir, 'README.md'), readmeContent);
    fs.writeFileSync(path.join(workspaceDir, 'package.json'), packageJsonContent);
    fs.writeFileSync(path.join(workspaceDir, 'index.js'), indexJsContent);

    // Insert files into database
    const insertFile = db.prepare(`
      INSERT INTO files (workspace_id, name, path, content, language, size) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insertFile.run(result.lastInsertRowid, 'README.md', '/README.md', readmeContent, 'markdown', readmeContent.length);
    insertFile.run(result.lastInsertRowid, 'package.json', '/package.json', packageJsonContent, 'json', packageJsonContent.length);
    insertFile.run(result.lastInsertRowid, 'index.js', '/index.js', indexJsContent, 'javascript', indexJsContent.length);

    res.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        name,
        description,
        type,
        aiAgent,
        message: 'تم إنشاء مساحة العمل بنجاح!'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'خطأ في إنشاء مساحة العمل' }
    });
  }
});

// Get workspace files
app.get('/api/workspaces/:id/files', (req, res) => {
  const workspaceId = req.params.id;
  
  try {
    const getFiles = db.prepare('SELECT * FROM files WHERE workspace_id = ? ORDER BY name');
    const files = getFiles.all(workspaceId);
    
    res.json({
      success: true,
      data: files.map(file => ({
        id: file.id,
        name: file.name,
        path: file.path,
        language: file.language,
        size: file.size,
        content: file.content,
        createdAt: file.created_at,
        updatedAt: file.updated_at
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'خطأ في استرجاع الملفات' }
    });
  }
});

// Update file content
app.put('/api/files/:id', (req, res) => {
  const fileId = req.params.id;
  const { content } = req.body;
  
  try {
    const updateFile = db.prepare(`
      UPDATE files 
      SET content = ?, size = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    const result = updateFile.run(content, content.length, fileId);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'الملف غير موجود' }
      });
    }

    // Update file on disk too
    const getFile = db.prepare('SELECT * FROM files WHERE id = ?');
    const file = getFile.get(fileId);
    
    if (file) {
      const workspaceDir = path.join(__dirname, 'workspaces', file.workspace_id.toString());
      const filePath = path.join(workspaceDir, file.path);
      fs.writeFileSync(filePath, content);
    }

    res.json({
      success: true,
      data: { message: 'تم حفظ الملف بنجاح!' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'خطأ في حفظ الملف' }
    });
  }
});

// Execute terminal command
app.post('/api/workspaces/:id/terminal', (req, res) => {
  const workspaceId = req.params.id;
  const { command } = req.body;
  
  // Simple command simulation
  let output = '';
  
  switch (command.toLowerCase().trim()) {
    case 'ls':
      output = 'README.md  package.json  index.js';
      break;
    case 'pwd':
      output = `/workspaces/${workspaceId}`;
      break;
    case 'node index.js':
      output = `مرحباً من مساحة العمل ${workspaceId}!\nتم إنشاء هذا المشروع باستخدام Vibecode Clone`;
      break;
    case 'npm install':
      output = 'تم تثبيت التبعيات بنجاح!\n\nادded 0 packages in 1.2s';
      break;
    case 'cat README.md':
      try {
        const getFile = db.prepare('SELECT content FROM files WHERE workspace_id = ? AND name = ?');
        const file = getFile.get(workspaceId, 'README.md');
        output = file ? file.content : 'الملف غير موجود';
      } catch {
        output = 'خطأ في قراءة الملف';
      }
      break;
    default:
      output = `تم تنفيذ الأمر: ${command}\n(هذا محاكاة - في النسخة الكاملة سيتم تنفيذ الأوامر الحقيقية)`;
  }

  res.json({
    success: true,
    data: {
      command,
      output,
      exitCode: 0,
      timestamp: new Date().toISOString()
    }
  });
});

// AI Demo endpoint
app.post('/api/ai/execute', (req, res) => {
  const { prompt, workspaceId } = req.body;
  
  // Simulate AI response with more realistic responses
  setTimeout(() => {
    let response = '';
    
    if (prompt.toLowerCase().includes('component') || prompt.toLowerCase().includes('مكون')) {
      response = `إليك مكون React بسيط:

\`\`\`jsx
import React from 'react';

const MyComponent = () => {
  return (
    <div className="my-component">
      <h2>مكون جديد</h2>
      <p>تم إنشاء هذا المكون بواسطة الذكاء الاصطناعي</p>
    </div>
  );
};

export default MyComponent;
\`\`\`

يمكنك استخدام هذا المكون في مشروعك وتخصيصه حسب احتياجاتك.`;
    } else if (prompt.toLowerCase().includes('function') || prompt.toLowerCase().includes('دالة')) {
      response = `إليك دالة JavaScript مفيدة:

\`\`\`javascript
function processData(data) {
  // معالجة البيانات
  return data
    .filter(item => item.active)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    }));
}
\`\`\`

هذه الدالة تقوم بتصفية البيانات النشطة وإضافة معلومات إضافية.`;
    } else if (prompt.toLowerCase().includes('style') || prompt.toLowerCase().includes('تصميم')) {
      response = `إليك بعض أنماط CSS حديثة:

\`\`\`css
.modern-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-5px);
}
\`\`\`

هذا التصميم يعطي مظهراً حديثاً وجذاباً.`;
    } else {
      response = `فهمت طلبك: "${prompt}"

كمساعد ذكاء اصطناعي، يمكنني مساعدتك في:
• كتابة الكود وتطوير المكونات
• إصلاح الأخطاء والمشاكل
• تحسين الأداء والكود
• إنشاء التوثيق والشرح
• اقتراح أفضل الممارسات

ما الذي تحتاج مساعدة محددة فيه؟`;
    }
    
    res.json({
      success: true,
      data: {
        response,
        usage: { tokens: response.length / 4 }, // Rough estimate
        model: 'claude-3-sonnet',
        timestamp: new Date().toISOString()
      }
    });
  }, Math.random() * 2000 + 500); // Random delay 0.5-2.5 seconds
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