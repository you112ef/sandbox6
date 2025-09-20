'use client'

import { useState, useEffect } from 'react'
import { MCPServer, MCPTool, mcpManager } from '@/lib/mcp'
import { 
  Server, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  RefreshCw, 
  Settings, 
  Terminal,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface MCPDashboardProps {
  className?: string
}

export default function MCPDashboard({ className = '' }: MCPDashboardProps) {
  const [servers, setServers] = useState<MCPServer[]>([])
  const [tools, setTools] = useState<MCPTool[]>([])
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null)
  const [showAddServer, setShowAddServer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newServer, setNewServer] = useState({
    name: '',
    description: '',
    command: '',
    args: '',
    env: ''
  })

  useEffect(() => {
    loadServers()
    loadTools()
  }, [])

  const loadServers = () => {
    const allServers = mcpManager.getServers()
    setServers(allServers)
  }

  const loadTools = () => {
    const allTools = mcpManager.getAllTools()
    setTools(allTools)
  }

  const handleAddServer = async () => {
    if (!newServer.name || !newServer.command) return

    setLoading(true)
    try {
      const args = newServer.args.split(',').map(arg => arg.trim()).filter(arg => arg)
      const env = newServer.env ? JSON.parse(newServer.env) : {}

      await mcpManager.addServer({
        name: newServer.name,
        command: newServer.command,
        args,
        env,
        enabled: true,
        status: 'disconnected',
        tools: []
      })

      loadServers()
      loadTools()
      setShowAddServer(false)
      setNewServer({
        name: '',
        description: '',
        command: '',
        args: '',
        env: ''
      })
    } catch (error) {
      console.error('Failed to add server:', error)
      alert('Failed to add server')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveServer = async (serverId: string) => {
    if (confirm('Are you sure you want to remove this server?')) {
      setLoading(true)
      try {
        await mcpManager.removeServer(serverId)
        loadServers()
        loadTools()
        if (selectedServer?.id === serverId) {
          setSelectedServer(null)
        }
      } catch (error) {
        console.error('Failed to remove server:', error)
        alert('Failed to remove server')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleToggleServer = async (serverId: string, enabled: boolean) => {
    setLoading(true)
    try {
      if (enabled) {
        await mcpManager.enableServer(serverId)
      } else {
        await mcpManager.disableServer(serverId)
      }
      loadServers()
      loadTools()
    } catch (error) {
      console.error('Failed to toggle server:', error)
      alert('Failed to toggle server')
    } finally {
      setLoading(false)
    }
  }

  const handleReconnectServer = async (serverId: string) => {
    setLoading(true)
    try {
      await mcpManager.disconnectServer(serverId)
      await mcpManager.connectServer(serverId)
      loadServers()
      loadTools()
    } catch (error) {
      console.error('Failed to reconnect server:', error)
      alert('Failed to reconnect server')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400'
      case 'disconnected':
        return 'text-gray-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Server className="w-5 h-5" />
            MCP Servers
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddServer(!showAddServer)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Add server"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                mcpManager.reconnectAll()
                loadServers()
                loadTools()
              }}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Reconnect all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-gray-700 rounded">
            <div className="text-lg font-semibold text-white">{servers.length}</div>
            <div className="text-xs text-gray-400">Servers</div>
          </div>
          <div className="p-2 bg-gray-700 rounded">
            <div className="text-lg font-semibold text-white">{tools.length}</div>
            <div className="text-xs text-gray-400">Tools</div>
          </div>
          <div className="p-2 bg-gray-700 rounded">
            <div className="text-lg font-semibold text-white">
              {servers.filter(s => s.status === 'connected').length}
            </div>
            <div className="text-xs text-gray-400">Connected</div>
          </div>
        </div>
      </div>

      {/* Add Server Form */}
      {showAddServer && (
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <h4 className="text-white font-medium mb-3">Add MCP Server</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={newServer.name}
              onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Server name"
            />
            <input
              type="text"
              value={newServer.description}
              onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
            <input
              type="text"
              value={newServer.command}
              onChange={(e) => setNewServer({ ...newServer, command: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Command (e.g., npx, node)"
            />
            <input
              type="text"
              value={newServer.args}
              onChange={(e) => setNewServer({ ...newServer, args: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Arguments (comma separated)"
            />
            <textarea
              value={newServer.env}
              onChange={(e) => setNewServer({ ...newServer, env: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Environment variables (JSON)"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddServer}
                disabled={!newServer.name || !newServer.command || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Server'}
              </button>
              <button
                onClick={() => setShowAddServer(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Servers List */}
      <div className="flex-1 overflow-y-auto">
        {servers.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No MCP servers configured</p>
          </div>
        ) : (
          <div className="p-2">
            {servers.map(server => (
              <div
                key={server.id}
                className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                  selectedServer?.id === server.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedServer(server)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{server.name}</h4>
                      {getStatusIcon(server.status)}
                      <span className={`text-xs ${getStatusColor(server.status)}`}>
                        {server.status}
                      </span>
                    </div>
                    <p className="text-xs opacity-75 mt-1">{server.name}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {server.tools.length} tools • {server.command} {server.args.join(' ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleServer(server.id, !server.enabled)
                      }}
                      className="p-1 hover:bg-gray-500 rounded"
                      title={server.enabled ? 'Disable' : 'Enable'}
                    >
                      {server.enabled ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReconnectServer(server.id)
                      }}
                      className="p-1 hover:bg-gray-500 rounded"
                      title="Reconnect"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveServer(server.id)
                      }}
                      className="p-1 hover:bg-gray-500 rounded"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Server Details */}
      {selectedServer && (
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">{selectedServer.name}</h4>
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedServer.status)}
              <span className={`text-xs ${getStatusColor(selectedServer.status)}`}>
                {selectedServer.status}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">{selectedServer.name}</p>
          
          {selectedServer.tools.length > 0 && (
            <div className="mb-3">
              <h5 className="font-medium text-white mb-2">Available Tools</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedServer.tools.map(tool => (
                  <div key={tool.name} className="p-2 bg-gray-800 rounded text-sm">
                    <div className="font-medium text-white">{tool.name}</div>
                    <div className="text-xs text-gray-400">{tool.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleToggleServer(selectedServer.id, !selectedServer.enabled)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              {selectedServer.enabled ? 'Disable' : 'Enable'}
            </button>
            <button
              onClick={() => handleReconnectServer(selectedServer.id)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Reconnect
            </button>
            <button
              onClick={() => handleRemoveServer(selectedServer.id)}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}