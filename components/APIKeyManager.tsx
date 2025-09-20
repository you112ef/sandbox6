'use client'

import { useState, useEffect } from 'react'
import { Key, Plus, Eye, EyeOff, Trash2, Save, AlertCircle, CheckCircle, Settings } from 'lucide-react'

interface APIKey {
  id: string
  provider: string
  keyName: string
  isActive: boolean
  createdAt: string
}

interface APIKeyManagerProps {
  className?: string
}

export default function APIKeyManager({ className = '' }: APIKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newKey, setNewKey] = useState({
    provider: '',
    keyName: '',
    keyValue: ''
  })
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAPIKeys()
  }, [])

  const loadAPIKeys = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/keys')
      if (response.ok) {
        const keys = await response.json()
        setApiKeys(keys)
      }
    } catch (error) {
      console.error('Failed to load API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddKey = async () => {
    if (!newKey.provider || !newKey.keyName || !newKey.keyValue) return

    setSaving(true)
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKey)
      })

      if (response.ok) {
        await loadAPIKeys()
        setShowAddForm(false)
        setNewKey({ provider: '', keyName: '', keyValue: '' })
      } else {
        alert('Failed to add API key')
      }
    } catch (error) {
      console.error('Failed to add API key:', error)
      alert('Failed to add API key')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleKey = async (keyId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        await loadAPIKeys()
      }
    } catch (error) {
      console.error('Failed to toggle API key:', error)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        const response = await fetch(`/api/keys/${keyId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadAPIKeys()
        }
      } catch (error) {
        console.error('Failed to delete API key:', error)
      }
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return '🤖'
      case 'anthropic':
        return '🧠'
      case 'google':
        return '🔍'
      case 'azure':
        return '☁️'
      case 'cohere':
        return '💬'
      default:
        return '🔑'
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return 'bg-green-600'
      case 'anthropic':
        return 'bg-purple-600'
      case 'google':
        return 'bg-blue-600'
      case 'azure':
        return 'bg-blue-500'
      case 'cohere':
        return 'bg-orange-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Key Manager
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Add API key"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-gray-700 rounded">
            <div className="text-lg font-semibold text-white">{apiKeys.length}</div>
            <div className="text-xs text-gray-400">Total Keys</div>
          </div>
          <div className="p-2 bg-gray-700 rounded">
            <div className="text-lg font-semibold text-white">
              {apiKeys.filter(k => k.isActive).length}
            </div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="p-2 bg-gray-700 rounded">
            <div className="text-lg font-semibold text-white">
              {new Set(apiKeys.map(k => k.provider)).size}
            </div>
            <div className="text-xs text-gray-400">Providers</div>
          </div>
        </div>
      </div>

      {/* Add Key Form */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <h4 className="text-white font-medium mb-3">Add New API Key</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Provider
              </label>
              <select
                value={newKey.provider}
                onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select provider</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="azure">Azure OpenAI</option>
                <option value="cohere">Cohere</option>
                <option value="huggingface">Hugging Face</option>
                <option value="replicate">Replicate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Key Name
              </label>
              <input
                type="text"
                value={newKey.keyName}
                onChange={(e) => setNewKey({ ...newKey, keyName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My OpenAI Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={newKey.keyValue}
                onChange={(e) => setNewKey({ ...newKey, keyValue: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sk-..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddKey}
                disabled={!newKey.provider || !newKey.keyName || !newKey.keyValue || saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Adding...' : 'Add Key'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading API keys...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No API keys configured</p>
            <p className="text-sm">Add your first API key to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {apiKeys.map(key => (
              <div key={key.id} className="p-3 mb-2 bg-gray-700 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getProviderIcon(key.provider)}</span>
                      <h4 className="font-medium text-white">{key.keyName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        key.isActive 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {key.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 capitalize">{key.provider}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Added {new Date(key.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => toggleKeyVisibility(key.id)}
                      className="p-1 hover:bg-gray-500 rounded"
                      title="Toggle visibility"
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleKey(key.id, !key.isActive)}
                      className="p-1 hover:bg-gray-500 rounded"
                      title={key.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {key.isActive ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <CheckCircle className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-1 hover:bg-gray-500 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                {visibleKeys.has(key.id) && (
                  <div className="mt-2 p-2 bg-gray-800 rounded">
                    <p className="text-xs text-gray-400 mb-1">API Key:</p>
                    <code className="text-xs text-green-400 font-mono break-all">
                      {key.provider === 'openai' ? 'sk-...' : 
                       key.provider === 'anthropic' ? 'sk-ant-...' :
                       key.provider === 'google' ? 'AIza...' : '***...'}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Provider Status */}
      <div className="p-4 border-t border-gray-700 bg-gray-750">
        <h4 className="text-white font-medium mb-3">Provider Status</h4>
        <div className="space-y-2">
          {['openai', 'anthropic', 'google', 'azure', 'cohere'].map(provider => {
            const hasKey = apiKeys.some(k => k.provider === provider && k.isActive)
            return (
              <div key={provider} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getProviderIcon(provider)}</span>
                  <span className="text-sm text-white capitalize">{provider}</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasKey ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    hasKey ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {hasKey ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}