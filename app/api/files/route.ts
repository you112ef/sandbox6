import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path') || '/workspace'
    
    try {
      const stats = await fs.stat(filePath)
      
      if (stats.isDirectory()) {
        const files = await fs.readdir(filePath)
        const fileList = await Promise.all(
          files.map(async (file) => {
            const fullPath = path.join(filePath, file)
            const fileStats = await fs.stat(fullPath)
            return {
              name: file,
              type: fileStats.isDirectory() ? 'folder' : 'file',
              size: fileStats.size,
              modified: fileStats.mtime,
              path: fullPath
            }
          })
        )
        
        return NextResponse.json({ files: fileList })
      } else {
        const content = await fs.readFile(filePath, 'utf-8')
        return NextResponse.json({ 
          content,
          size: stats.size,
          modified: stats.mtime
        })
      }
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Files API Error:', error)
    return NextResponse.json(
      { error: 'Failed to read files' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, path: filePath, content, name } = await request.json()
    
    switch (action) {
      case 'create':
        if (!name) {
          return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }
        
        const newPath = path.join(filePath, name)
        await fs.writeFile(newPath, content || '', 'utf-8')
        
        return NextResponse.json({ 
          success: true, 
          path: newPath,
          message: 'File created successfully'
        })
        
      case 'write':
        if (!filePath) {
          return NextResponse.json({ error: 'Path is required' }, { status: 400 })
        }
        
        await fs.writeFile(filePath, content || '', 'utf-8')
        
        return NextResponse.json({ 
          success: true,
          message: 'File saved successfully'
        })
        
      case 'mkdir':
        if (!name) {
          return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }
        
        const dirPath = path.join(filePath, name)
        await fs.mkdir(dirPath, { recursive: true })
        
        return NextResponse.json({ 
          success: true, 
          path: dirPath,
          message: 'Directory created successfully'
        })
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Files API Error:', error)
    return NextResponse.json(
      { error: 'Failed to perform file operation' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path: filePath } = await request.json()
    
    if (!filePath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }
    
    const stats = await fs.stat(filePath)
    
    if (stats.isDirectory()) {
      await fs.rmdir(filePath, { recursive: true })
    } else {
      await fs.unlink(filePath)
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'File deleted successfully'
    })
    
  } catch (error) {
    console.error('Files API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}