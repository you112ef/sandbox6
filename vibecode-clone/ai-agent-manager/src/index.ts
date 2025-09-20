import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import Redis from 'redis'
import { logger } from './utils/logger'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { AgentOrchestrator } from './orchestrator/AgentOrchestrator'
import { SandboxManager } from './sandbox/SandboxManager'

// Routes
import agentRoutes from './routes/agents'
import executionRoutes from './routes/execution'
import sandboxRoutes from './routes/sandbox'

// Initialize Redis
export const redis = Redis.createClient({
  url: config.redis.url,
})

// Initialize services
export const agentOrchestrator = new AgentOrchestrator()
export const sandboxManager = new SandboxManager()

async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.app.logLevel,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  })

  // Register plugins
  await app.register(cors, {
    origin: config.cors.origins,
    credentials: true,
  })

  await app.register(helmet)

  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  })

  // Error handler
  app.setErrorHandler(errorHandler)

  // Health check
  app.get('/health', async (request, reply) => {
    try {
      await redis.ping()
      const sandboxHealth = await sandboxManager.healthCheck()
      const agentHealth = await agentOrchestrator.healthCheck()
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          redis: 'connected',
          sandbox: sandboxHealth,
          agents: agentHealth,
        },
      }
    } catch (error) {
      reply.code(503)
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // API routes
  await app.register(agentRoutes, { prefix: '/api/agents' })
  await app.register(executionRoutes, { prefix: '/api/execution' })
  await app.register(sandboxRoutes, { prefix: '/api/sandbox' })

  return app
}

async function start() {
  try {
    // Connect to Redis
    await redis.connect()
    logger.info('Connected to Redis')

    // Initialize services
    await agentOrchestrator.initialize()
    await sandboxManager.initialize()

    // Build and start the app
    const app = await buildApp()
    
    const address = await app.listen({
      port: config.app.port,
      host: '0.0.0.0',
    })

    logger.info(`AI Agent Manager listening at ${address}`)

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully')
      await app.close()
      await redis.disconnect()
      await sandboxManager.shutdown()
      process.exit(0)
    })

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully')
      await app.close()
      await redis.disconnect()
      await sandboxManager.shutdown()
      process.exit(0)
    })

  } catch (error) {
    logger.error('Error starting AI Agent Manager:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  start()
}

export { buildApp }