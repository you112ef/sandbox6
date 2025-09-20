import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/logger'

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log the error
  logger.error('Request error:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    params: request.params,
    query: request.query,
    body: request.body
  })

  // Validation errors
  if (error.validation) {
    return reply.code(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.validation
      }
    })
  }

  // Rate limiting errors
  if (error.statusCode === 429) {
    return reply.code(429).send({
      success: false,
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: 'Too many requests. Please try again later.'
      }
    })
  }

  // Authentication errors
  if (error.statusCode === 401) {
    return reply.code(401).send({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication required'
      }
    })
  }

  // Authorization errors
  if (error.statusCode === 403) {
    return reply.code(403).send({
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Insufficient permissions'
      }
    })
  }

  // Not found errors
  if (error.statusCode === 404) {
    return reply.code(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND_ERROR',
        message: 'Resource not found'
      }
    })
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'

  reply.code(statusCode).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isProduction ? 'Internal server error' : error.message,
      ...(isProduction ? {} : { stack: error.stack })
    }
  })
}