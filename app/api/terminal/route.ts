import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

export async function POST(request: NextRequest) {
  try {
    const { command, cwd = '/workspace' } = await request.json()
    
    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }
    
    const result = await executeCommand(command, cwd)
    
    return NextResponse.json({
      success: true,
      output: result.output,
      error: result.error,
      exitCode: result.exitCode,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Terminal API Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Command execution failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

function executeCommand(command: string, cwd: string): Promise<{
  output: string
  error: string
  exitCode: number
}> {
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(' ')
    
    const child = spawn(cmd, args, {
      cwd,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
    })
    
    let output = ''
    let error = ''
    
    child.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    child.stderr.on('data', (data) => {
      error += data.toString()
    })
    
    child.on('close', (code) => {
      resolve({
        output: output.trim(),
        error: error.trim(),
        exitCode: code || 0
      })
    })
    
    child.on('error', (err) => {
      resolve({
        output: '',
        error: err.message,
        exitCode: 1
      })
    })
    
    // Set timeout for long-running commands
    setTimeout(() => {
      child.kill()
      resolve({
        output: output.trim(),
        error: 'Command timed out',
        exitCode: 124
      })
    }, 30000) // 30 second timeout
  })
}