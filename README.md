# VibeCode Terminal

A complete AI-powered terminal workspace with code execution, file management, and AI agents. Built with Next.js and designed to work seamlessly on Vercel.

## 🚀 Features

### Core Functionality
- **Terminal Emulation**: Full-featured terminal with xterm.js
- **Code Editor**: Monaco editor with syntax highlighting and IntelliSense
- **File Explorer**: Complete workspace management
- **AI Integration**: Multiple AI models (Claude, GPT-4, Gemini)
- **Code Execution**: Secure sandbox execution with Vercel Sandbox
- **Real-time Collaboration**: WebSocket-based collaboration

### AI Capabilities
- **Code Generation**: Generate code from natural language
- **Debugging**: AI-powered error detection and fixes
- **Code Optimization**: Performance improvements and best practices
- **Code Explanation**: Detailed code analysis and documentation
- **Multi-Model Support**: Switch between different AI providers

### Development Tools
- **Syntax Highlighting**: Support for 50+ programming languages
- **Auto-completion**: Intelligent code suggestions
- **Error Detection**: Real-time linting and error highlighting
- **Code Formatting**: Automatic code formatting
- **Git Integration**: Version control and collaboration

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Terminal**: xterm.js with addons
- **Editor**: Monaco Editor (VS Code engine)
- **AI**: OpenAI, Anthropic Claude, Google Gemini
- **Execution**: Vercel Sandbox
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vibecode-terminal.git
   cd vibecode-terminal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   VERCEL_SANDBOX_TOKEN=your_vercel_sandbox_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment on Vercel

### Automatic Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add GOOGLE_AI_API_KEY
vercel env add VERCEL_SANDBOX_TOKEN
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT models | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | Yes |
| `GOOGLE_AI_API_KEY` | Google AI API key for Gemini | Yes |
| `VERCEL_SANDBOX_TOKEN` | Vercel Sandbox token for code execution | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |
| `JWT_SECRET` | JWT secret for authentication | No |
| `ENCRYPTION_KEY` | Encryption key for secure data | No |

### AI Model Configuration

The application supports multiple AI models with different capabilities:

- **GPT-4**: Best for complex reasoning and code generation
- **Claude 3 Sonnet**: Excellent for code analysis and debugging
- **Gemini Pro**: Great for multimodal tasks and explanations

## 📖 Usage

### Terminal Commands
- `help` - Show available commands
- `ls` - List files and directories
- `cd <directory>` - Change directory
- `cat <file>` - Display file contents
- `run` - Execute code in sandbox
- `ai` - Open AI chat interface
- `clear` - Clear terminal

### AI Features
1. **Code Generation**: Ask AI to generate code
2. **Debugging**: Get help fixing errors
3. **Optimization**: Improve code performance
4. **Explanation**: Understand complex code
5. **Best Practices**: Learn industry standards

### File Management
- Create, edit, and delete files
- Organize projects with folders
- Version control with Git
- Export/import workspaces

## 🔒 Security

- **Sandboxed Execution**: All code runs in isolated environments
- **API Key Protection**: Secure handling of AI API keys
- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: API calls are rate-limited to prevent abuse
- **HTTPS Only**: All communications are encrypted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [xterm.js](https://xtermjs.org/) - Terminal emulator
- [Vercel](https://vercel.com/) - Deployment platform
- [OpenAI](https://openai.com/) - AI models
- [Anthropic](https://anthropic.com/) - Claude AI
- [Google AI](https://ai.google/) - Gemini models

## 📞 Support

- **Documentation**: [docs.vibecode.com](https://docs.vibecode.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/vibecode-terminal/issues)
- **Discord**: [VibeCode Community](https://discord.gg/vibecode)
- **Email**: support@vibecode.com

---

Built with ❤️ by the VibeCode Team