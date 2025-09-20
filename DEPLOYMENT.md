# VibeCode Terminal - Deployment Guide

This guide will help you deploy the VibeCode Terminal application to Vercel with all features working correctly.

## 🚀 Quick Deployment

### 1. Prerequisites
- GitHub account
- Vercel account
- API keys for AI services

### 2. One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/vibecode-terminal)

### 3. Manual Deployment

1. **Fork this repository**
   ```bash
   git clone https://github.com/your-username/vibecode-terminal.git
   cd vibecode-terminal
   ```

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Set environment variables**
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add ANTHROPIC_API_KEY
   vercel env add GOOGLE_AI_API_KEY
   vercel env add VERCEL_SANDBOX_TOKEN
   ```

## 🔑 Required API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to Vercel environment variables

### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to Vercel environment variables

### Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to Vercel environment variables

### Vercel Sandbox Token
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Settings > Tokens
3. Create a new token with Sandbox permissions
4. Copy the token and add it to Vercel environment variables

## ⚙️ Environment Variables

Add these environment variables in your Vercel dashboard:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for GPT models | Yes | `sk-...` |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | Yes | `sk-ant-...` |
| `GOOGLE_AI_API_KEY` | Google AI API key for Gemini | Yes | `AIza...` |
| `VERCEL_SANDBOX_TOKEN` | Vercel Sandbox token | Yes | `vercel_...` |
| `NEXT_PUBLIC_APP_URL` | Application URL | No | `https://your-app.vercel.app` |
| `JWT_SECRET` | JWT secret for auth | No | `your-secret-key` |
| `ENCRYPTION_KEY` | Encryption key | No | `your-encryption-key` |

## 🔧 Configuration

### Vercel Configuration
The `vercel.json` file is already configured with:
- Build settings for Next.js
- Function timeout settings
- Security headers
- API route configurations

### Custom Domain
1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Configure DNS records as instructed

### Environment-Specific Settings
- **Development**: Uses local environment variables
- **Preview**: Uses Vercel preview environment
- **Production**: Uses Vercel production environment

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/your-username/vibecode-terminal.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings (auto-detected)

### Step 3: Configure Environment Variables
1. In your Vercel project dashboard
2. Go to Settings > Environment Variables
3. Add all required API keys
4. Set for all environments (Production, Preview, Development)

### Step 4: Deploy
1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete
3. Test your deployment

## 🔍 Testing Deployment

### 1. Basic Functionality
- [ ] Application loads without errors
- [ ] Terminal component renders correctly
- [ ] File explorer shows workspace
- [ ] Code editor loads with syntax highlighting

### 2. AI Integration
- [ ] AI chat responds to messages
- [ ] Code generation works
- [ ] Model switching functions
- [ ] Error handling works correctly

### 3. Code Execution
- [ ] Sandbox execution works
- [ ] Multiple languages supported
- [ ] Error handling functions
- [ ] Output display works

### 4. File Operations
- [ ] File creation/editing works
- [ ] File deletion functions
- [ ] Directory operations work
- [ ] File saving functions

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install
npm run build
```

#### Environment Variables
```bash
# Verify environment variables are set
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME
```

#### API Errors
- Check API key validity
- Verify API quotas and limits
- Check network connectivity
- Review error logs

#### Performance Issues
- Enable Vercel Analytics
- Check function execution times
- Optimize bundle size
- Use Vercel Edge Functions

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run dev

# Check Vercel logs
vercel logs
```

## 📊 Monitoring

### Vercel Analytics
1. Enable Vercel Analytics in dashboard
2. Monitor performance metrics
3. Track user interactions
4. Analyze error rates

### Error Tracking
- Built-in Vercel error tracking
- Custom error boundaries
- API error monitoring
- User feedback collection

## 🔄 Updates and Maintenance

### Automatic Updates
- GitHub webhooks for automatic deployments
- Branch-based deployments
- Preview deployments for testing

### Manual Updates
```bash
# Pull latest changes
git pull origin main

# Deploy to Vercel
vercel --prod
```

### Rollback
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Select previous deployment
4. Click "Promote to Production"

## 📈 Scaling

### Performance Optimization
- Enable Vercel Edge Functions
- Use CDN for static assets
- Optimize images and fonts
- Implement caching strategies

### Cost Management
- Monitor API usage
- Set up billing alerts
- Optimize function execution
- Use appropriate instance sizes

## 🛡️ Security

### Best Practices
- Use HTTPS only
- Implement rate limiting
- Validate all inputs
- Secure API keys
- Regular security updates

### Security Headers
The application includes security headers:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## 📞 Support

If you encounter issues during deployment:

1. **Check Vercel Status**: [status.vercel.com](https://status.vercel.com)
2. **Review Documentation**: [vercel.com/docs](https://vercel.com/docs)
3. **Community Support**: [GitHub Discussions](https://github.com/your-username/vibecode-terminal/discussions)
4. **Professional Support**: [Vercel Support](https://vercel.com/support)

---

For more detailed information, visit our [documentation](https://docs.vibecode.com) or [GitHub repository](https://github.com/your-username/vibecode-terminal).