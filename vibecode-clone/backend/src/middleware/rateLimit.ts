import { config } from '../config'

export const rateLimitConfig = {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.timeWindow,
  errorResponseBuilder: (request: any, context: any) => {
    return {
      success: false,
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: `Too many requests. Limit: ${context.max} per ${Math.floor(context.timeWindow / 1000 / 60)} minutes.`,
        details: {
          limit: context.max,
          remaining: context.max - context.count,
          reset: new Date(Date.now() + context.ttl)
        }
      }
    }
  },
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true
  }
}