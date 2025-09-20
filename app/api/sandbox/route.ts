import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { 
      code, 
      language = 'javascript', 
      timeout = 30000,
      environment = 'node' 
    } = await request.json()
    
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }
    
    // Simulate Vercel Sandbox execution
    const result = await executeInSandbox(code, language, timeout, environment)
    
    return NextResponse.json({
      success: true,
      result: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
      logs: result.logs,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Sandbox API Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Sandbox execution failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

async function executeInSandbox(
  code: string,
  language: string,
  timeout: number,
  environment: string
): Promise<{
  output: string
  error?: string
  executionTime: number
  memoryUsage: number
  logs: string[]
}> {
  const startTime = Date.now()
  const logs: string[] = []
  
  try {
    logs.push(`Starting ${language} execution in ${environment} environment`)
    
    // Simulate different execution environments
    let result: string
    
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        result = await executeJavaScript(code, environment)
        break
      case 'python':
        result = await executePython(code)
        break
      case 'python3':
        result = await executePython(code)
        break
      case 'bash':
      case 'shell':
        result = await executeShell(code)
        break
      case 'go':
        result = await executeGo(code)
        break
      case 'rust':
        result = await executeRust(code)
        break
      case 'java':
        result = await executeJava(code)
        break
      case 'cpp':
      case 'c++':
        result = await executeCpp(code)
        break
      default:
        result = await executeGeneric(code, language)
    }
    
    const executionTime = Date.now() - startTime
    logs.push(`Execution completed in ${executionTime}ms`)
    
    return {
      output: result,
      executionTime,
      memoryUsage: Math.random() * 50 + 10, // Simulate memory usage
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
      logs
    }
  }
}

async function executeJavaScript(code: string, environment: string): Promise<string> {
  // Simulate Node.js execution
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  if (code.includes('console.log')) {
    const matches = code.match(/console\.log\(['"`]([^'"`]+)['"`]\)/g)
    if (matches) {
      return matches.map(match => {
        const content = match.match(/['"`]([^'"`]+)['"`]/)?.[1] || 'undefined'
        return content
      }).join('\n')
    }
  }
  
  if (code.includes('React') || code.includes('component')) {
    return 'React component rendered successfully'
  }
  
  if (code.includes('fetch') || code.includes('axios')) {
    return 'API request completed successfully'
  }
  
  return 'JavaScript code executed successfully'
}

async function executePython(code: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))
  
  if (code.includes('print')) {
    const matches = code.match(/print\(['"]([^'"]+)['"]\)/g)
    if (matches) {
      return matches.map(match => {
        const content = match.match(/['"]([^'"]+)['"]/)?.[1] || 'undefined'
        return content
      }).join('\n')
    }
  }
  
  if (code.includes('import') && code.includes('pandas')) {
    return 'Data analysis completed successfully'
  }
  
  if (code.includes('import') && code.includes('requests')) {
    return 'HTTP request completed successfully'
  }
  
  return 'Python code executed successfully'
}

async function executeShell(code: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
  
  if (code.includes('ls')) {
    return 'app/\ncomponents/\nlib/\npackage.json\nREADME.md'
  }
  
  if (code.includes('pwd')) {
    return '/workspace'
  }
  
  if (code.includes('echo')) {
    const match = code.match(/echo\s+(.+)/)
    return match ? match[1] : 'echo command executed'
  }
  
  return 'Shell command executed successfully'
}

async function executeGo(code: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
  return 'Go program executed successfully'
}

async function executeRust(code: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 3000))
  return 'Rust program executed successfully'
}

async function executeJava(code: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 4000))
  return 'Java program executed successfully'
}

async function executeCpp(code: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
  return 'C++ program executed successfully'
}

async function executeGeneric(code: string, language: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  return `${language} code executed successfully`
}