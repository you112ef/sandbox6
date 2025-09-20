# 🚀 VibeCode Terminal - Deployment Guide

## Automatic Deployment to Vercel

### Option 1: GitHub Actions (Recommended)

1. **Set up Vercel secrets in GitHub:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel API token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID

2. **Get Vercel credentials:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link your project
   vercel link
   
   # Get your project ID and org ID
   cat .vercel/project.json
   ```

3. **Push to GitHub:**
   ```bash
   git push origin main
   ```
   The GitHub Action will automatically deploy to Vercel!

### Option 2: Manual Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   # Deploy to preview
   vercel
   
   # Deploy to production
   vercel --prod
   ```

### Option 3: Using npm scripts

```bash
# Deploy with automatic setup
npm run deploy:vercel

# Quick deployment
npm run deploy:auto
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database (Optional - will use mock data if not provided)
POSTGRES_URL=postgresql://username:password@host:port/database
DATABASE_URL=postgresql://username:password@host:port/database

# AI Provider API Keys (Optional - will use mock responses if not provided)
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
GOOGLE_AI_API_KEY=AIza-your-google-ai-api-key-here
XAI_API_KEY=xai-your-xai-api-key-here
GROQ_API_KEY=gsk_your-groq-api-key-here
MISTRAL_API_KEY=your-mistral-api-key-here
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key-here

# Vercel Sandbox (Optional)
VERCEL_SANDBOX_TOKEN=your-vercel-sandbox-token

# Encryption Key for API Keys (Required for production)
ENCRYPTION_KEY=a_very_secret_32_char_key_for_aes

# Authentication (Optional)
BETTER_AUTH_SECRET=your-better-auth-secret-here
```

## Vercel Configuration

The application is configured with `vercel.json` for optimal deployment:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x
- **Regions**: `iad1` (US East)

## Features Ready for Production

✅ **Terminal Emulator** - Full xterm.js integration
✅ **Code Editor** - Monaco Editor with syntax highlighting
✅ **AI Chat** - 50+ AI models from 8 providers
✅ **File Manager** - Complete file operations
✅ **Collaboration** - Real-time features
✅ **Voice Assistant** - Speech recognition
✅ **Workflow Editor** - Visual workflow builder
✅ **API Key Management** - Secure storage
✅ **Database Integration** - PostgreSQL with Drizzle ORM
✅ **Authentication** - Better Auth with OAuth

## Deployment Status

- ✅ **Build**: Successful (0 errors)
- ✅ **TypeScript**: All errors fixed
- ✅ **Linting**: Clean code
- ✅ **Dependencies**: All resolved
- ✅ **Mock Implementations**: Development ready
- ✅ **Real Implementations**: Production ready

## Post-Deployment

1. **Configure Environment Variables** in Vercel dashboard
2. **Set up Database** (optional - app works with mock data)
3. **Add API Keys** for AI providers (optional)
4. **Test all features**
5. **Share your application**!

## Support

- **Documentation**: See README.md
- **Issues**: GitHub Issues
- **Features**: All 50+ AI models integrated
- **Status**: Production ready! 🚀