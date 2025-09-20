import { PrismaClient, UserRole, SubscriptionTier, AIProvider, AgentStatus, TemplateCategory, TemplateVisibility } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vibecode.dev' },
    update: {},
    create: {
      email: 'admin@vibecode.dev',
      username: 'admin',
      name: 'System Administrator',
      password: adminPassword,
      role: UserRole.ADMIN,
      subscription: SubscriptionTier.ENTERPRISE,
      emailVerified: new Date(),
    },
  })

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@vibecode.dev' },
    update: {},
    create: {
      email: 'demo@vibecode.dev',
      username: 'demo',
      name: 'Demo User',
      password: demoPassword,
      role: UserRole.USER,
      subscription: SubscriptionTier.PRO,
      emailVerified: new Date(),
    },
  })

  // Create AI Agents
  const aiAgents = [
    {
      name: 'claude-code',
      displayName: 'Claude Code',
      description: 'Advanced AI assistant specialized in code generation, debugging, and technical writing.',
      provider: AIProvider.ANTHROPIC,
      model: 'claude-3-sonnet-20240229',
      capabilities: ['code-generation', 'debugging', 'refactoring', 'documentation', 'code-review'],
      config: {
        maxTokens: 4096,
        temperature: 0.1,
        systemPrompt: 'You are an expert software engineer and coding assistant.',
      },
    },
    {
      name: 'gpt-5-codex',
      displayName: 'GPT-5 Codex',
      description: 'OpenAI\'s most advanced code generation model with broad language support.',
      provider: AIProvider.OPENAI,
      model: 'gpt-4-turbo-preview',
      capabilities: ['code-generation', 'completion', 'explanation', 'translation', 'optimization'],
      config: {
        maxTokens: 4096,
        temperature: 0.2,
        systemPrompt: 'You are a helpful AI programming assistant.',
      },
    },
    {
      name: 'gemini-cli',
      displayName: 'Gemini CLI',
      description: 'Google\'s Gemini model optimized for command-line operations and system administration.',
      provider: AIProvider.GOOGLE,
      model: 'gemini-pro',
      capabilities: ['cli-commands', 'system-admin', 'devops', 'scripting'],
      config: {
        maxTokens: 2048,
        temperature: 0.1,
        systemPrompt: 'You are a command-line expert and system administrator.',
      },
    },
  ]

  for (const agent of aiAgents) {
    await prisma.aIAgent.upsert({
      where: { name: agent.name },
      update: {},
      create: agent,
    })
  }

  // Create starter templates
  const templates = [
    {
      name: 'React TypeScript App',
      description: 'Modern React application with TypeScript, Vite, and Tailwind CSS',
      category: TemplateCategory.WEB,
      tags: ['react', 'typescript', 'vite', 'tailwind'],
      authorId: admin.id,
      visibility: TemplateVisibility.PUBLIC,
      featured: true,
      version: '1.0.0',
      files: {
        'package.json': {
          content: JSON.stringify({
            name: 'react-typescript-app',
            private: true,
            version: '0.0.0',
            type: 'module',
            scripts: {
              dev: 'vite',
              build: 'tsc && vite build',
              lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
              preview: 'vite preview',
            },
            dependencies: {
              react: '^18.2.0',
              'react-dom': '^18.2.0',
            },
            devDependencies: {
              '@types/react': '^18.2.43',
              '@types/react-dom': '^18.2.17',
              '@typescript-eslint/eslint-plugin': '^6.14.0',
              '@typescript-eslint/parser': '^6.14.0',
              '@vitejs/plugin-react': '^4.2.1',
              autoprefixer: '^10.4.16',
              eslint: '^8.55.0',
              'eslint-plugin-react-hooks': '^4.6.0',
              'eslint-plugin-react-refresh': '^0.4.5',
              postcss: '^8.4.32',
              tailwindcss: '^3.3.6',
              typescript: '^5.2.2',
              vite: '^5.0.8',
            },
          }, null, 2),
        },
        'src/App.tsx': {
          content: `import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Welcome to
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            React TypeScript App
          </h1>
          <p className="mt-2 text-gray-500">
            Start building your amazing application with React, TypeScript, and Tailwind CSS.
          </p>
          <button className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default App`,
        },
        'src/main.tsx': {
          content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
        },
        'src/index.css': {
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}`,
        },
        'index.html': {
          content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React TypeScript App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        },
        'tailwind.config.js': {
          content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
        },
        'vite.config.ts': {
          content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`,
        },
        'tsconfig.json': {
          content: JSON.stringify({
            compilerOptions: {
              target: 'ES2020',
              useDefineForClassFields: true,
              lib: ['ES2020', 'DOM', 'DOM.Iterable'],
              module: 'ESNext',
              skipLibCheck: true,
              moduleResolution: 'bundler',
              allowImportingTsExtensions: true,
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              jsx: 'react-jsx',
              strict: true,
              noUnusedLocals: true,
              noUnusedParameters: true,
              noFallthroughCasesInSwitch: true,
            },
            include: ['src'],
            references: [{ path: './tsconfig.node.json' }],
          }, null, 2),
        },
      },
      config: {
        buildCommand: 'npm run build',
        devCommand: 'npm run dev',
        outputDirectory: 'dist',
        installCommand: 'npm install',
      },
    },
    {
      name: 'Next.js Full-Stack App',
      description: 'Complete Next.js application with TypeScript, Prisma, and authentication',
      category: TemplateCategory.WEB,
      tags: ['nextjs', 'typescript', 'prisma', 'auth'],
      authorId: admin.id,
      visibility: TemplateVisibility.PUBLIC,
      featured: true,
      version: '1.0.0',
      files: {
        'package.json': {
          content: JSON.stringify({
            name: 'nextjs-fullstack-app',
            version: '0.1.0',
            private: true,
            scripts: {
              dev: 'next dev',
              build: 'next build',
              start: 'next start',
              lint: 'next lint',
            },
            dependencies: {
              next: '14.0.4',
              react: '^18',
              'react-dom': '^18',
              '@next-auth/prisma-adapter': '^1.0.7',
              'next-auth': '^4.24.5',
              '@prisma/client': '^5.7.0',
              prisma: '^5.7.0',
            },
            devDependencies: {
              typescript: '^5',
              '@types/node': '^20',
              '@types/react': '^18',
              '@types/react-dom': '^18',
              eslint: '^8',
              'eslint-config-next': '14.0.4',
              tailwindcss: '^3.3.0',
              autoprefixer: '^10.0.1',
              postcss: '^8',
            },
          }, null, 2),
        },
        'app/page.tsx': {
          content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">
          Welcome to Next.js Full-Stack App
        </h1>
        <p className="mt-4 text-xl">
          Start building your amazing application with Next.js, TypeScript, and Prisma.
        </p>
      </div>
    </main>
  )
}`,
        },
        'app/layout.tsx': {
          content: `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Full-Stack App',
  description: 'Generated by Vibecode Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,
        },
        'app/globals.css': {
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
        },
      },
      config: {
        buildCommand: 'npm run build',
        devCommand: 'npm run dev',
        outputDirectory: '.next',
        installCommand: 'npm install',
      },
    },
    {
      name: 'Node.js Express API',
      description: 'RESTful API server with Express, TypeScript, and Prisma',
      category: TemplateCategory.API,
      tags: ['nodejs', 'express', 'typescript', 'prisma', 'api'],
      authorId: admin.id,
      visibility: TemplateVisibility.PUBLIC,
      featured: false,
      version: '1.0.0',
      files: {
        'package.json': {
          content: JSON.stringify({
            name: 'nodejs-express-api',
            version: '1.0.0',
            description: 'RESTful API server with Express and TypeScript',
            main: 'dist/index.js',
            scripts: {
              dev: 'nodemon src/index.ts',
              build: 'tsc',
              start: 'node dist/index.js',
              test: 'jest',
            },
            dependencies: {
              express: '^4.18.2',
              cors: '^2.8.5',
              helmet: '^7.1.0',
              'express-rate-limit': '^7.1.5',
              '@prisma/client': '^5.7.0',
              prisma: '^5.7.0',
              bcryptjs: '^2.4.3',
              jsonwebtoken: '^9.0.2',
              joi: '^17.11.0',
            },
            devDependencies: {
              '@types/node': '^20.10.0',
              '@types/express': '^4.17.21',
              '@types/cors': '^2.8.17',
              '@types/bcryptjs': '^2.4.6',
              '@types/jsonwebtoken': '^9.0.5',
              typescript: '^5.3.2',
              nodemon: '^3.0.2',
              'ts-node': '^10.9.1',
              jest: '^29.7.0',
              '@types/jest': '^29.5.8',
            },
          }, null, 2),
        },
        'src/index.ts': {
          content: `import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Node.js Express API!' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})`,
        },
        'tsconfig.json': {
          content: JSON.stringify({
            compilerOptions: {
              target: 'ES2020',
              module: 'commonjs',
              lib: ['ES2020'],
              outDir: './dist',
              rootDir: './src',
              strict: true,
              esModuleInterop: true,
              skipLibCheck: true,
              forceConsistentCasingInFileNames: true,
              resolveJsonModule: true,
              declaration: true,
              declarationMap: true,
              sourceMap: true,
            },
            include: ['src/**/*'],
            exclude: ['node_modules', 'dist'],
          }, null, 2),
        },
      },
      config: {
        buildCommand: 'npm run build',
        devCommand: 'npm run dev',
        outputDirectory: 'dist',
        installCommand: 'npm install',
      },
    },
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    })
  }

  // Create a demo workspace
  const demoWorkspace = await prisma.workspace.create({
    data: {
      name: 'My First Project',
      description: 'A demo workspace to get you started',
      type: 'TERMINAL',
      ownerId: demoUser.id,
      aiAgent: 'claude-code',
      settings: {
        theme: 'dark',
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
      },
      environment: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
    },
  })

  // Create demo files in the workspace
  await prisma.file.createMany({
    data: [
      {
        name: 'README.md',
        path: '/README.md',
        content: `# My First Project

Welcome to your first Vibecode workspace! This is a great place to start building your next amazing project.

## Getting Started

1. Use the AI assistant to help generate code
2. Edit files in the file explorer
3. Run commands in the terminal
4. Deploy your project with one click

## Features

- **AI-Powered Development**: Get help from multiple AI agents
- **Real-time Collaboration**: Work with your team in real-time
- **Instant Deployment**: Deploy to Vercel, Netlify, or other platforms
- **Version Control**: Built-in Git integration

Happy coding! 🚀`,
        language: 'markdown',
        size: 500,
        mimeType: 'text/markdown',
        workspaceId: demoWorkspace.id,
        authorId: demoUser.id,
      },
      {
        name: 'package.json',
        path: '/package.json',
        content: JSON.stringify({
          name: 'my-first-project',
          version: '1.0.0',
          description: 'My first Vibecode project',
          main: 'index.js',
          scripts: {
            start: 'node index.js',
            dev: 'nodemon index.js',
          },
          dependencies: {
            express: '^4.18.2',
          },
          devDependencies: {
            nodemon: '^3.0.2',
          },
        }, null, 2),
        language: 'json',
        size: 300,
        mimeType: 'application/json',
        workspaceId: demoWorkspace.id,
        authorId: demoUser.id,
      },
      {
        name: 'index.js',
        path: '/index.js',
        content: `const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Vibecode!',
    timestamp: new Date().toISOString(),
    status: 'success'
  })
})

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`)
  console.log(\`📝 Visit http://localhost:\${PORT} to see your app\`)
})`,
        language: 'javascript',
        size: 400,
        mimeType: 'application/javascript',
        workspaceId: demoWorkspace.id,
        authorId: demoUser.id,
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: admin@vibecode.dev (password: admin123)`)
  console.log(`👤 Demo user: demo@vibecode.dev (password: demo123)`)
  console.log(`🤖 Created ${aiAgents.length} AI agents`)
  console.log(`📋 Created ${templates.length} templates`)
  console.log(`🗂️ Created demo workspace with sample files`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })