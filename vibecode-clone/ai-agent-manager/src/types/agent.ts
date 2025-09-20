export interface AgentMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  name?: string
}

export interface AgentRequest {
  provider: string
  model?: string
  messages: AgentMessage[]
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  stream?: boolean
  capabilities?: AgentCapability[]
  timeout?: number
  retries?: number
  context?: {
    workspaceId?: string
    files?: string[]
    language?: string
  }
}

export interface AgentResponse {
  id: string
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  finishReason?: 'stop' | 'length' | 'content_filter' | 'tool_calls'
  metadata?: Record<string, any>
}

export type AgentCapability = 
  | 'code-generation'
  | 'debugging'
  | 'refactoring'
  | 'documentation'
  | 'code-review'
  | 'completion'
  | 'explanation'
  | 'translation'
  | 'optimization'
  | 'cli-commands'
  | 'system-admin'
  | 'devops'
  | 'scripting'

export interface AIProvider {
  initialize(): Promise<void>
  execute(request: AgentRequest): Promise<AgentResponse>
  executeStreaming?(request: AgentRequest, onChunk: (chunk: string) => void): Promise<AgentResponse>
  supportsStreaming(): boolean
  getAvailableModels(): string[]
  getCapabilities(): AgentCapability[]
  healthCheck(): Promise<boolean>
  shutdown?(): Promise<void>
}

export interface ExecutionQueueOptions {
  maxSize: number
  defaultTimeout: number
  retryAttempts: number
  retryDelay: number
}

export interface ExecutionJob {
  id: string
  execute: () => Promise<AgentResponse>
  timeout: number
  retries: number
  createdAt: Date
}

export interface MetricsData {
  provider: string
  model: string
  duration: number
  success: boolean
  tokens?: number
  error?: string
}