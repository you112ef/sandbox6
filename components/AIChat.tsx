'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  Trash2, 
  Settings, 
  Sparkles,
  Code,
  Terminal,
  FileText,
  Zap,
  Brain,
  ChevronDown
} from 'lucide-react'
import AIModelSelector from './AIModelSelector'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'code' | 'terminal' | 'text'
}

interface AIChatProps {
  className?: string
}

export default function AIChat({ className = '' }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you with:\n\n• Writing and debugging code\n• Explaining complex concepts\n• Generating boilerplate code\n• Optimizing performance\n• Code reviews and suggestions\n\nWhat would you like to work on today?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const [showSettings, setShowSettings] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          model: selectedModel,
          provider: selectedProvider,
          temperature: 0.7,
          maxTokens: 4000
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        type: 'code'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Chat cleared. How can I help you today?',
      timestamp: new Date(),
      type: 'text'
    }])
  }

  const formatMessage = (content: string) => {
    const codeBlocks = content.split(/```(\w+)?\n([\s\S]*?)```/g)
    
    return codeBlocks.map((part, index) => {
      if (index % 3 === 2) {
        const language = codeBlocks[index - 1] || 'text'
        return (
          <pre key={index} className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className={`language-${language}`}>{part}</code>
          </pre>
        )
      }
      return part
    })
  }

  return (
    <div className={`ai-chat h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI Assistant</h3>
            <p className="text-xs text-gray-400">Powered by {selectedProvider} • {selectedModel}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm hover:bg-gray-600 transition-colors"
          >
            <Brain className="w-4 h-4" />
            <span className="capitalize">{selectedProvider}</span>
            <span className="text-gray-400">•</span>
            <span>{selectedModel}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-700 rounded text-red-400"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <h4 className="text-sm font-semibold mb-3">AI Model Settings</h4>
          <div className="space-y-2">
            {models.map(model => (
              <label key={model.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="model"
                  value={model.id}
                  checked={selectedModel === model.id}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm">{model.name}</span>
                <span className="text-xs text-gray-400">({model.provider})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Model Selector */}
      {showModelSelector && (
        <div className="border-b border-gray-700">
          <AIModelSelector
            selectedModel={selectedModel}
            selectedProvider={selectedProvider}
            onModelChange={(provider, model) => {
              setSelectedProvider(provider)
              setSelectedModel(model)
              setShowModelSelector(false)
            }}
            className="max-h-96"
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.role === 'user' ? 'user' : 'assistant'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {message.role === 'user' ? (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {formatMessage(message.content)}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="chat-message assistant">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-sm text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about coding..."
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:text-gray-300">
              <Code className="w-3 h-3" />
              <span>Code</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-300">
              <Terminal className="w-3 h-3" />
              <span>Terminal</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-300">
              <Zap className="w-3 h-3" />
              <span>Optimize</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}