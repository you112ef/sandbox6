# Vibecode-Clone Platform

A complete platform that replicates and improves on Vibecode Terminal, providing AI-powered development workspaces with real-time collaboration, deployment automation, and comprehensive monitoring.

## 🚀 Features

### Core Features
- **Multi-AI Agent Support**: Claude Code, GPT-5, Gemini CLI, and Custom Agents
- **Isolated Sandbox Execution**: Secure containerized environment for code execution
- **Real-time Collaboration**: Multiple users can edit the same workspace simultaneously
- **Live Preview**: Instant webview updates as you code
- **GitHub Integration**: Seamless commit, push, and pull operations
- **Deployment Automation**: One-click deployment to Vercel, Netlify, Fly.io
- **Template Marketplace**: Pre-built starter projects and boilerplates
- **Version Control**: Internal versioning with rollback capabilities
- **Plugin System**: Extensible architecture for custom integrations

### Security & Monitoring
- **2FA Authentication**: Two-factor authentication support
- **Audit Logs**: Complete user action tracking
- **Rate Limiting**: DDoS protection and API throttling
- **Real-time Monitoring**: CPU, RAM, and performance metrics
- **Error Tracking**: Comprehensive logging and debugging

## 🏗️ Architecture

```
vibecode-clone/
├── frontend/                 # Next.js React application
├── backend/                  # Node.js API server
├── ai-agent-manager/         # AI agent orchestration
├── database/                 # PostgreSQL schema and migrations
├── shared/                   # Shared types and utilities
├── docker/                   # Container configurations
├── docs/                     # Documentation and diagrams
└── templates/                # Marketplace starter templates
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Fastify, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT and OAuth
- **Real-time**: Socket.IO for collaboration
- **Containerization**: Docker for sandbox execution
- **Deployment**: Vercel (primary), Netlify, Fly.io support
- **Monitoring**: Built-in dashboard with Prometheus metrics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/vibecode-clone.git
cd vibecode-clone
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Initialize the database**
```bash
npm run db:setup
npm run db:migrate
npm run db:seed
```

5. **Start the development servers**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- AI Agent Manager: http://localhost:8001

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vibecode"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"

# AI Providers
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
GOOGLE_AI_API_KEY="your-google-ai-key"

# Deployment
VERCEL_TOKEN="your-vercel-token"
NETLIFY_TOKEN="your-netlify-token"

# Storage
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_BUCKET_NAME="your-bucket"
```

## 📁 Project Structure

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   ├── lib/                  # Utilities and configurations
│   ├── hooks/                # Custom React hooks
│   ├── store/                # State management
│   └── types/                # TypeScript definitions
├── public/                   # Static assets
└── package.json
```

### Backend (`/backend`)
```
backend/
├── src/
│   ├── routes/               # API endpoints
│   ├── services/             # Business logic
│   ├── middleware/           # Express middleware
│   ├── utils/                # Helper functions
│   └── types/                # TypeScript definitions
├── prisma/                   # Database schema
└── package.json
```

### AI Agent Manager (`/ai-agent-manager`)
```
ai-agent-manager/
├── src/
│   ├── agents/               # AI agent implementations
│   ├── orchestrator/         # Agent coordination
│   ├── providers/            # AI service providers
│   └── sandbox/              # Code execution environment
└── package.json
```

## 🔧 Development

### Running Tests
```bash
npm run test              # Run all tests
npm run test:frontend     # Frontend tests only
npm run test:backend      # Backend tests only
npm run test:e2e          # End-to-end tests
```

### Building for Production
```bash
npm run build             # Build all services
npm run build:frontend    # Build frontend only
npm run build:backend     # Build backend only
```

### Database Operations
```bash
npm run db:migrate        # Run migrations
npm run db:reset          # Reset database
npm run db:seed           # Seed with sample data
npm run db:studio         # Open Prisma Studio
```

## 🔌 Plugin Development

Create custom plugins by extending the base plugin interface:

```typescript
import { Plugin } from '@vibecode/plugin-sdk';

export class MyCustomPlugin extends Plugin {
  name = 'my-custom-plugin';
  version = '1.0.0';

  async onWorkspaceCreate(workspace: Workspace) {
    // Plugin logic here
  }
}
```

## 🤝 Collaboration Features

### Real-time Editing
- Operational Transform (OT) for conflict resolution
- Live cursor tracking
- In-workspace chat and comments
- Version history with visual diff

### Multi-user Workflow
1. User creates workspace
2. Invites collaborators via email/username
3. Real-time synchronization of all changes
4. Conflict resolution and merge capabilities

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run deploy:vercel
```

### Netlify
```bash
npm run deploy:netlify
```

### Docker
```bash
docker-compose up --build
```

## 📊 Monitoring

Access the monitoring dashboard at `/admin/monitoring` to view:
- Workspace usage statistics
- AI agent performance metrics
- System resource utilization
- Error rates and logs
- User activity analytics

## 🛡️ Security

### Authentication Flow
1. User signs up with email/password or OAuth
2. JWT tokens issued for session management
3. Optional 2FA setup with TOTP
4. Secure API key storage for integrations

### Sandbox Security
- Isolated Docker containers per workspace
- Resource limits (CPU, RAM, disk)
- Network restrictions
- File system isolation

## 📈 SaaS Features

### Pricing Tiers
- **Free**: 3 workspaces, basic AI agents, 1GB storage
- **Pro**: Unlimited workspaces, premium AI agents, 10GB storage
- **Team**: Collaboration features, advanced monitoring, 50GB storage

### Stripe Integration
```bash
npm run setup:stripe
```

## 🤖 AI Agents

### Supported Agents
1. **Claude Code**: Advanced code generation and debugging
2. **GPT-5**: General-purpose AI assistance
3. **Gemini CLI**: Command-line focused interactions
4. **Custom Agents**: User-defined AI integrations

### Adding Custom Agents
```typescript
// Register custom agent
agentManager.register({
  name: 'my-agent',
  provider: 'custom',
  config: {
    apiKey: process.env.CUSTOM_AGENT_KEY,
    endpoint: 'https://api.custom-agent.com'
  }
});
```

## 📝 API Documentation

### REST Endpoints
- `GET /api/workspaces` - List user workspaces
- `POST /api/workspaces` - Create new workspace
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### GraphQL Schema
```graphql
type Workspace {
  id: ID!
  name: String!
  description: String
  files: [File!]!
  collaborators: [User!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

## 🧪 Templates

### Available Templates
- **React App**: Modern React with Vite
- **Next.js**: Full-stack Next.js application
- **Node.js API**: Express REST API boilerplate
- **Python Flask**: Flask web application
- **Vue.js**: Vue 3 with Composition API

### Creating Custom Templates
```json
{
  "name": "my-template",
  "description": "Custom project template",
  "tags": ["react", "typescript"],
  "files": {
    "package.json": "...",
    "src/App.tsx": "..."
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env

2. **AI Agent Not Responding**
   - Verify API keys are set
   - Check agent service status

3. **Sandbox Execution Failed**
   - Ensure Docker is running
   - Check container resource limits

### Debug Mode
```bash
DEBUG=vibecode:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Use conventional commit messages

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Vibecode Terminal
- Built with modern web technologies
- Community-driven development

---

For detailed documentation, visit [docs/](docs/) or check our [Wiki](https://github.com/your-org/vibecode-clone/wiki).