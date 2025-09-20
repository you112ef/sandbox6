import fs from 'fs/promises'
import path from 'path'
import { logger } from '../utils/logger'

export interface FileItem {
  id: string
  name: string
  path: string
  content?: string
  language?: string
  size: number
  mimeType?: string
  isDirectory: boolean
  parentId?: string
  workspaceId: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export class FileService {
  private workspacesPath: string

  constructor() {
    // Create workspaces directory in project root
    this.workspacesPath = path.join(process.cwd(), 'workspaces')
    this.initializeWorkspacesDirectory()
  }

  private async initializeWorkspacesDirectory() {
    try {
      await fs.mkdir(this.workspacesPath, { recursive: true })
      logger.info('Workspaces directory initialized')
    } catch (error) {
      logger.error('Failed to initialize workspaces directory:', error)
    }
  }

  private getWorkspacePath(workspaceId: string): string {
    return path.join(this.workspacesPath, workspaceId)
  }

  private getFilePath(workspaceId: string, filePath: string): string {
    const workspacePath = this.getWorkspacePath(workspaceId)
    return path.join(workspacePath, filePath)
  }

  private generateFileId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private getLanguageFromExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase().slice(1)
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      rb: 'ruby',
      php: 'php',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      cs: 'csharp',
      go: 'go',
      rs: 'rust',
      sh: 'bash',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml',
      md: 'markdown',
      sql: 'sql',
    }
    return languageMap[ext] || 'plaintext'
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase().slice(1)
    const mimeMap: Record<string, string> = {
      js: 'application/javascript',
      jsx: 'application/javascript',
      ts: 'application/typescript',
      tsx: 'application/typescript',
      py: 'text/x-python',
      html: 'text/html',
      css: 'text/css',
      json: 'application/json',
      md: 'text/markdown',
      txt: 'text/plain',
    }
    return mimeMap[ext] || 'text/plain'
  }

  async createWorkspace(workspaceId: string, authorId: string): Promise<void> {
    const workspacePath = this.getWorkspacePath(workspaceId)
    
    try {
      await fs.mkdir(workspacePath, { recursive: true })
      
      // Create initial files
      const initialFiles = [
        {
          name: 'README.md',
          content: `# Workspace ${workspaceId}\n\nWelcome to your new workspace!\n\n## Getting Started\n\nStart building your amazing project here.`
        },
        {
          name: 'package.json',
          content: JSON.stringify({
            name: `workspace-${workspaceId}`,
            version: '1.0.0',
            description: 'A new Vibecode workspace',
            main: 'index.js',
            scripts: {
              start: 'node index.js',
              dev: 'nodemon index.js'
            }
          }, null, 2)
        }
      ]

      for (const file of initialFiles) {
        const filePath = path.join(workspacePath, file.name)
        await fs.writeFile(filePath, file.content, 'utf8')
      }

      logger.info(`Workspace ${workspaceId} created successfully`)
    } catch (error) {
      logger.error(`Failed to create workspace ${workspaceId}:`, error)
      throw error
    }
  }

  async getWorkspaceFiles(workspaceId: string): Promise<FileItem[]> {
    const workspacePath = this.getWorkspacePath(workspaceId)
    
    try {
      const files = await this.readDirectoryRecursive(workspacePath, workspaceId, '', 'system')
      return files
    } catch (error) {
      logger.error(`Failed to read workspace ${workspaceId}:`, error)
      return []
    }
  }

  private async readDirectoryRecursive(
    dirPath: string, 
    workspaceId: string, 
    relativePath: string,
    authorId: string
  ): Promise<FileItem[]> {
    const items: FileItem[] = []

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const itemPath = path.join(relativePath, entry.name)
        const stats = await fs.stat(fullPath)

        const fileItem: FileItem = {
          id: this.generateFileId(),
          name: entry.name,
          path: itemPath,
          size: stats.size,
          isDirectory: entry.isDirectory(),
          workspaceId,
          authorId,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
        }

        if (entry.isDirectory()) {
          items.push(fileItem)
          // Recursively read subdirectories
          const subItems = await this.readDirectoryRecursive(fullPath, workspaceId, itemPath, authorId)
          items.push(...subItems)
        } else {
          fileItem.language = this.getLanguageFromExtension(entry.name)
          fileItem.mimeType = this.getMimeType(entry.name)
          items.push(fileItem)
        }
      }
    } catch (error) {
      logger.error(`Failed to read directory ${dirPath}:`, error)
    }

    return items
  }

  async getFileContent(workspaceId: string, filePath: string): Promise<string | null> {
    const fullPath = this.getFilePath(workspaceId, filePath)
    
    try {
      const content = await fs.readFile(fullPath, 'utf8')
      return content
    } catch (error) {
      logger.error(`Failed to read file ${filePath}:`, error)
      return null
    }
  }

  async createFile(
    workspaceId: string, 
    filePath: string, 
    content: string, 
    authorId: string
  ): Promise<FileItem | null> {
    const fullPath = this.getFilePath(workspaceId, filePath)
    
    try {
      // Create directory if it doesn't exist
      const dirPath = path.dirname(fullPath)
      await fs.mkdir(dirPath, { recursive: true })
      
      // Write file content
      await fs.writeFile(fullPath, content, 'utf8')
      
      // Get file stats
      const stats = await fs.stat(fullPath)
      const filename = path.basename(filePath)
      
      const fileItem: FileItem = {
        id: this.generateFileId(),
        name: filename,
        path: filePath,
        content,
        language: this.getLanguageFromExtension(filename),
        size: stats.size,
        mimeType: this.getMimeType(filename),
        isDirectory: false,
        workspaceId,
        authorId,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
      }

      logger.info(`File created: ${filePath}`)
      return fileItem
    } catch (error) {
      logger.error(`Failed to create file ${filePath}:`, error)
      return null
    }
  }

  async updateFile(
    workspaceId: string, 
    filePath: string, 
    content: string
  ): Promise<boolean> {
    const fullPath = this.getFilePath(workspaceId, filePath)
    
    try {
      await fs.writeFile(fullPath, content, 'utf8')
      logger.info(`File updated: ${filePath}`)
      return true
    } catch (error) {
      logger.error(`Failed to update file ${filePath}:`, error)
      return false
    }
  }

  async deleteFile(workspaceId: string, filePath: string): Promise<boolean> {
    const fullPath = this.getFilePath(workspaceId, filePath)
    
    try {
      const stats = await fs.stat(fullPath)
      
      if (stats.isDirectory()) {
        await fs.rmdir(fullPath, { recursive: true })
      } else {
        await fs.unlink(fullPath)
      }
      
      logger.info(`File deleted: ${filePath}`)
      return true
    } catch (error) {
      logger.error(`Failed to delete file ${filePath}:`, error)
      return false
    }
  }

  async renameFile(
    workspaceId: string, 
    oldPath: string, 
    newPath: string
  ): Promise<boolean> {
    const oldFullPath = this.getFilePath(workspaceId, oldPath)
    const newFullPath = this.getFilePath(workspaceId, newPath)
    
    try {
      // Create directory if it doesn't exist
      const newDirPath = path.dirname(newFullPath)
      await fs.mkdir(newDirPath, { recursive: true })
      
      await fs.rename(oldFullPath, newFullPath)
      logger.info(`File renamed: ${oldPath} -> ${newPath}`)
      return true
    } catch (error) {
      logger.error(`Failed to rename file ${oldPath} to ${newPath}:`, error)
      return false
    }
  }

  async deleteWorkspace(workspaceId: string): Promise<boolean> {
    const workspacePath = this.getWorkspacePath(workspaceId)
    
    try {
      await fs.rmdir(workspacePath, { recursive: true })
      logger.info(`Workspace ${workspaceId} deleted`)
      return true
    } catch (error) {
      logger.error(`Failed to delete workspace ${workspaceId}:`, error)
      return false
    }
  }
}