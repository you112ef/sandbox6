import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config'

interface LoginBody {
  email: string
  password: string
}

interface RegisterBody {
  email: string
  password: string
  name?: string
  username?: string
}

// Mock users database (replace with real database in production)
const mockUsers = [
  {
    id: '1',
    email: 'demo@vibecode.dev',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', // demo123
    name: 'Demo User',
    username: 'demo',
    role: 'USER',
    subscription: 'PRO',
    createdAt: new Date('2024-01-01'),
    emailVerified: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'admin@vibecode.dev',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', // admin123
    name: 'Administrator',
    username: 'admin',
    role: 'ADMIN',
    subscription: 'ENTERPRISE',
    createdAt: new Date('2024-01-01'),
    emailVerified: new Date('2024-01-01')
  }
]

export default async function authRoutes(fastify: FastifyInstance) {
  // Login endpoint
  fastify.post('/login', async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    try {
      const { email, password } = request.body

      if (!email || !password) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required'
          }
        })
      }

      // Find user
      const user = mockUsers.find(u => u.email === email)
      if (!user) {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Invalid email or password'
          }
        })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Invalid email or password'
          }
        })
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        config.auth.jwtSecret,
        { expiresIn: config.auth.tokenExpiry }
      )

      const refreshToken = jwt.sign(
        { userId: user.id },
        config.auth.jwtSecret,
        { expiresIn: config.auth.refreshTokenExpiry }
      )

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      return reply.send({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
          refreshToken
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        }
      })
    }
  })

  // Register endpoint
  fastify.post('/register', async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
    try {
      const { email, password, name, username } = request.body

      if (!email || !password) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required'
          }
        })
      }

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        return reply.code(409).send({
          success: false,
          error: {
            code: 'CONFLICT_ERROR',
            message: 'User with this email already exists'
          }
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, config.auth.bcryptRounds)

      // Create new user
      const newUser = {
        id: String(mockUsers.length + 1),
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        username: username || email.split('@')[0],
        role: 'USER' as const,
        subscription: 'FREE' as const,
        createdAt: new Date(),
        emailVerified: null
      }

      mockUsers.push(newUser)

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          role: newUser.role 
        },
        config.auth.jwtSecret,
        { expiresIn: config.auth.tokenExpiry }
      )

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser

      return reply.code(201).send({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        }
      })
    }
  })

  // Get current user
  fastify.get('/me', {
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
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
        const decoded = jwt.verify(token, config.auth.jwtSecret) as any
        
        const user = mockUsers.find(u => u.id === decoded.userId)
        if (!user) {
          return reply.code(401).send({
            success: false,
            error: {
              code: 'AUTHENTICATION_ERROR',
              message: 'Invalid token'
            }
          })
        }

        // Add user to request context
        request.user = user
      } catch (error) {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Invalid or expired token'
          }
        })
      }
    }
  }, async (request: any, reply: FastifyReply) => {
    const { password: _, ...userWithoutPassword } = request.user
    
    return reply.send({
      success: true,
      data: userWithoutPassword
    })
  })

  // Refresh token
  fastify.post('/refresh', async (request: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) => {
    try {
      const { refreshToken } = request.body

      if (!refreshToken) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Refresh token is required'
          }
        })
      }

      const decoded = jwt.verify(refreshToken, config.auth.jwtSecret) as any
      const user = mockUsers.find(u => u.id === decoded.userId)
      
      if (!user) {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Invalid refresh token'
          }
        })
      }

      // Generate new access token
      const newToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        config.auth.jwtSecret,
        { expiresIn: config.auth.tokenExpiry }
      )

      return reply.send({
        success: true,
        data: {
          token: newToken
        }
      })
    } catch (error) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid or expired refresh token'
        }
      })
    }
  })

  // Logout
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    // In a real implementation, you would invalidate the token
    // For now, we just return success
    return reply.send({
      success: true,
      data: {
        message: 'Logged out successfully'
      }
    })
  })
}