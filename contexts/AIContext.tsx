'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
}

interface AIConfig {
  selectedModel: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  enableCodeExecution: boolean
  enableWebSearch: boolean
}

interface AIContextType {
  models: AIModel[]
  config: AIConfig
  isConnected: boolean
  isLoading: boolean
  setSelectedModel: (modelId: string) => void
  updateConfig: (config: Partial<AIConfig>) => void
  sendMessage: (message: string) => Promise<string>
  executeCode: (code: string, language: string) => Promise<string>
  searchWeb: (query: string) => Promise<string>
  clearHistory: () => void
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: ReactNode }) {
  const [models] = useState<AIModel[]>([
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Advanced reasoning and code generation',
      capabilities: ['code-generation', 'debugging', 'explanation', 'optimization']
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Most capable GPT model',
      capabilities: ['code-generation', 'debugging', 'explanation', 'optimization', 'web-search']
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Multimodal AI model',
      capabilities: ['code-generation', 'debugging', 'explanation', 'optimization', 'image-analysis']
    }
  ])

  const [config, setConfig] = useState<AIConfig>({
    selectedModel: 'claude-3-sonnet',
    temperature: 0.7,
    maxTokens: 4000,
    systemPrompt: 'You are a helpful AI coding assistant. Help users write, debug, and optimize code.',
    enableCodeExecution: true,
    enableWebSearch: true
  })

  const [isConnected, setIsConnected] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const setSelectedModel = (modelId: string) => {
    setConfig(prev => ({ ...prev, selectedModel: modelId }))
  }

  const updateConfig = (newConfig: Partial<AIConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  const sendMessage = async (message: string): Promise<string> => {
    setIsLoading(true)
    
    try {
      // Simulate AI response based on selected model
      const selectedModel = models.find(m => m.id === config.selectedModel)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      // Generate response based on message content
      const response = generateAIResponse(message, selectedModel?.name || 'Claude')
      
      return response
    } catch (error) {
      console.error('Error sending message:', error)
      return 'Sorry, I encountered an error. Please try again.'
    } finally {
      setIsLoading(false)
    }
  }

  const executeCode = async (code: string, language: string): Promise<string> => {
    setIsLoading(true)
    
    try {
      // Simulate code execution in Vercel Sandbox
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate execution result
      const result = `Code executed successfully in ${language}:
      
Output:
${code.includes('console.log') ? 'Hello, World!' : 'Code executed without output'}

Execution time: ${Math.random() * 100}ms
Memory usage: ${Math.random() * 10}MB`
      
      return result
    } catch (error) {
      console.error('Error executing code:', error)
      return `Error executing code: ${error}`
    } finally {
      setIsLoading(false)
    }
  }

  const searchWeb = async (query: string): Promise<string> => {
    setIsLoading(true)
    
    try {
      // Simulate web search
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const results = `Web search results for "${query}":

1. Official Documentation
   - Comprehensive guide with examples
   - Latest updates and best practices

2. Stack Overflow
   - Community answers and solutions
   - Code examples and explanations

3. GitHub Repositories
   - Open source implementations
   - Real-world usage examples

4. Tutorials and Guides
   - Step-by-step instructions
   - Video tutorials and articles`
      
      return results
    } catch (error) {
      console.error('Error searching web:', error)
      return `Error searching web: ${error}`
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    // Clear conversation history
    console.log('AI history cleared')
  }

  const generateAIResponse = (message: string, modelName: string): string => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm your AI coding assistant powered by ${modelName}. I can help you with:
      
• Writing and debugging code
• Explaining complex concepts  
• Code optimization and refactoring
• Best practices and patterns
• Architecture decisions

What would you like to work on today?`
    }
    
    if (lowerMessage.includes('react') || lowerMessage.includes('component')) {
      return `Here's a modern React component example:

\`\`\`tsx
import React, { useState, useEffect } from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary',
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = async () => {
    if (disabled || isLoading) return
    
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
      disabled={disabled || isLoading}
      className={\`px-4 py-2 rounded font-medium transition-all duration-200 \${
        variant === 'primary' 
          ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100'
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
- Proper accessibility considerations
- Error handling

Would you like me to explain any part of this code or help you implement something specific?`
    }
    
    if (lowerMessage.includes('api') || lowerMessage.includes('fetch')) {
      return `Here's a robust API client implementation:

\`\`\`typescript
// lib/api.ts
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

interface ApiError {
  message: string
  status: number
  code?: string
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
      })
      
      if (!response.ok) {
        throw new ApiError(
          \`HTTP error! status: \${response.status}\`,
          response.status
        )
      }
      
      const data = await response.json()
      return { data, success: true }
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          data: null as T,
          success: false,
          message: error.message,
          errors: [error.code || 'UNKNOWN_ERROR']
        }
      }
      
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
  
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
)
\`\`\`

This API client provides:
- Type-safe responses with generics
- Comprehensive error handling
- HTTP method abstractions
- Environment-based configuration
- Extensible header management

Would you like me to show you how to use it or add authentication?`
    }
    
    return `I understand you're asking about "${message}". Here's how I can help:

\`\`\`typescript
// Example of how I can assist
interface CodingHelp {
  problem: string
  solution: string
  explanation: string
  bestPractices: string[]
}

const provideHelp = (question: string): CodingHelp => {
  return {
    problem: question,
    solution: "I'll provide a tailored solution",
    explanation: "With detailed explanations and context",
    bestPractices: [
      "Follow industry standards",
      "Write maintainable code",
      "Consider performance implications",
      "Include proper error handling"
    ]
  }
}
\`\`\`

I can help you with:
- **Code Generation**: Write functions, components, or entire applications
- **Debugging**: Identify and fix issues in your code
- **Optimization**: Improve performance and efficiency
- **Best Practices**: Follow industry standards and patterns
- **Learning**: Explain concepts and provide examples
- **Architecture**: Design patterns and system design

What specific coding challenge are you working on?`
  }

  const value: AIContextType = {
    models,
    config,
    isConnected,
    isLoading,
    setSelectedModel,
    updateConfig,
    sendMessage,
    executeCode,
    searchWeb,
    clearHistory
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}