import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import websocket from '@fastify/websocket'
import { PrismaClient } from '@prisma/client'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Redis from 'redis'
import { logger } from './utils/logger'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import { rateLimitConfig } from './middleware/rateLimit'

// Routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import workspaceRoutes from './routes/workspaces'
import fileRoutes from './routes/files'
import deploymentRoutes from './routes/deployments'
import collaborationRoutes from './routes/collaboration'
import templateRoutes from './routes/templates'
import monitoringRoutes from './routes/monitoring'
import webhookRoutes from './routes/webhooks'

// Services
import { SandboxService } from './services/SandboxService'
import { CollaborationService } from './services/CollaborationService'
import { DeploymentService } from './services/DeploymentService'
import { MonitoringService } from './services/MonitoringService'

// Initialize Prisma
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Initialize Redis
export const redis = Redis.createClient({
  url: config.redis.url,
})

// Initialize Services
export const sandboxService = new SandboxService()
export const collaborationService = new CollaborationService()
export const deploymentService = new DeploymentService()
export const monitoringService = new MonitoringService()

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

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'wss:', 'ws:'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
  })

  await app.register(rateLimit, rateLimitConfig)

  await app.register(jwt, {
    secret: config.auth.jwtSecret,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  })

  await app.register(cookie, {
    secret: config.auth.cookieSecret,
    parseOptions: {},
  })

  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  })

  await app.register(websocket)

  // Register middleware
  app.addHook('onRequest', authMiddleware)
  app.setErrorHandler(errorHandler)

  // Health check
  app.get('/health', async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      await redis.ping()
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          redis: 'connected',
          sandbox: await sandboxService.healthCheck(),
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
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(userRoutes, { prefix: '/api/users' })
  await app.register(workspaceRoutes, { prefix: '/api/workspaces' })
  await app.register(fileRoutes, { prefix: '/api/files' })
  await app.register(deploymentRoutes, { prefix: '/api/deployments' })
  await app.register(collaborationRoutes, { prefix: '/api/collaboration' })
  await app.register(templateRoutes, { prefix: '/api/templates' })
  await app.register(monitoringRoutes, { prefix: '/api/monitoring' })
  await app.register(webhookRoutes, { prefix: '/api/webhooks' })

  return app
}

async function start() {
  try {
    // Connect to Redis
    await redis.connect()
    logger.info('Connected to Redis')

    // Connect to database
    await prisma.$connect()
    logger.info('Connected to database')

    // Build and start the app
    const app = await buildApp()
    const server = createServer(app.server)
    
    // Initialize Socket.IO for real-time collaboration
    const io = new Server(server, {
      cors: {
        origin: config.cors.origins,
        credentials: true,
      },
      path: '/socket.io',
    })

    // Set up collaboration service with Socket.IO
    collaborationService.initialize(io)

    // Start monitoring service
    await monitoringService.start()

    const address = await app.listen({
      port: config.app.port,
      host: '0.0.0.0',
    })

    logger.info(`Server listening at ${address}`)
    logger.info(`Socket.IO server running on port ${config.app.port}`)

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully')
      await app.close()
      await prisma.$disconnect()
      await redis.disconnect()
      await monitoringService.stop()
      process.exit(0)
    })

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully')
      await app.close()
      await prisma.$disconnect()
      await redis.disconnect()
      await monitoringService.stop()
      process.exit(0)
    })

  } catch (error) {
    logger.error('Error starting server:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  start()
}

export { buildApp }