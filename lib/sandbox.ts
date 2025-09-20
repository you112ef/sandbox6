import { VercelSandbox } from '@vercel/sandbox'

export interface SandboxConfig {
  timeout?: number
  memory?: number
  environment?: string
  packages?: string[]
}

export interface ExecutionResult {
  output: string
  error?: string
  executionTime: number
  memoryUsage: number
  exitCode: number
  logs: string[]
}

export class VibeCodeSandbox {
  private sandbox: VercelSandbox
  private config: SandboxConfig

  constructor(config: SandboxConfig = {}) {
    this.config = {
      timeout: 30000,
      memory: 512,
      environment: 'node',
      packages: [],
      ...config
    }
    
    this.sandbox = new VercelSandbox({
      token: process.env.VERCEL_SANDBOX_TOKEN,
      timeout: this.config.timeout,
      memory: this.config.memory
    })
  }

  async executeCode(
    code: string,
    language: string,
    options: SandboxConfig = {}
  ): Promise<ExecutionResult> {
    const startTime = Date.now()
    const logs: string[] = []
    
    try {
      logs.push(`Starting ${language} execution`)
      
      // Configure sandbox based on language
      const sandboxConfig = this.getSandboxConfig(language, options)
      
      // Execute code in sandbox
      const result = await this.sandbox.execute({
        code,
        language,
        ...sandboxConfig
      })
      
      const executionTime = Date.now() - startTime
      logs.push(`Execution completed in ${executionTime}ms`)
      
      return {
        output: result.output,
        error: result.error,
        executionTime,
        memoryUsage: result.memoryUsage || 0,
        exitCode: result.exitCode || 0,
        logs
      }
      
    } catch (error) {
      const executionTime = Date.now() - startTime
      logs.push(`Execution failed: ${error}`)
      
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        memoryUsage: 0,
        exitCode: 1,
        logs
      }
    }
  }

  async executeFile(
    filePath: string,
    language: string,
    options: SandboxConfig = {}
  ): Promise<ExecutionResult> {
    const startTime = Date.now()
    const logs: string[] = []
    
    try {
      logs.push(`Executing file: ${filePath}`)
      
      // Read file content
      const fs = await import('fs/promises')
      const code = await fs.readFile(filePath, 'utf-8')
      
      // Execute the file
      return await this.executeCode(code, language, options)
      
    } catch (error) {
      const executionTime = Date.now() - startTime
      logs.push(`File execution failed: ${error}`)
      
      return {
        output: '',
        error: error instanceof Error ? error.message : 'File execution failed',
        executionTime,
        memoryUsage: 0,
        exitCode: 1,
        logs
      }
    }
  }

  async installPackages(packages: string[]): Promise<ExecutionResult> {
    const startTime = Date.now()
    const logs: string[] = []
    
    try {
      logs.push(`Installing packages: ${packages.join(', ')}`)
      
      const installCommand = this.getInstallCommand(packages)
      const result = await this.sandbox.execute({
        code: installCommand,
        language: 'bash'
      })
      
      const executionTime = Date.now() - startTime
      logs.push(`Package installation completed in ${executionTime}ms`)
      
      return {
        output: result.output,
        error: result.error,
        executionTime,
        memoryUsage: result.memoryUsage || 0,
        exitCode: result.exitCode || 0,
        logs
      }
      
    } catch (error) {
      const executionTime = Date.now() - startTime
      logs.push(`Package installation failed: ${error}`)
      
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Package installation failed',
        executionTime,
        memoryUsage: 0,
        exitCode: 1,
        logs
      }
    }
  }

  async runTests(testCommand: string): Promise<ExecutionResult> {
    const startTime = Date.now()
    const logs: string[] = []
    
    try {
      logs.push(`Running tests: ${testCommand}`)
      
      const result = await this.sandbox.execute({
        code: testCommand,
        language: 'bash'
      })
      
      const executionTime = Date.now() - startTime
      logs.push(`Tests completed in ${executionTime}ms`)
      
      return {
        output: result.output,
        error: result.error,
        executionTime,
        memoryUsage: result.memoryUsage || 0,
        exitCode: result.exitCode || 0,
        logs
      }
      
    } catch (error) {
      const executionTime = Date.now() - startTime
      logs.push(`Test execution failed: ${error}`)
      
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Test execution failed',
        executionTime,
        memoryUsage: 0,
        exitCode: 1,
        logs
      }
    }
  }

  private getSandboxConfig(language: string, options: SandboxConfig) {
    const baseConfig = {
      timeout: options.timeout || this.config.timeout,
      memory: options.memory || this.config.memory,
      environment: options.environment || this.config.environment
    }

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return {
          ...baseConfig,
          environment: 'node',
          packages: ['typescript', '@types/node', ...(options.packages || [])]
        }
      
      case 'python':
      case 'python3':
        return {
          ...baseConfig,
          environment: 'python',
          packages: ['requests', 'numpy', 'pandas', ...(options.packages || [])]
        }
      
      case 'go':
        return {
          ...baseConfig,
          environment: 'go',
          packages: options.packages || []
        }
      
      case 'rust':
        return {
          ...baseConfig,
          environment: 'rust',
          packages: options.packages || []
        }
      
      case 'java':
        return {
          ...baseConfig,
          environment: 'java',
          packages: options.packages || []
        }
      
      case 'cpp':
      case 'c++':
        return {
          ...baseConfig,
          environment: 'cpp',
          packages: options.packages || []
        }
      
      default:
        return baseConfig
    }
  }

  private getInstallCommand(packages: string[]): string {
    const environment = this.config.environment || 'node'
    
    switch (environment) {
      case 'node':
        return `npm install ${packages.join(' ')}`
      
      case 'python':
        return `pip install ${packages.join(' ')}`
      
      case 'go':
        return packages.map(pkg => `go get ${pkg}`).join(' && ')
      
      case 'rust':
        return packages.map(pkg => `cargo add ${pkg}`).join(' && ')
      
      case 'java':
        return packages.map(pkg => `mvn dependency:get -Dartifact=${pkg}`).join(' && ')
      
      default:
        return `echo "Package installation not supported for ${environment}"`
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.sandbox.cleanup()
    } catch (error) {
      console.error('Sandbox cleanup failed:', error)
    }
  }
}

// Export singleton instance
export const sandbox = new VibeCodeSandbox()