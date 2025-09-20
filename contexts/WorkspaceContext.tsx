'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  children?: FileNode[]
  parent?: string
}

interface WorkspaceState {
  files: FileNode[]
  activeFile: string | null
  openFiles: string[]
  recentFiles: string[]
  workspaceName: string
  isDirty: boolean
}

interface WorkspaceContextType extends WorkspaceState {
  setActiveFile: (fileId: string | null) => void
  openFile: (fileId: string) => void
  closeFile: (fileId: string) => void
  updateFileContent: (fileId: string, content: string) => void
  createFile: (name: string, parentId?: string) => void
  createFolder: (name: string, parentId?: string) => void
  deleteFile: (fileId: string) => void
  renameFile: (fileId: string, newName: string) => void
  saveWorkspace: () => void
  loadWorkspace: (workspaceData: any) => void
  exportWorkspace: () => void
  importWorkspace: (file: File) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>({
    files: [],
    activeFile: null,
    openFiles: [],
    recentFiles: [],
    workspaceName: 'VibeCode Workspace',
    isDirty: false
  })

  // Initialize with sample workspace
  useEffect(() => {
    const initialFiles: FileNode[] = [
      {
        id: 'workspace',
        name: 'workspace',
        type: 'folder',
        children: [
          {
            id: 'app',
            name: 'app',
            type: 'folder',
            children: [
              { 
                id: 'layout.tsx', 
                name: 'layout.tsx', 
                type: 'file', 
                language: 'typescript',
                content: `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeCode Terminal',
  description: 'AI-powered terminal workspace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}`
              },
              { 
                id: 'page.tsx', 
                name: 'page.tsx', 
                type: 'file', 
                language: 'typescript',
                content: `'use client'

import Terminal from '@/components/Terminal'
import FileExplorer from '@/components/FileExplorer'
import CodeEditor from '@/components/CodeEditor'

export default function Home() {
  return (
    <div className="h-screen flex">
      <FileExplorer />
      <div className="flex-1">
        <CodeEditor />
        <Terminal />
      </div>
    </div>
  )
}`
              }
            ]
          },
          {
            id: 'components',
            name: 'components',
            type: 'folder',
            children: [
              { 
                id: 'Terminal.tsx', 
                name: 'Terminal.tsx', 
                type: 'file', 
                language: 'typescript',
                content: '// Terminal component implementation'
              }
            ]
          },
          { 
            id: 'package.json', 
            name: 'package.json', 
            type: 'file', 
            language: 'json',
            content: `{
  "name": "vibecode-terminal",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0"
  }
}`
          }
        ]
      }
    ]
    
    setState(prev => ({ ...prev, files: initialFiles }))
  }, [])

  const setActiveFile = (fileId: string | null) => {
    setState(prev => ({ ...prev, activeFile: fileId }))
  }

  const openFile = (fileId: string) => {
    setState(prev => ({
      ...prev,
      activeFile: fileId,
      openFiles: prev.openFiles.includes(fileId) 
        ? prev.openFiles 
        : [...prev.openFiles, fileId],
      recentFiles: [fileId, ...prev.recentFiles.filter(id => id !== fileId)]
    }))
  }

  const closeFile = (fileId: string) => {
    setState(prev => ({
      ...prev,
      openFiles: prev.openFiles.filter(id => id !== fileId),
      activeFile: prev.activeFile === fileId ? null : prev.activeFile
    }))
  }

  const updateFileContent = (fileId: string, content: string) => {
    const updateFile = (files: FileNode[]): FileNode[] => {
      return files.map(file => {
        if (file.id === fileId) {
          return { ...file, content }
        }
        if (file.children) {
          return { ...file, children: updateFile(file.children) }
        }
        return file
      })
    }

    setState(prev => ({
      ...prev,
      files: updateFile(prev.files),
      isDirty: true
    }))
  }

  const createFile = (name: string, parentId?: string) => {
    const newFile: FileNode = {
      id: Date.now().toString(),
      name,
      type: 'file',
      content: '',
      language: name.split('.').pop()?.toLowerCase() === 'tsx' ? 'typescript' : 'text'
    }

    const addFile = (files: FileNode[]): FileNode[] => {
      return files.map(file => {
        if (file.id === parentId || (!parentId && file.id === 'workspace')) {
          return {
            ...file,
            children: [...(file.children || []), newFile]
          }
        }
        if (file.children) {
          return { ...file, children: addFile(file.children) }
        }
        return file
      })
    }

    setState(prev => ({
      ...prev,
      files: addFile(prev.files),
      isDirty: true
    }))
  }

  const createFolder = (name: string, parentId?: string) => {
    const newFolder: FileNode = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      children: []
    }

    const addFolder = (files: FileNode[]): FileNode[] => {
      return files.map(file => {
        if (file.id === parentId || (!parentId && file.id === 'workspace')) {
          return {
            ...file,
            children: [...(file.children || []), newFolder]
          }
        }
        if (file.children) {
          return { ...file, children: addFolder(file.children) }
        }
        return file
      })
    }

    setState(prev => ({
      ...prev,
      files: addFolder(prev.files),
      isDirty: true
    }))
  }

  const deleteFile = (fileId: string) => {
    const removeFile = (files: FileNode[]): FileNode[] => {
      return files.filter(file => {
        if (file.id === fileId) {
          return false
        }
        if (file.children) {
          return { ...file, children: removeFile(file.children) }
        }
        return true
      })
    }

    setState(prev => ({
      ...prev,
      files: removeFile(prev.files),
      openFiles: prev.openFiles.filter(id => id !== fileId),
      activeFile: prev.activeFile === fileId ? null : prev.activeFile,
      isDirty: true
    }))
  }

  const renameFile = (fileId: string, newName: string) => {
    const rename = (files: FileNode[]): FileNode[] => {
      return files.map(file => {
        if (file.id === fileId) {
          return { ...file, name: newName }
        }
        if (file.children) {
          return { ...file, children: rename(file.children) }
        }
        return file
      })
    }

    setState(prev => ({
      ...prev,
      files: rename(prev.files),
      isDirty: true
    }))
  }

  const saveWorkspace = () => {
    const workspaceData = {
      files: state.files,
      workspaceName: state.workspaceName,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('vibecode-workspace', JSON.stringify(workspaceData))
    setState(prev => ({ ...prev, isDirty: false }))
  }

  const loadWorkspace = (workspaceData: any) => {
    setState(prev => ({
      ...prev,
      files: workspaceData.files || prev.files,
      workspaceName: workspaceData.workspaceName || prev.workspaceName,
      isDirty: false
    }))
  }

  const exportWorkspace = () => {
    const workspaceData = {
      files: state.files,
      workspaceName: state.workspaceName,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(workspaceData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${state.workspaceName}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importWorkspace = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workspaceData = JSON.parse(e.target?.result as string)
        loadWorkspace(workspaceData)
      } catch (error) {
        console.error('Error importing workspace:', error)
      }
    }
    reader.readAsText(file)
  }

  const value: WorkspaceContextType = {
    ...state,
    setActiveFile,
    openFile,
    closeFile,
    updateFileContent,
    createFile,
    createFolder,
    deleteFile,
    renameFile,
    saveWorkspace,
    loadWorkspace,
    exportWorkspace,
    importWorkspace
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}