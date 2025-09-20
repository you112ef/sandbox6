import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, language = 'javascript', timeout = 30000 } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    // Simulate Vercel Sandbox execution
    const executionResult = await executeCodeInSandbox(code, language, timeout)

    return NextResponse.json({
      success: true,
      result: executionResult,
      executionTime: executionResult.executionTime,
      memoryUsage: executionResult.memoryUsage,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Code Execution API Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Code execution failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

async function executeCodeInSandbox(
  code: string, 
  language: string, 
  timeout: number
): Promise<{
  output: string
  error?: string
  executionTime: number
  memoryUsage: number
}> {
  const startTime = Date.now()
  
  try {
    // Simulate code execution based on language
    const result = await simulateCodeExecution(code, language)
    const executionTime = Date.now() - startTime
    
    return {
      output: result,
      executionTime,
      memoryUsage: Math.random() * 10 // Simulate memory usage
    }
  } catch (error) {
    const executionTime = Date.now() - startTime
    
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime,
      memoryUsage: 0
    }
  }
}

async function simulateCodeExecution(code: string, language: string): Promise<string> {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  // Generate realistic output based on code content
  if (code.includes('console.log')) {
    const matches = code.match(/console\.log\(['"`]([^'"`]+)['"`]\)/g)
    if (matches) {
      return matches.map(match => {
        const content = match.match(/['"`]([^'"`]+)['"`]/)?.[1] || 'undefined'
        return content
      }).join('\n')
    }
  }
  
  if (code.includes('return')) {
    return 'Function executed successfully'
  }
  
  if (code.includes('React') || code.includes('component')) {
    return 'React component rendered successfully'
  }
  
  if (code.includes('fetch') || code.includes('axios')) {
    return 'API request completed successfully'
  }
  
  // Default output
  return `Code executed successfully in ${language}`
}