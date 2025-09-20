'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Zap, 
  Eye, 
  Wrench, 
  DollarSign, 
  Server, 
  Globe, 
  Home,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

interface AIModel {
  name: string
  model: any
  supportsToolCall: boolean
}

interface AIProvider {
  provider: string
  models: AIModel[]
  hasAPIKey: boolean
}

interface AIModelSelectorProps {
  selectedModel: string
  selectedProvider: string
  onModelChange: (provider: string, model: string) => void
  className?: string
}

export default function AIModelSelector({ 
  selectedModel, 
  selectedProvider, 
  onModelChange, 
  className = '' 
}: AIModelSelectorProps) {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const response = await fetch('/api/ai/models')
      if (response.ok) {
        const data = await response.json()
        setProviders(data)
      }
    } catch (error) {
      console.error('Failed to load AI models:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return '🤖'
      case 'anthropic':
        return '🧠'
      case 'google':
        return '🔍'
      case 'xai':
        return '⚡'
      case 'groq':
        return '🚀'
      case 'mistral':
        return '🌪️'
      case 'ollama':
        return '🏠'
      case 'openrouter':
        return '🌐'
      default:
        return '🤖'
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
      case 'xai':
        return 'bg-orange-600'
      case 'groq':
        return 'bg-indigo-600'
      case 'mistral':
        return 'bg-cyan-600'
      case 'ollama':
        return 'bg-gray-600'
      case 'openrouter':
        return 'bg-pink-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getCategoryForProvider = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
      case 'anthropic':
      case 'google':
      case 'xai':
        return 'premium'
      case 'groq':
      case 'mistral':
        return 'fast'
      case 'ollama':
        return 'local'
      case 'openrouter':
        return 'aggregated'
      default:
        return 'other'
    }
  }

  const categories = {
    all: 'All Models',
    premium: 'Premium Models',
    fast: 'Fast Models',
    local: 'Local Models',
    aggregated: 'Aggregated Models'
  }

  const filteredProviders = providers.filter(provider => {
    const category = getCategoryForProvider(provider.provider)
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory
    const matchesSearch = provider.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.models.some(model => 
                           model.name.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Model Selector
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Choose from {providers.reduce((acc, p) => acc + p.models.length, 0)} AI models
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-700">
        <div className="space-y-3">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Models List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredProviders.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No models found</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredProviders.map(provider => (
              <div key={provider.provider} className="mb-4">
                {/* Provider Header */}
                <div className="flex items-center gap-2 mb-2 px-2">
                  <span className="text-lg">{getProviderIcon(provider.provider)}</span>
                  <h4 className="font-medium text-white capitalize">{provider.provider}</h4>
                  <div className="flex items-center gap-1">
                    {provider.hasAPIKey ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      provider.hasAPIKey ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {provider.hasAPIKey ? 'Configured' : 'Not Configured'}
                    </span>
                  </div>
                </div>

                {/* Models */}
                <div className="space-y-1">
                  {provider.models.map(model => (
                    <button
                      key={model.name}
                      onClick={() => onModelChange(provider.provider, model.name)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedProvider === provider.provider && selectedModel === model.name
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {provider.provider} • {model.supportsToolCall ? 'Tools' : 'No Tools'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {model.supportsToolCall && (
                            <Wrench className="w-3 h-3 text-green-400" title="Supports Tools" />
                          )}
                          <Info className="w-3 h-3 text-gray-400" title="Model Info" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-750">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-white">
              {providers.filter(p => p.hasAPIKey).length}
            </div>
            <div className="text-xs text-gray-400">Configured</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">
              {providers.reduce((acc, p) => acc + p.models.length, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Models</div>
          </div>
        </div>
      </div>
    </div>
  )
}