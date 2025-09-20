'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Code2, 
  Terminal, 
  Play, 
  Save, 
  Share, 
  Settings,
  FolderOpen,
  FileText,
  Plus,
  Trash2,
  Download,
  Upload,
  Users,
  MessageSquare,
  Eye,
  ArrowLeft,
  Zap,
  Globe
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  children?: FileItem[]
}

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [workspace, setWorkspace] = useState<any>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [code, setCode] = useState('')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [command, setCommand] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading workspace data
    const loadWorkspace = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockWorkspace = {
        id: params.id,
        name: 'My React App',
        description: 'A modern React application with TypeScript',
        aiAgent: 'Claude Code',
        status: 'ACTIVE',
        collaborators: 3
      }

      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'src',
          type: 'folder',
          children: [
            {
              id: '2',
              name: 'App.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Vibecode Clone</h1>
        <p>Start building amazing applications with AI assistance!</p>
        <button onClick={() => alert('Hello World!')}>
          Click me!
        </button>
      </header>
    </div>
  );
}

export default App;`
            },
            {
              id: '3',
              name: 'index.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
            },
            {
              id: '4',
              name: 'App.css',
              type: 'file',
              language: 'css',
              content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.App-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.App-header button {
  background-color: #61dafb;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.App-header button:hover {
  background-color: #21a1c4;
}`
            }
          ]
        },
        {
          id: '5',
          name: 'package.json',
          type: 'file',
          language: 'json',
          content: `{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`
        },
        {
          id: '6',
          name: 'README.md',
          type: 'file',
          language: 'markdown',
          content: `# My React App

This is a React application built with Vibecode Clone.

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Features

- Modern React with TypeScript
- Hot reloading
- AI-assisted development
- Real-time collaboration

## Deployment

Click the deploy button to deploy to Vercel, Netlify, or other platforms.`
        }
      ]

      setWorkspace(mockWorkspace)
      setFiles(mockFiles)
      setSelectedFile(mockFiles[0].children![0]) // Select App.tsx by default
      setCode(mockFiles[0].children![0].content!)
      setTerminalOutput(['Welcome to Vibecode Clone Terminal', '$ '])
      setIsLoading(false)
    }

    loadWorkspace()
  }, [params.id])

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFile(file)
      setCode(file.content || '')
    }
  }

  const handleCodeChange = (value: string) => {
    setCode(value)
    if (selectedFile) {
      // Update file content
      const updateFileContent = (files: FileItem[]): FileItem[] => {
        return files.map(file => {
          if (file.id === selectedFile.id) {
            return { ...file, content: value }
          }
          if (file.children) {
            return { ...file, children: updateFileContent(file.children) }
          }
          return file
        })
      }
      setFiles(updateFileContent(files))
    }
  }

  const handleRunCommand = async () => {
    if (!command.trim()) return

    setIsRunning(true)
    const newOutput = [...terminalOutput, `$ ${command}`]
    setTerminalOutput(newOutput)
    setCommand('')

    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 1000))

    let response = ''
    switch (command.toLowerCase()) {
      case 'npm start':
        response = 'Starting development server...\nServer running on http://localhost:3000'
        break
      case 'npm install':
        response = 'Installing dependencies...\nDependencies installed successfully!'
        break
      case 'npm run build':
        response = 'Building for production...\nBuild completed successfully!'
        break
      case 'ls':
        response = 'src/  package.json  README.md  node_modules/'
        break
      case 'pwd':
        response = '/workspace/my-react-app'
        break
      case 'clear':
        setTerminalOutput(['$ '])
        setIsRunning(false)
        return
      default:
        response = `Command '${command}' not recognized. Try: npm start, npm install, npm run build, ls, pwd, clear`
    }

    setTerminalOutput(prev => [...prev, response, '$ '])
    setIsRunning(false)

    // Auto-scroll terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  const handleAIPrompt = async () => {
    if (!aiPrompt.trim()) return

    toast({
      title: 'AI Assistant',
      description: 'Processing your request...',
    })

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (aiPrompt.toLowerCase().includes('button')) {
      const newCode = code.replace(
        '<button onClick={() => alert(\'Hello World!\')}>',
        '<button onClick={() => alert(\'Hello World!\')} style={{ backgroundColor: \'#4CAF50\', color: \'white\', padding: \'12px 24px\', border: \'none\', borderRadius: \'8px\', fontSize: \'16px\', cursor: \'pointer\' }}>'
      )
      setCode(newCode)
      handleCodeChange(newCode)
      
      toast({
        title: 'AI Assistant',
        description: 'I\'ve styled your button with a modern green design!',
      })
    } else if (aiPrompt.toLowerCase().includes('component')) {
      const componentCode = `
const NewComponent = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px 0' }}>
      <h3>New Component</h3>
      <p>This component was generated by AI!</p>
    </div>
  );
};`
      
      const newCode = code.replace('export default App;', `${componentCode}\n\nexport default App;`)
      setCode(newCode)
      handleCodeChange(newCode)
      
      toast({
        title: 'AI Assistant',
        description: 'I\'ve created a new component for you!',
      })
    } else {
      toast({
        title: 'AI Assistant',
        description: 'I can help you with components, styling, and code improvements. Try asking me to "style the button" or "create a new component".',
      })
    }

    setAiPrompt('')
  }

  const renderFileTree = (fileList: FileItem[], depth = 0) => {
    return fileList.map(file => (
      <div key={file.id}>
        <div 
          className={`flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-sm cursor-pointer ${
            selectedFile?.id === file.id ? 'bg-primary text-primary-foreground' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleFileSelect(file)}
        >
          {file.type === 'folder' ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span className="text-sm">{file.name}</span>
        </div>
        {file.children && renderFileTree(file.children, depth + 1)}
      </div>
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              <h1 className="font-semibold">{workspace.name}</h1>
              <Badge variant="secondary">{workspace.aiAgent}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              {workspace.collaborators}
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <Globe className="w-4 h-4 mr-2" />
              Deploy
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 border-r bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Files</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">
                <Plus className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Upload className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            {renderFileTree(files)}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="border-b px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="font-medium">{selectedFile?.name || 'No file selected'}</span>
              {selectedFile?.language && (
                <Badge variant="outline" className="text-xs">
                  {selectedFile.language}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button variant="ghost" size="sm">
                <Play className="w-4 h-4 mr-1" />
                Run
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-full bg-background border rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Select a file to start editing..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="w-80 border-l bg-muted/30 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Assistant
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ask me to help with your code
            </p>
          </div>
          
          <div className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask AI to help with your code..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIPrompt()}
                />
                <Button size="sm" onClick={handleAIPrompt}>
                  <Zap className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="text-sm space-y-2">
                <p className="font-medium">Quick Actions:</p>
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs"
                    onClick={() => setAiPrompt('Style the button with modern CSS')}
                  >
                    Style the button
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs"
                    onClick={() => setAiPrompt('Create a new React component')}
                  >
                    Create component
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs"
                    onClick={() => setAiPrompt('Add TypeScript types')}
                  >
                    Add TypeScript types
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="h-64 border-t bg-black text-green-400 flex flex-col">
        <div className="px-4 py-2 bg-muted border-b flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className="font-medium text-foreground">Terminal</span>
        </div>
        
        <div 
          ref={terminalRef}
          className="flex-1 p-4 font-mono text-sm overflow-y-auto"
        >
          {terminalOutput.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
          {isRunning && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Running...</span>
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span>$</span>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRunCommand()}
              placeholder="Enter command..."
              className="bg-transparent border-none text-green-400 focus:ring-0"
              disabled={isRunning}
            />
          </div>
        </div>
      </div>
    </div>
  )
}