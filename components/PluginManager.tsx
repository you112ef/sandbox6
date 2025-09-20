'use client'

import { useState, useEffect } from 'react'
import { Plugin, PluginManifest, pluginManager } from '@/lib/plugins'
import { 
  Puzzle, 
  Download, 
  Upload, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  RefreshCw, 
  Plus, 
  Search,
  Code,
  Zap,
  Shield,
  AlertCircle
} from 'lucide-react'

interface PluginManagerProps {
  className?: string
}

export default function PluginManager({ className = '' }: PluginManagerProps) {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [availablePlugins, setAvailablePlugins] = useState<PluginManifest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [showInstallForm, setShowInstallForm] = useState(false)
  const [pluginCode, setPluginCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'installed' | 'available' | 'settings'>('installed')

  useEffect(() => {
    loadPlugins()
    loadAvailablePlugins()
  }, [])

  const loadPlugins = () => {
    const allPlugins = pluginManager.getAllPlugins()
    setPlugins(allPlugins)
  }

  const loadAvailablePlugins = async () => {
    try {
      const available = await pluginManager.discoverPlugins()
      setAvailablePlugins(available)
    } catch (error) {
      console.error('Failed to load available plugins:', error)
    }
  }

  const handleInstallPlugin = async () => {
    if (!pluginCode.trim()) return

    setLoading(true)
    try {
      // Parse plugin manifest from code
      const manifestMatch = pluginCode.match(/\/\*\*[\s\S]*?\*\//)
      if (!manifestMatch) {
        throw new Error('Plugin manifest not found')
      }

      const manifestText = manifestMatch[0]
      const manifest = JSON.parse(manifestText.replace(/\/\*\*|\*\//g, '').trim())

      const success = await pluginManager.loadPlugin(manifest, pluginCode)
      if (success) {
        loadPlugins()
        setShowInstallForm(false)
        setPluginCode('')
      } else {
        alert('Failed to install plugin')
      }
    } catch (error) {
      console.error('Failed to install plugin:', error)
      alert('Failed to install plugin: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleUninstallPlugin = async (pluginId: string) => {
    if (confirm('Are you sure you want to uninstall this plugin?')) {
      setLoading(true)
      try {
        const success = await pluginManager.unloadPlugin(pluginId)
        if (success) {
          loadPlugins()
          if (selectedPlugin?.manifest.id === pluginId) {
            setSelectedPlugin(null)
          }
        }
      } catch (error) {
        console.error('Failed to uninstall plugin:', error)
        alert('Failed to uninstall plugin')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleTogglePlugin = async (pluginId: string, enabled: boolean) => {
    setLoading(true)
    try {
      if (enabled) {
        await pluginManager.enablePlugin(pluginId)
      } else {
        await pluginManager.disablePlugin(pluginId)
      }
      loadPlugins()
    } catch (error) {
      console.error('Failed to toggle plugin:', error)
      alert('Failed to toggle plugin')
    } finally {
      setLoading(false)
    }
  }

  const filteredPlugins = plugins.filter(plugin =>
    plugin.manifest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.manifest.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAvailablePlugins = availablePlugins.filter(plugin =>
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Puzzle className="w-5 h-5" />
            Plugins
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstallForm(!showInstallForm)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Install plugin"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={loadPlugins}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search plugins..."
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'installed', label: 'Installed', icon: Puzzle },
            { id: 'available', label: 'Available', icon: Download },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Install Form */}
      {showInstallForm && (
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <h4 className="text-white font-medium mb-3">Install Plugin</h4>
          <div className="space-y-3">
            <textarea
              value={pluginCode}
              onChange={(e) => setPluginCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Paste plugin code here..."
              rows={8}
            />
            <div className="flex gap-2">
              <button
                onClick={handleInstallPlugin}
                disabled={!pluginCode.trim() || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Installing...' : 'Install Plugin'}
              </button>
              <button
                onClick={() => setShowInstallForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Installed Plugins Tab */}
      {activeTab === 'installed' && (
        <div className="flex-1 overflow-y-auto">
          {filteredPlugins.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <Puzzle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No plugins installed</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredPlugins.map(plugin => (
                <div
                  key={plugin.manifest.id}
                  className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                    selectedPlugin?.manifest.id === plugin.manifest.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedPlugin(plugin)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{plugin.manifest.name}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-600 rounded">
                          v{plugin.manifest.version}
                        </span>
                        {plugin.enabled ? (
                          <Play className="w-3 h-3 text-green-400" />
                        ) : (
                          <Pause className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs opacity-75 mt-1">{plugin.manifest.description}</p>
                      <p className="text-xs opacity-50 mt-1">by {plugin.manifest.author}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTogglePlugin(plugin.manifest.id, !plugin.enabled)
                        }}
                        className="p-1 hover:bg-gray-500 rounded"
                        title={plugin.enabled ? 'Disable' : 'Enable'}
                      >
                        {plugin.enabled ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUninstallPlugin(plugin.manifest.id)
                        }}
                        className="p-1 hover:bg-gray-500 rounded"
                        title="Uninstall"
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
      )}

      {/* Available Plugins Tab */}
      {activeTab === 'available' && (
        <div className="flex-1 overflow-y-auto">
          {filteredAvailablePlugins.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <Download className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No available plugins</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredAvailablePlugins.map(plugin => (
                <div key={plugin.id} className="p-3 mb-2 bg-gray-700 rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{plugin.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{plugin.description}</p>
                      <p className="text-xs text-gray-500 mt-1">by {plugin.author}</p>
                    </div>
                    <button
                      onClick={() => {
                        // Install from available plugins
                        setShowInstallForm(true)
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Install
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="p-4">
          <h4 className="text-white font-medium mb-3">Plugin Settings</h4>
          <div className="space-y-4">
            <div className="p-3 bg-gray-700 rounded-md">
              <h5 className="font-medium text-white mb-2">Auto-load Plugins</h5>
              <p className="text-sm text-gray-400 mb-2">
                Automatically load plugins on startup
              </p>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-300">Enable auto-loading</span>
              </label>
            </div>
            <div className="p-3 bg-gray-700 rounded-md">
              <h5 className="font-medium text-white mb-2">Plugin Permissions</h5>
              <p className="text-sm text-gray-400 mb-2">
                Control what plugins can access
              </p>
              <div className="space-y-2">
                {[
                  'File System Access',
                  'Network Requests',
                  'Terminal Commands',
                  'AI Integration',
                  'Git Operations'
                ].map(permission => (
                  <label key={permission} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-300">{permission}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Plugin Details */}
      {selectedPlugin && (
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">{selectedPlugin.manifest.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-gray-600 rounded">
                v{selectedPlugin.manifest.version}
              </span>
              {selectedPlugin.enabled ? (
                <span className="text-xs px-2 py-1 bg-green-600 rounded">Enabled</span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-600 rounded">Disabled</span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">{selectedPlugin.manifest.description}</p>
          
          {selectedPlugin.manifest.commands && selectedPlugin.manifest.commands.length > 0 && (
            <div className="mb-3">
              <h5 className="font-medium text-white mb-2">Commands</h5>
              <div className="space-y-1">
                {selectedPlugin.manifest.commands.map(command => (
                  <div key={command.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                    <div>
                      <span className="text-sm text-white">{command.name}</span>
                      <p className="text-xs text-gray-400">{command.description}</p>
                    </div>
                    {command.shortcut && (
                      <span className="text-xs text-gray-500 font-mono">{command.shortcut}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleTogglePlugin(selectedPlugin.manifest.id, !selectedPlugin.enabled)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              {selectedPlugin.enabled ? 'Disable' : 'Enable'}
            </button>
            <button
              onClick={() => handleUninstallPlugin(selectedPlugin.manifest.id)}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Uninstall
            </button>
          </div>
        </div>
      )}
    </div>
  )
}