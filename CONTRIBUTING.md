# Contributing to VibeCode Terminal

Thank you for your interest in contributing to VibeCode Terminal! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
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
   # Edit .env.local with your API keys
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Structure
```typescript
// components/ComponentName.tsx
'use client'

import { useState, useEffect } from 'react'
import { ComponentProps } from '@/types'

interface ComponentNameProps {
  // Props interface
}

export default function ComponentName({ ...props }: ComponentNameProps) {
  // Component logic
  return (
    // JSX
  )
}
```

### API Routes
```typescript
// app/api/endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 })
  }
}
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, browser, Node.js version
6. **Screenshots**: If applicable

## ✨ Feature Requests

When requesting features, please include:

1. **Use Case**: Why this feature would be useful
2. **Proposed Solution**: How you think it should work
3. **Alternatives**: Other solutions you've considered
4. **Additional Context**: Any other relevant information

## 🔧 Pull Request Process

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Self-review of code changes
- [ ] Code is properly commented
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if needed)

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🧪 Testing

### Running Tests
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### Manual Testing
1. Test all terminal commands
2. Verify AI chat functionality
3. Check code editor features
4. Test file operations
5. Verify responsive design

## 📚 Documentation

### Code Documentation
- Use JSDoc for functions and classes
- Include examples for complex functions
- Document API endpoints
- Update README for new features

### Example JSDoc
```typescript
/**
 * Executes a terminal command
 * @param command - The command to execute
 * @param cwd - Current working directory
 * @returns Promise with command output
 * @example
 * ```typescript
 * const result = await executeCommand('ls', '/workspace')
 * console.log(result.output)
 * ```
 */
async function executeCommand(command: string, cwd: string): Promise<CommandResult> {
  // Implementation
}
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Performance optimizations
- [ ] Additional AI model integrations
- [ ] Enhanced terminal features
- [ ] Mobile responsiveness
- [ ] Accessibility improvements

### Medium Priority
- [ ] Plugin system
- [ ] Theme customization
- [ ] Collaboration features
- [ ] Advanced debugging tools
- [ ] Code snippets library

### Low Priority
- [ ] Additional language support
- [ ] Custom keybindings
- [ ] Export/import features
- [ ] Analytics dashboard
- [ ] User preferences

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches

### Communication
- Use GitHub issues for bug reports and feature requests
- Use GitHub discussions for general questions
- Be clear and concise in your communication
- Provide context when asking questions

## 📞 Getting Help

### Resources
- [GitHub Issues](https://github.com/your-username/vibecode-terminal/issues)
- [GitHub Discussions](https://github.com/your-username/vibecode-terminal/discussions)
- [Documentation](https://docs.vibecode.com)

### Questions?
- Check existing issues and discussions first
- Ask specific, well-formatted questions
- Provide relevant context and code examples
- Be patient for responses

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to VibeCode Terminal! 🎉