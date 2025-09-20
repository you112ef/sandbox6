import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.AGENT_PORT || '8001'),
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  cors: {
    origins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
  },
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
      organization: process.env.OPENAI_ORGANIZATION,
      defaultModel: 'gpt-4-turbo-preview',
      maxTokens: 4096,
      temperature: 0.1,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: process.env.ANTHROPIC_BASE_URL,
      defaultModel: 'claude-3-sonnet-20240229',
      maxTokens: 4096,
      temperature: 0.1,
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY,
      projectId: process.env.GOOGLE_PROJECT_ID,
      location: process.env.GOOGLE_LOCATION || 'us-central1',
      defaultModel: 'gemini-pro',
      maxTokens: 2048,
      temperature: 0.1,
    },
  },
  sandbox: {
    dockerRegistry: process.env.DOCKER_REGISTRY || 'vibecode',
    timeout: parseInt(process.env.SANDBOX_TIMEOUT || '30000'),
    memoryLimit: process.env.SANDBOX_MEMORY_LIMIT || '512m',
    cpuLimit: process.env.SANDBOX_CPU_LIMIT || '0.5',
    networkMode: process.env.SANDBOX_NETWORK_MODE || 'none',
    maxConcurrentContainers: parseInt(process.env.MAX_CONCURRENT_CONTAINERS || '10'),
  },
  execution: {
    maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE || '100'),
    defaultTimeout: parseInt(process.env.DEFAULT_EXECUTION_TIMEOUT || '60000'),
    retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY || '1000'),
  },
} as const

// Validate required environment variables for AI providers
const validateAIConfig = () => {
  const warnings: string[] = []
  
  if (!config.ai.openai.apiKey) {
    warnings.push('OPENAI_API_KEY not set - OpenAI agents will be disabled')
  }
  
  if (!config.ai.anthropic.apiKey) {
    warnings.push('ANTHROPIC_API_KEY not set - Anthropic agents will be disabled')
  }
  
  if (!config.ai.google.apiKey) {
    warnings.push('GOOGLE_AI_API_KEY not set - Google AI agents will be disabled')
  }
  
  if (warnings.length > 0) {
    console.warn('AI Configuration Warnings:')
    warnings.forEach(warning => console.warn(`  - ${warning}`))
  }
}

validateAIConfig()

export default config