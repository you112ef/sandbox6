export interface TerminalCommand {
  command: string
  args: string[]
  cwd: string
}

export interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'system'
  content: string
  timestamp: Date
}

export class TerminalManager {
  private commands: Map<string, (args: string[], cwd: string) => Promise<string>> = new Map()
  private history: string[] = []
  private currentDirectory: string = '/workspace'

  constructor() {
    this.initializeCommands()
  }

  private initializeCommands() {
    // Built-in commands
    this.commands.set('help', this.helpCommand.bind(this))
    this.commands.set('ls', this.lsCommand.bind(this))
    this.commands.set('pwd', this.pwdCommand.bind(this))
    this.commands.set('cd', this.cdCommand.bind(this))
    this.commands.set('cat', this.catCommand.bind(this))
    this.commands.set('mkdir', this.mkdirCommand.bind(this))
    this.commands.set('touch', this.touchCommand.bind(this))
    this.commands.set('rm', this.rmCommand.bind(this))
    this.commands.set('clear', this.clearCommand.bind(this))
    this.commands.set('echo', this.echoCommand.bind(this))
    this.commands.set('whoami', this.whoamiCommand.bind(this))
    this.commands.set('date', this.dateCommand.bind(this))
    this.commands.set('run', this.runCommand.bind(this))
    this.commands.set('ai', this.aiCommand.bind(this))
  }

  async executeCommand(input: string): Promise<TerminalOutput[]> {
    const trimmed = input.trim()
    if (!trimmed) {
      return []
    }

    // Add to history
    this.history.push(trimmed)

    const parts = trimmed.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    try {
      if (this.commands.has(command)) {
        const result = await this.commands.get(command)!(args, this.currentDirectory)
        return [{
          type: 'stdout',
          content: result,
          timestamp: new Date()
        }]
      } else {
        return [{
          type: 'stderr',
          content: `Command not found: ${command}. Type 'help' for available commands.`,
          timestamp: new Date()
        }]
      }
    } catch (error) {
      return [{
        type: 'stderr',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }]
    }
  }

  getHistory(): string[] {
    return [...this.history]
  }

  getCurrentDirectory(): string {
    return this.currentDirectory
  }

  private async helpCommand(args: string[], cwd: string): Promise<string> {
    return `Available commands:
  help          - Show this help message
  ls            - List directory contents
  pwd           - Print working directory
  cd <dir>      - Change directory
  cat <file>    - Display file contents
  mkdir <dir>   - Create directory
  touch <file>  - Create file
  rm <file>     - Remove file
  clear         - Clear terminal
  echo <text>   - Print text
  whoami       - Show current user
  date          - Show current date
  run           - Execute code in sandbox
  ai            - Open AI chat interface`
  }

  private async lsCommand(args: string[], cwd: string): Promise<string> {
    const path = args[0] ? `${cwd}/${args[0]}` : cwd
    
    // Simulate file listing
    const files = [
      { name: 'app', type: 'directory' },
      { name: 'components', type: 'directory' },
      { name: 'lib', type: 'directory' },
      { name: 'public', type: 'directory' },
      { name: 'package.json', type: 'file' },
      { name: 'README.md', type: 'file' },
      { name: 'tsconfig.json', type: 'file' }
    ]

    return files.map(file => 
      `${file.type === 'directory' ? '📁' : '📄'} ${file.name}`
    ).join('\n')
  }

  private async pwdCommand(args: string[], cwd: string): Promise<string> {
    return cwd
  }

  private async cdCommand(args: string[], cwd: string): Promise<string> {
    if (args.length === 0) {
      this.currentDirectory = '/workspace'
      return ''
    }

    const targetDir = args[0]
    let newPath: string

    if (targetDir === '..') {
      newPath = cwd.split('/').slice(0, -1).join('/') || '/'
    } else if (targetDir.startsWith('/')) {
      newPath = targetDir
    } else {
      newPath = `${cwd}/${targetDir}`.replace(/\/+/g, '/')
    }

    // Simulate directory change
    this.currentDirectory = newPath
    return ''
  }

  private async catCommand(args: string[], cwd: string): Promise<string> {
    if (args.length === 0) {
      return 'Usage: cat <file>'
    }

    const filename = args[0]
    
    // Simulate file content based on filename
    if (filename === 'package.json') {
      return `{
  "name": "vibecode-terminal",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0"
  }
}`
    } else if (filename === 'README.md') {
      return `# VibeCode Terminal
AI-powered development environment`
    } else {
      return `Content of ${filename} would be displayed here`
    }
  }

  private async mkdirCommand(args: string[], cwd: string): Promise<string> {
    if (args.length === 0) {
      return 'Usage: mkdir <directory>'
    }

    const dirname = args[0]
    return `Directory '${dirname}' created successfully`
  }

  private async touchCommand(args: string[], cwd: string): Promise<string> {
    if (args.length === 0) {
      return 'Usage: touch <file>'
    }

    const filename = args[0]
    return `File '${filename}' created successfully`
  }

  private async rmCommand(args: string[], cwd: string): Promise<string> {
    if (args.length === 0) {
      return 'Usage: rm <file>'
    }

    const filename = args[0]
    return `File '${filename}' removed successfully`
  }

  private async clearCommand(args: string[], cwd: string): Promise<string> {
    return '\x1b[2J\x1b[H' // ANSI escape sequence to clear screen
  }

  private async echoCommand(args: string[], cwd: string): Promise<string> {
    return args.join(' ')
  }

  private async whoamiCommand(args: string[], cwd: string): Promise<string> {
    return 'vibecode-user'
  }

  private async dateCommand(args: string[], cwd: string): Promise<string> {
    return new Date().toString()
  }

  private async runCommand(args: string[], cwd: string): Promise<string> {
    return `Executing code in Vercel Sandbox...
✓ Code executed successfully
✓ Output: Hello, World!
✓ Execution time: 150ms`
  }

  private async aiCommand(args: string[], cwd: string): Promise<string> {
    return `Opening AI chat interface...
🤖 AI Assistant is ready to help you with:
• Code generation and debugging
• Code optimization and best practices
• Technical explanations and tutorials
• Project architecture and design patterns`
  }
}