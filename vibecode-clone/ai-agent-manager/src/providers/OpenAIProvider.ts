import OpenAI from 'openai'
import { AIProvider, AgentRequest, AgentResponse, AgentCapability } from '../types/agent'
import { logger } from '../utils/logger'

export class OpenAIProvider implements AIProvider {
  private client: OpenAI | null = null
  private config: any

  constructor(config: any) {
    this.config = config
  }

  async initialize(): Promise<void> {
    if (!this.config.apiKey) {
      logger.warn('OpenAI API key not provided - provider will be disabled')
      return
    }

    try {
      this.client = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseURL,
        organization: this.config.organization,
      })

      // Test the connection
      await this.healthCheck()
      logger.info('OpenAI provider initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize OpenAI provider:', error)
      throw error
    }
  }

  async execute(request: AgentRequest): Promise<AgentResponse> {
    if (!this.client) {
      throw new Error('OpenAI provider not initialized')
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: request.model || this.config.defaultModel,
        messages: request.messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
          name: msg.name
        })),
        max_tokens: request.maxTokens || this.config.maxTokens,
        temperature: request.temperature ?? this.config.temperature,
        top_p: request.topP,
        frequency_penalty: request.frequencyPenalty,
        presence_penalty: request.presencePenalty,
        stop: request.stop,
        stream: false
      })

      const choice = completion.choices[0]
      if (!choice?.message?.content) {
        throw new Error('No response from OpenAI')
      }

      return {
        id: completion.id,
        content: choice.message.content,
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        } : undefined,
        model: completion.model,
        finishReason: choice.finish_reason as any,
        metadata: {
          provider: 'openai',
          created: completion.created
        }
      }
    } catch (error) {
      logger.error('OpenAI execution failed:', error)
      throw error
    }
  }

  async executeStreaming(
    request: AgentRequest,
    onChunk: (chunk: string) => void
  ): Promise<AgentResponse> {
    if (!this.client) {
      throw new Error('OpenAI provider not initialized')
    }

    try {
      const stream = await this.client.chat.completions.create({
        model: request.model || this.config.defaultModel,
        messages: request.messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
          name: msg.name
        })),
        max_tokens: request.maxTokens || this.config.maxTokens,
        temperature: request.temperature ?? this.config.temperature,
        stream: true
      })

      let fullContent = ''
      let totalTokens = 0
      let responseId = ''
      let model = ''

      for await (const chunk of stream) {
        const choice = chunk.choices[0]
        if (choice?.delta?.content) {
          const content = choice.delta.content
          fullContent += content
          onChunk(content)
        }

        if (chunk.id) responseId = chunk.id
        if (chunk.model) model = chunk.model
      }

      return {
        id: responseId,
        content: fullContent,
        usage: {
          promptTokens: 0, // Not available in streaming
          completionTokens: 0,
          totalTokens
        },
        model,
        finishReason: 'stop',
        metadata: {
          provider: 'openai',
          streaming: true
        }
      }
    } catch (error) {
      logger.error('OpenAI streaming execution failed:', error)
      throw error
    }
  }

  supportsStreaming(): boolean {
    return true
  }

  getAvailableModels(): string[] {
    return [
      'gpt-4-turbo-preview',
      'gpt-4',
      'gpt-4-32k',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ]
  }

  getCapabilities(): AgentCapability[] {
    return [
      'code-generation',
      'debugging',
      'refactoring',
      'documentation',
      'code-review',
      'completion',
      'explanation',
      'translation',
      'optimization'
    ]
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) {
      return false
    }

    try {
      // Simple test request
      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5
      })

      return completion.choices.length > 0
    } catch (error) {
      logger.error('OpenAI health check failed:', error)
      return false
    }
  }

  async shutdown(): Promise<void> {
    // OpenAI client doesn't need explicit cleanup
    this.client = null
    logger.info('OpenAI provider shut down')
  }
}