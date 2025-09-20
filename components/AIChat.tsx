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
  Zap
} from 'lucide-react'

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
  const [selectedModel, setSelectedModel] = useState('claude-3-sonnet')
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const models = [
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' }
  ]

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
    setInput('')
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input.trim()),
        timestamp: new Date(),
        type: 'code'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('react') || lowerInput.includes('component')) {
      return `Here's a React component example:

\`\`\`tsx
import React, { useState } from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary' 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onClick()
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={\`px-4 py-2 rounded font-medium transition-colors \${
        variant === 'primary' 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }\`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}

export default Button
\`\`\`

This component includes:
- TypeScript interfaces for type safety
- Loading state management
- Variant styling with Tailwind CSS
- Proper event handling

Would you like me to explain any part of this code?`
    }
    
    if (lowerInput.includes('api') || lowerInput.includes('fetch')) {
      return `Here's how to create a robust API client:

\`\`\`typescript
// lib/api.ts
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

class ApiClient {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }
  
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`)
      }
      
      const data = await response.json()
      return { data, success: true }
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }
  
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || '')
\`\`\`

This API client provides:
- Type-safe responses
- Error handling
- Reusable HTTP methods
- Environment-based configuration

Would you like me to show you how to use it?`
    }
    
    if (lowerInput.includes('debug') || lowerInput.includes('error')) {
      return `Here are some debugging strategies:

\`\`\`typescript
// Debugging utilities
const debug = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(\`🐛 [DEBUG] \${message}\`, data)
    }
  },
  
  error: (error: Error, context?: string) => {
    console.error(\`❌ [ERROR]\${context ? \` in \${context}\` : ''}:\`, error)
    // Send to error tracking service
  },
  
  performance: (label: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(\`⏱️ [PERF] \${label}: \${end - start}ms\`)
  }
}

// React error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    debug.error(error, 'ErrorBoundary')
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>
    }
    return this.props.children
  }
}
\`\`\`

These tools help with:
- Development-only logging
- Error tracking and reporting
- Performance monitoring
- Graceful error handling

Need help with a specific error?`
    }
    
    return `I understand you're asking about "${userInput}". Here's how I can help:

\`\`\`typescript
// Example code structure
interface Example {
  question: string
  solution: string
  explanation: string
}

const handleQuestion = (input: string): Example => {
  return {
    question: input,
    solution: "I'll provide a tailored solution",
    explanation: "With detailed explanations and best practices"
  }
}
\`\`\`

I can help you with:
- **Code Generation**: Write functions, components, or entire applications
- **Debugging**: Identify and fix issues in your code
- **Optimization**: Improve performance and efficiency
- **Best Practices**: Follow industry standards and patterns
- **Learning**: Explain concepts and provide examples

What specific coding challenge are you working on?`
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
            <p className="text-xs text-gray-400">Powered by {models.find(m => m.id === selectedModel)?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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