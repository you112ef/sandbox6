'use client'

import { useState, useEffect } from 'react'
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  FileCode, 
  FileImage, 
  FileJson,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload
} from 'lucide-react'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  content?: string
  language?: string
}

interface FileExplorerProps {
  className?: string
}

export default function FileExplorer({ className = '' }: FileExplorerProps) {
  const [files, setFiles] = useState<FileNode[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['workspace']))
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null)

  useEffect(() => {
    // Initialize with sample workspace structure
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
              { id: 'layout.tsx', name: 'layout.tsx', type: 'file', language: 'typescript' },
              { id: 'page.tsx', name: 'page.tsx', type: 'file', language: 'typescript' },
              { id: 'globals.css', name: 'globals.css', type: 'file', language: 'css' }
            ]
          },
          {
            id: 'components',
            name: 'components',
            type: 'folder',
            children: [
              { id: 'Terminal.tsx', name: 'Terminal.tsx', type: 'file', language: 'typescript' },
              { id: 'FileExplorer.tsx', name: 'FileExplorer.tsx', type: 'file', language: 'typescript' },
              { id: 'CodeEditor.tsx', name: 'CodeEditor.tsx', type: 'file', language: 'typescript' }
            ]
          },
          {
            id: 'lib',
            name: 'lib',
            type: 'folder',
            children: [
              { id: 'utils.ts', name: 'utils.ts', type: 'file', language: 'typescript' },
              { id: 'api.ts', name: 'api.ts', type: 'file', language: 'typescript' }
            ]
          },
          {
            id: 'public',
            name: 'public',
            type: 'folder',
            children: [
              { id: 'favicon.ico', name: 'favicon.ico', type: 'file' },
              { id: 'logo.svg', name: 'logo.svg', type: 'file' }
            ]
          },
          { id: 'package.json', name: 'package.json', type: 'file', language: 'json' },
          { id: 'tsconfig.json', name: 'tsconfig.json', type: 'file', language: 'json' },
          { id: 'README.md', name: 'README.md', type: 'file', language: 'markdown' }
        ]
      }
    ]
    setFiles(initialFiles)
  }, [])

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? FolderOpen : Folder
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'tsx':
      case 'ts':
      case 'jsx':
      case 'js':
        return FileCode
      case 'json':
        return FileJson
      case 'md':
        return FileText
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return FileImage
      default:
        return File
    }
  }

  const toggleFolder = (fileId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      return newSet
    })
  }

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'folder') {
      toggleFolder(file.id)
    } else {
      setSelectedFile(file.id)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, fileId })
  }

  const renderFileNode = (file: FileNode, depth = 0) => {
    const Icon = getFileIcon(file)
    const isExpanded = expandedFolders.has(file.id)
    const isSelected = selectedFile === file.id

    return (
      <div key={file.id}>
        <div
          className={`file-item flex items-center py-1 px-2 cursor-pointer hover:bg-gray-700 ${
            isSelected ? 'bg-blue-600' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleFileClick(file)}
          onContextMenu={(e) => handleContextMenu(e, file.id)}
        >
          <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{file.name}</span>
        </div>
        {file.type === 'folder' && isExpanded && file.children && (
          <div>
            {file.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`file-explorer h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold">Explorer</h3>
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-700 rounded">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded">
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {files.map(file => renderFileNode(file))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={() => setContextMenu(null)}
        >
          <button className="w-full px-3 py-1 text-left text-sm hover:bg-gray-700 flex items-center">
            <Edit3 className="w-4 h-4 mr-2" />
            Rename
          </button>
          <button className="w-full px-3 py-1 text-left text-sm hover:bg-gray-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button className="w-full px-3 py-1 text-left text-sm hover:bg-gray-700 flex items-center text-red-400">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="p-2 border-t border-gray-700 text-xs text-gray-400">
        {selectedFile ? `Selected: ${selectedFile}` : 'No file selected'}
      </div>
    </div>
  )
}