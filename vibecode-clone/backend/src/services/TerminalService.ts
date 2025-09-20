import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import { logger } from '../utils/logger'

export interface CommandResult {
  success: boolean
  output: string
  error?: string
  exitCode?: number
  duration: number
}

export interface ActiveProcess {
  id: string
  workspaceId: string
  command: string
  process: ChildProcess
  startTime: Date
}

export class TerminalService {
  private activeProcesses: Map<string, ActiveProcess> = new Map()
  private workspacesPath: string

  constructor() {
    this.workspacesPath = path.join(process.cwd(), 'workspaces')
  }

  private generateProcessId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private getWorkspacePath(workspaceId: string): string {
    return path.join(this.workspacesPath, workspaceId)
  }

  async executeCommand(
    workspaceId: string,
    command: string,
    timeout: number = 30000
  ): Promise<CommandResult> {
    const startTime = Date.now()
    const workspacePath = this.getWorkspacePath(workspaceId)

    return new Promise((resolve) => {
      let output = ''
      let error = ''

      // Parse command and arguments
      const [cmd, ...args] = command.split(' ')
      
      // Security: Only allow safe commands
      const allowedCommands = [
        'npm', 'node', 'yarn', 'git', 'ls', 'pwd', 'cat', 'echo', 'mkdir', 'rm',
        'cp', 'mv', 'grep', 'find', 'wc', 'head', 'tail', 'sort', 'uniq',
        'python', 'python3', 'pip', 'pip3', 'java', 'javac', 'gcc', 'g++',
        'make', 'cmake', 'docker', 'curl', 'wget'
      ]

      if (!allowedCommands.includes(cmd)) {
        resolve({
          success: false,
          output: '',
          error: `Command '${cmd}' is not allowed for security reasons`,
          exitCode: 1,
          duration: Date.now() - startTime
        })
        return
      }

      const childProcess = spawn(cmd, args, {
        cwd: workspacePath,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          NODE_ENV: 'development',
          PATH: process.env.PATH
        }
      })

      const processId = this.generateProcessId()
      this.activeProcesses.set(processId, {
        id: processId,
        workspaceId,
        command,
        process: childProcess,
        startTime: new Date()
      })

      // Set timeout
      const timeoutHandle = setTimeout(() => {
        childProcess.kill('SIGTERM')
        this.activeProcesses.delete(processId)
        resolve({
          success: false,
          output: output.trim(),
          error: 'Command timed out',
          exitCode: -1,
          duration: Date.now() - startTime
        })
      }, timeout)

      childProcess.stdout?.on('data', (data) => {
        output += data.toString()
      })

      childProcess.stderr?.on('data', (data) => {
        error += data.toString()
      })

      childProcess.on('close', (code) => {
        clearTimeout(timeoutHandle)
        this.activeProcesses.delete(processId)
        
        const duration = Date.now() - startTime
        const result: CommandResult = {
          success: code === 0,
          output: output.trim(),
          error: error.trim() || undefined,
          exitCode: code || 0,
          duration
        }

        logger.info(`Command executed: ${command} (${duration}ms, exit code: ${code})`)
        resolve(result)
      })

      childProcess.on('error', (err) => {
        clearTimeout(timeoutHandle)
        this.activeProcesses.delete(processId)
        
        resolve({
          success: false,
          output: output.trim(),
          error: err.message,
          exitCode: 1,
          duration: Date.now() - startTime
        })
      })
    })
  }

  async executeInteractiveCommand(
    workspaceId: string,
    command: string,
    onOutput: (data: string) => void,
    onError: (data: string) => void,
    onClose: (code: number) => void
  ): Promise<string> {
    const workspacePath = this.getWorkspacePath(workspaceId)
    const [cmd, ...args] = command.split(' ')

    const childProcess = spawn(cmd, args, {
      cwd: workspacePath,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    })

    const processId = this.generateProcessId()
    this.activeProcesses.set(processId, {
      id: processId,
      workspaceId,
      command,
      process: childProcess,
      startTime: new Date()
    })

    childProcess.stdout?.on('data', (data) => {
      onOutput(data.toString())
    })

    childProcess.stderr?.on('data', (data) => {
      onError(data.toString())
    })

    childProcess.on('close', (code) => {
      this.activeProcesses.delete(processId)
      onClose(code || 0)
    })

    return processId
  }

  killProcess(processId: string): boolean {
    const activeProcess = this.activeProcesses.get(processId)
    if (activeProcess) {
      activeProcess.process.kill('SIGTERM')
      this.activeProcesses.delete(processId)
      logger.info(`Process killed: ${processId}`)
      return true
    }
    return false
  }

  getActiveProcesses(workspaceId?: string): ActiveProcess[] {
    const processes = Array.from(this.activeProcesses.values())
    return workspaceId 
      ? processes.filter(p => p.workspaceId === workspaceId)
      : processes
  }

  async installDependencies(workspaceId: string): Promise<CommandResult> {
    logger.info(`Installing dependencies for workspace ${workspaceId}`)
    return this.executeCommand(workspaceId, 'npm install', 120000) // 2 minutes timeout
  }

  async runScript(workspaceId: string, script: string): Promise<CommandResult> {
    logger.info(`Running script "${script}" for workspace ${workspaceId}`)
    return this.executeCommand(workspaceId, `npm run ${script}`, 60000) // 1 minute timeout
  }

  async gitInit(workspaceId: string): Promise<CommandResult> {
    logger.info(`Initializing git for workspace ${workspaceId}`)
    return this.executeCommand(workspaceId, 'git init')
  }

  async gitCommit(workspaceId: string, message: string): Promise<CommandResult> {
    logger.info(`Creating git commit for workspace ${workspaceId}`)
    
    // Add all files
    const addResult = await this.executeCommand(workspaceId, 'git add .')
    if (!addResult.success) {
      return addResult
    }

    // Commit with message
    return this.executeCommand(workspaceId, `git commit -m "${message}"`)
  }

  async buildProject(workspaceId: string): Promise<CommandResult> {
    logger.info(`Building project for workspace ${workspaceId}`)
    return this.executeCommand(workspaceId, 'npm run build', 180000) // 3 minutes timeout
  }

  async startDevServer(workspaceId: string): Promise<string> {
    logger.info(`Starting dev server for workspace ${workspaceId}`)
    
    return this.executeInteractiveCommand(
      workspaceId,
      'npm start',
      (data) => logger.info(`[${workspaceId}] ${data}`),
      (data) => logger.error(`[${workspaceId}] ${data}`),
      (code) => logger.info(`[${workspaceId}] Dev server stopped with code ${code}`)
    )
  }

  cleanup(): void {
    logger.info('Cleaning up active processes...')
    for (const [processId, activeProcess] of this.activeProcesses) {
      activeProcess.process.kill('SIGTERM')
      this.activeProcesses.delete(processId)
    }
  }
}