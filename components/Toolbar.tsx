'use client'

import { useState } from 'react'
import { 
  Terminal, 
  MessageSquare, 
  Code, 
  Play, 
  Square, 
  RotateCcw,
  Settings,
  Maximize2,
  Minimize2,
  Wifi,
  WifiOff,
  Users,
  FileText,
  GitBranch,
  Puzzle,
  Server,
  Mic,
  Workflow,
  Key,
  X
} from 'lucide-react'

interface ToolbarProps {
  activePanel: 'terminal' | 'editor' | 'chat'
  setActivePanel: (panel: 'terminal' | 'editor' | 'chat') => void
  rightPanel: 'collaboration' | 'snippets' | 'voice' | 'workflow' | 'apikeys' | null
  setRightPanel: (panel: 'collaboration' | 'snippets' | 'voice' | 'workflow' | 'apikeys' | null) => void
  className?: string
}

export default function Toolbar({ activePanel, setActivePanel, rightPanel, setRightPanel, className = '' }: ToolbarProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-card border-b border-border ${className}`}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActivePanel('terminal')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors ${
              activePanel === 'terminal' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Terminal"
          >
            <Terminal className="w-4 h-4" />
            <span>Terminal</span>
          </button>
          
          <button
            onClick={() => setActivePanel('chat')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors ${
              activePanel === 'chat' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="AI Chat"
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Chat</span>
          </button>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-3 py-1.5 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors ${
            isRunning 
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          title={isRunning ? 'Stop' : 'Run'}
        >
          {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Stop' : 'Run'}</span>
        </button>
        
        <button
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <button
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Right Panel Toggle Buttons */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setRightPanel(rightPanel === 'collaboration' ? null : 'collaboration')}
            className={`p-2 rounded-md transition-colors ${
              rightPanel === 'collaboration' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Collaboration"
          >
            <Users className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'snippets' ? null : 'snippets')}
            className={`p-2 rounded-md transition-colors ${
              rightPanel === 'snippets' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Code Snippets"
          >
            <FileText className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'voice' ? null : 'voice')}
            className={`p-2 rounded-md transition-colors ${
              rightPanel === 'voice' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Voice Assistant"
          >
            <Mic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'workflow' ? null : 'workflow')}
            className={`p-2 rounded-md transition-colors ${
              rightPanel === 'workflow' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Workflow Editor"
          >
            <Workflow className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'apikeys' ? null : 'apikeys')}
            className={`p-2 rounded-md transition-colors ${
              rightPanel === 'apikeys' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="API Key Manager"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-border"></div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {isConnected ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Maximize"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}