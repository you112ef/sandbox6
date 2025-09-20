'use client'

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
  WifiOff
} from 'lucide-react'

interface ToolbarProps {
  activePanel: 'terminal' | 'editor' | 'chat'
  setActivePanel: (panel: 'terminal' | 'editor' | 'chat') => void
  className?: string
}

export default function Toolbar({ activePanel, setActivePanel, className = '' }: ToolbarProps) {
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