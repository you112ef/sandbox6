import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import jwt from 'jsonwebtoken'
import { config } from '../config'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      role: string
    }
  }
}

const publicRoutes = [
  '/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/templates' // Public templates can be viewed without auth
]

const isPublicRoute = (url: string): boolean => {
  return publicRoutes.some(route => url.startsWith(route))
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  // Skip authentication for public routes
  if (isPublicRoute(request.url)) {
    return done()
  }

  try {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Authentication required'
        }
      })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, config.auth.jwtSecret) as any
      
      // Add user information to request
      request.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }

      done()
    } catch (jwtError) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid or expired token'
        }
      })
    }
  } catch (error) {
    return reply.code(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication error'
      }
    })
  }
}