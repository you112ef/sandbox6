import { logger } from '../utils/logger'
import { config } from '../config'
import { OpenAIProvider } from '../providers/OpenAIProvider'
import { AnthropicProvider } from '../providers/AnthropicProvider'
import { GoogleAIProvider } from '../providers/GoogleAIProvider'
import { CustomProvider } from '../providers/CustomProvider'
import { AIProvider, AgentRequest, AgentResponse, AgentCapability } from '../types/agent'
import { ExecutionQueue } from '../utils/ExecutionQueue'
import { MetricsCollector } from '../utils/MetricsCollector'

export class AgentOrchestrator {
  private providers: Map<string, AIProvider> = new Map()
  private executionQueue: ExecutionQueue
  private metricsCollector: MetricsCollector
  private initialized = false

  constructor() {
    this.executionQueue = new ExecutionQueue({
      maxSize: config.execution.maxQueueSize,
      defaultTimeout: config.execution.defaultTimeout,
      retryAttempts: config.execution.retryAttempts,
      retryDelay: config.execution.retryDelay,
    })
    this.metricsCollector = new MetricsCollector()
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    logger.info('Initializing AI Agent Orchestrator...')

    // Initialize providers
    await this.initializeProviders()

    // Start execution queue
    await this.executionQueue.start()

    // Start metrics collection
    this.metricsCollector.start()

    this.initialized = true
    logger.info('AI Agent Orchestrator initialized successfully')
  }

  private async initializeProviders(): Promise<void> {
    const providers = [
      {
        name: 'openai',
        provider: new OpenAIProvider(config.ai.openai),
        enabled: !!config.ai.openai.apiKey,
      },
      {
        name: 'anthropic',
        provider: new AnthropicProvider(config.ai.anthropic),
        enabled: !!config.ai.anthropic.apiKey,
      },
      {
        name: 'google',
        provider: new GoogleAIProvider(config.ai.google),
        enabled: !!config.ai.google.apiKey,
      },
    ]

    for (const { name, provider, enabled } of providers) {
      if (enabled) {
        try {
          await provider.initialize()
          this.providers.set(name, provider)
          logger.info(`Initialized ${name} provider`)
        } catch (error) {
          logger.error(`Failed to initialize ${name} provider:`, error)
        }
      } else {
        logger.warn(`${name} provider disabled - missing API key`)
      }
    }

    logger.info(`Initialized ${this.providers.size} AI providers`)
  }

  async executeRequest(request: AgentRequest): Promise<AgentResponse> {
    if (!this.initialized) {
      throw new Error('Agent orchestrator not initialized')
    }

    const startTime = Date.now()
    
    try {
      // Validate request
      this.validateRequest(request)

      // Get appropriate provider
      const provider = this.getProvider(request.provider)
      if (!provider) {
        throw new Error(`Provider '${request.provider}' not available`)
      }

      // Check if provider supports required capabilities
      if (request.capabilities) {
        const unsupported = request.capabilities.filter(
          cap => !provider.getCapabilities().includes(cap)
        )
        if (unsupported.length > 0) {
          throw new Error(`Provider '${request.provider}' does not support capabilities: ${unsupported.join(', ')}`)
        }
      }

      // Add to execution queue
      const response = await this.executionQueue.add(
        `${request.provider}-${Date.now()}`,
        async () => {
          return await provider.execute(request)
        },
        {
          timeout: request.timeout || config.execution.defaultTimeout,
          retries: request.retries || config.execution.retryAttempts,
        }
      )

      // Collect metrics
      const duration = Date.now() - startTime
      this.metricsCollector.recordExecution({
        provider: request.provider,
        model: request.model || 'default',
        duration,
        success: true,
        tokens: response.usage?.totalTokens || 0,
      })

      return response

    } catch (error) {
      const duration = Date.now() - startTime
      this.metricsCollector.recordExecution({
        provider: request.provider,
        model: request.model || 'default',
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      logger.error('Agent execution failed:', error)
      throw error
    }
  }

  async executeStreamingRequest(
    request: AgentRequest,
    onChunk: (chunk: string) => void
  ): Promise<AgentResponse> {
    if (!this.initialized) {
      throw new Error('Agent orchestrator not initialized')
    }

    const provider = this.getProvider(request.provider)
    if (!provider) {
      throw new Error(`Provider '${request.provider}' not available`)
    }

    if (!provider.supportsStreaming()) {
      throw new Error(`Provider '${request.provider}' does not support streaming`)
    }

    return await provider.executeStreaming(request, onChunk)
  }

  private validateRequest(request: AgentRequest): void {
    if (!request.provider) {
      throw new Error('Provider is required')
    }

    if (!request.messages || request.messages.length === 0) {
      throw new Error('Messages are required')
    }

    if (request.maxTokens && request.maxTokens > 32000) {
      throw new Error('Max tokens cannot exceed 32000')
    }

    if (request.temperature && (request.temperature < 0 || request.temperature > 2)) {
      throw new Error('Temperature must be between 0 and 2')
    }
  }

  private getProvider(providerName: string): AIProvider | undefined {
    return this.providers.get(providerName)
  }

  async getAvailableProviders(): Promise<Array<{
    name: string
    models: string[]
    capabilities: AgentCapability[]
    status: 'active' | 'inactive' | 'error'
  }>> {
    const result = []

    for (const [name, provider] of this.providers) {
      try {
        const isHealthy = await provider.healthCheck()
        result.push({
          name,
          models: provider.getAvailableModels(),
          capabilities: provider.getCapabilities(),
          status: isHealthy ? 'active' : 'error',
        })
      } catch (error) {
        result.push({
          name,
          models: [],
          capabilities: [],
          status: 'error',
        })
      }
    }

    return result
  }

  async addCustomProvider(name: string, config: any): Promise<void> {
    try {
      const provider = new CustomProvider(name, config)
      await provider.initialize()
      this.providers.set(name, provider)
      logger.info(`Added custom provider: ${name}`)
    } catch (error) {
      logger.error(`Failed to add custom provider ${name}:`, error)
      throw error
    }
  }

  async removeProvider(name: string): Promise<void> {
    if (this.providers.has(name)) {
      const provider = this.providers.get(name)
      if (provider) {
        await provider.shutdown?.()
      }
      this.providers.delete(name)
      logger.info(`Removed provider: ${name}`)
    }
  }

  async getMetrics(): Promise<any> {
    return this.metricsCollector.getMetrics()
  }

  async healthCheck(): Promise<string> {
    if (!this.initialized) {
      return 'not_initialized'
    }

    const providerHealths = await Promise.allSettled(
      Array.from(this.providers.values()).map(p => p.healthCheck())
    )

    const healthyProviders = providerHealths.filter(
      result => result.status === 'fulfilled' && result.value
    ).length

    if (healthyProviders === 0) {
      return 'no_healthy_providers'
    }

    if (healthyProviders === this.providers.size) {
      return 'healthy'
    }

    return 'partially_healthy'
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down AI Agent Orchestrator...')

    // Stop execution queue
    await this.executionQueue.stop()

    // Stop metrics collection
    this.metricsCollector.stop()

    // Shutdown all providers
    await Promise.allSettled(
      Array.from(this.providers.values()).map(provider => provider.shutdown?.())
    )

    this.providers.clear()
    this.initialized = false

    logger.info('AI Agent Orchestrator shutdown complete')
  }
}