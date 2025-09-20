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
  rightPanel: 'collaboration' | 'snippets' | 'git' | 'plugins' | 'mcp' | 'voice' | 'workflow' | 'apikeys' | null
  setRightPanel: (panel: 'collaboration' | 'snippets' | 'git' | 'plugins' | 'mcp' | 'voice' | 'workflow' | 'apikeys' | null) => void
  className?: string
}

export default function Toolbar({ activePanel, setActivePanel, rightPanel, setRightPanel, className = '' }: ToolbarProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className={`flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 ${className}`}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActivePanel('terminal')}
            className={`p-2 rounded flex items-center space-x-2 ${
              activePanel === 'terminal' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Terminal"
          >
            <Terminal className="w-4 h-4" />
            <span className="text-sm">Terminal</span>
          </button>
          
          <button
            onClick={() => setActivePanel('chat')}
            className={`p-2 rounded flex items-center space-x-2 ${
              activePanel === 'chat' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="AI Chat"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">AI Chat</span>
          </button>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`p-2 rounded flex items-center space-x-2 ${
            isRunning 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
          title={isRunning ? 'Stop' : 'Run'}
        >
          {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="text-sm">{isRunning ? 'Stop' : 'Run'}</span>
        </button>
        
        <button
          className="p-2 rounded hover:bg-gray-700 text-gray-300"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <button
          className="p-2 rounded hover:bg-gray-700 text-gray-300"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Right Panel Toggle Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setRightPanel(rightPanel === 'collaboration' ? null : 'collaboration')}
            className={`p-2 rounded flex items-center space-x-1 ${
              rightPanel === 'collaboration' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Collaboration"
          >
            <Users className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'snippets' ? null : 'snippets')}
            className={`p-2 rounded flex items-center space-x-1 ${
              rightPanel === 'snippets' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Code Snippets"
          >
            <FileText className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'git' ? null : 'git')}
            className={`p-2 rounded flex items-center space-x-1 ${
              rightPanel === 'git' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Git Integration"
          >
            <GitBranch className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'plugins' ? null : 'plugins')}
            className={`p-2 rounded flex items-center space-x-1 ${
              rightPanel === 'plugins' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Plugins"
          >
            <Puzzle className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'mcp' ? null : 'mcp')}
            className={`p-2 rounded flex items-center space-x-1 ${
              rightPanel === 'mcp' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="MCP Servers"
          >
            <Server className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'voice' ? null : 'voice')}
            className={`p-2 rounded flex items-center space-x-1 ${
              rightPanel === 'voice' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Voice Assistant"
          >
            <Mic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'workflow' ? null : 'workflow')}
            className={`p-2 rounded flex items-center space-x-1 ${
              rightPanel === 'workflow' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Workflow Editor"
          >
            <Workflow className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setRightPanel(rightPanel === 'apikeys' ? null : 'apikeys')}
            className={`p-2 rounded flex items-center space-x-1 ${
              rightPanel === 'apikeys' 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="API Key Manager"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-600"></div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {isConnected ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded hover:bg-gray-700 text-gray-300"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          
          <button
            className="p-2 rounded hover:bg-gray-700 text-gray-300"
            title="Maximize"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}