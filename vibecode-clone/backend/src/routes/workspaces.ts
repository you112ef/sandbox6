import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

interface CreateWorkspaceBody {
  name: string
  description?: string
  type?: 'TERMINAL' | 'NOTEBOOK' | 'SANDBOX'
  visibility?: 'PRIVATE' | 'PUBLIC' | 'TEAM'
  aiAgent?: string
  templateId?: string
}

// Mock workspaces database
const mockWorkspaces = [
  {
    id: '1',
    name: 'My React App',
    description: 'A modern React application with TypeScript',
    type: 'TERMINAL',
    status: 'ACTIVE',
    visibility: 'PRIVATE',
    aiAgent: 'claude-code',
    ownerId: '1',
    settings: {
      theme: 'dark',
      fontSize: 14,
      tabSize: 2,
      wordWrap: true
    },
    environment: {
      NODE_ENV: 'development',
      PORT: '3000'
    },
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    name: 'Next.js Blog',
    description: 'Personal blog built with Next.js and MDX',
    type: 'TERMINAL',
    status: 'ACTIVE',
    visibility: 'PRIVATE',
    aiAgent: 'gpt-5-codex',
    ownerId: '1',
    settings: {
      theme: 'light',
      fontSize: 16,
      tabSize: 2,
      wordWrap: true
    },
    environment: {
      NODE_ENV: 'development',
      PORT: '3000'
    },
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    name: 'Python API',
    description: 'FastAPI backend with PostgreSQL',
    type: 'TERMINAL',
    status: 'PAUSED',
    visibility: 'TEAM',
    aiAgent: 'gemini-cli',
    ownerId: '2',
    settings: {
      theme: 'dark',
      fontSize: 14,
      tabSize: 4,
      wordWrap: false
    },
    environment: {
      PYTHON_ENV: 'development',
      DATABASE_URL: 'postgresql://localhost:5432/api_db'
    },
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
]

// Mock collaborators
const mockCollaborators = [
  {
    id: '1',
    workspaceId: '3',
    userId: '1',
    role: 'EDITOR',
    permissions: ['read', 'write'],
    invitedAt: new Date('2024-01-03'),
    joinedAt: new Date('2024-01-03')
  }
]

export default async function workspaceRoutes(fastify: FastifyInstance) {
  // Authentication middleware
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
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

      // For demo purposes, we'll extract user ID from a simple token
      // In production, use proper JWT verification
      const token = authHeader.split(' ')[1]
      if (token === 'demo-token') {
        request.user = { id: '1', role: 'USER' }
      } else if (token === 'admin-token') {
        request.user = { id: '2', role: 'ADMIN' }
      } else {
        return reply.code(401).send({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Invalid token'
          }
        })
      }
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

  // List workspaces
  fastify.get('/', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const { page = 1, limit = 20, search, type, status } = request.query as any

      let filteredWorkspaces = mockWorkspaces.filter(workspace => {
        // User can see workspaces they own or are collaborators on
        const isOwner = workspace.ownerId === userId
        const isCollaborator = mockCollaborators.some(
          collab => collab.workspaceId === workspace.id && collab.userId === userId
        )
        
        if (!isOwner && !isCollaborator && workspace.visibility === 'PRIVATE') {
          return false
        }

        if (search) {
          const searchLower = search.toLowerCase()
          if (!workspace.name.toLowerCase().includes(searchLower) && 
              !workspace.description?.toLowerCase().includes(searchLower)) {
            return false
          }
        }

        if (type && workspace.type !== type) {
          return false
        }

        if (status && workspace.status !== status) {
          return false
        }

        return true
      })

      // Add owner and collaborator info
      const workspacesWithDetails = filteredWorkspaces.map(workspace => ({
        ...workspace,
        owner: {
          id: workspace.ownerId,
          name: workspace.ownerId === '1' ? 'Demo User' : 'Administrator',
          username: workspace.ownerId === '1' ? 'demo' : 'admin'
        },
        collaborators: mockCollaborators
          .filter(collab => collab.workspaceId === workspace.id)
          .map(collab => ({
            id: collab.id,
            role: collab.role,
            user: {
              id: collab.userId,
              name: collab.userId === '1' ? 'Demo User' : 'Administrator',
              username: collab.userId === '1' ? 'demo' : 'admin'
            }
          }))
      }))

      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedWorkspaces = workspacesWithDetails.slice(startIndex, endIndex)

      return reply.send({
        success: true,
        data: paginatedWorkspaces,
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredWorkspaces.length,
          totalPages: Math.ceil(filteredWorkspaces.length / limit)
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

  // Get workspace by ID
  fastify.get('/:id', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const { id } = request.params
      const userId = request.user.id

      const workspace = mockWorkspaces.find(w => w.id === id)
      if (!workspace) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND_ERROR',
            message: 'Workspace not found'
          }
        })
      }

      // Check access permissions
      const isOwner = workspace.ownerId === userId
      const isCollaborator = mockCollaborators.some(
        collab => collab.workspaceId === workspace.id && collab.userId === userId
      )

      if (!isOwner && !isCollaborator && workspace.visibility === 'PRIVATE') {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'AUTHORIZATION_ERROR',
            message: 'Access denied'
          }
        })
      }

      // Mock files for the workspace
      const mockFiles = [
        {
          id: '1',
          name: 'src',
          path: '/src',
          isDirectory: true,
          size: 0,
          updatedAt: new Date(Date.now() - 60 * 60 * 1000)
        },
        {
          id: '2',
          name: 'App.tsx',
          path: '/src/App.tsx',
          language: 'typescript',
          size: 1024,
          isDirectory: false,
          updatedAt: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: '3',
          name: 'package.json',
          path: '/package.json',
          language: 'json',
          size: 512,
          isDirectory: false,
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ]

      const workspaceWithDetails = {
        ...workspace,
        owner: {
          id: workspace.ownerId,
          name: workspace.ownerId === '1' ? 'Demo User' : 'Administrator',
          username: workspace.ownerId === '1' ? 'demo' : 'admin'
        },
        files: mockFiles,
        collaborators: mockCollaborators
          .filter(collab => collab.workspaceId === workspace.id)
          .map(collab => ({
            id: collab.id,
            role: collab.role,
            user: {
              id: collab.userId,
              name: collab.userId === '1' ? 'Demo User' : 'Administrator',
              username: collab.userId === '1' ? 'demo' : 'admin'
            }
          }))
      }

      return reply.send({
        success: true,
        data: workspaceWithDetails
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

  // Create workspace
  fastify.post('/', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const userId = request.user.id
      const { name, description, type = 'TERMINAL', visibility = 'PRIVATE', aiAgent, templateId } = request.body as CreateWorkspaceBody

      if (!name) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Workspace name is required'
          }
        })
      }

      const newWorkspace = {
        id: String(mockWorkspaces.length + 1),
        name,
        description: description || '',
        type,
        status: 'ACTIVE' as const,
        visibility,
        aiAgent: aiAgent || 'claude-code',
        ownerId: userId,
        settings: {
          theme: 'dark',
          fontSize: 14,
          tabSize: 2,
          wordWrap: true
        },
        environment: {
          NODE_ENV: 'development'
        },
        lastActivity: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockWorkspaces.push(newWorkspace)

      return reply.code(201).send({
        success: true,
        data: {
          ...newWorkspace,
          owner: {
            id: userId,
            name: userId === '1' ? 'Demo User' : 'Administrator',
            username: userId === '1' ? 'demo' : 'admin'
          },
          collaborators: [],
          files: []
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

  // Update workspace
  fastify.put('/:id', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const { id } = request.params
      const userId = request.user.id
      const updateData = request.body

      const workspaceIndex = mockWorkspaces.findIndex(w => w.id === id)
      if (workspaceIndex === -1) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND_ERROR',
            message: 'Workspace not found'
          }
        })
      }

      const workspace = mockWorkspaces[workspaceIndex]

      // Check if user is owner or has admin permissions
      if (workspace.ownerId !== userId && request.user.role !== 'ADMIN') {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'AUTHORIZATION_ERROR',
            message: 'Only workspace owner can update workspace'
          }
        })
      }

      // Update workspace
      mockWorkspaces[workspaceIndex] = {
        ...workspace,
        ...updateData,
        id: workspace.id, // Prevent ID from being changed
        ownerId: workspace.ownerId, // Prevent owner from being changed
        updatedAt: new Date()
      }

      return reply.send({
        success: true,
        data: mockWorkspaces[workspaceIndex]
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

  // Delete workspace
  fastify.delete('/:id', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const { id } = request.params
      const userId = request.user.id

      const workspaceIndex = mockWorkspaces.findIndex(w => w.id === id)
      if (workspaceIndex === -1) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND_ERROR',
            message: 'Workspace not found'
          }
        })
      }

      const workspace = mockWorkspaces[workspaceIndex]

      // Check if user is owner or has admin permissions
      if (workspace.ownerId !== userId && request.user.role !== 'ADMIN') {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'AUTHORIZATION_ERROR',
            message: 'Only workspace owner can delete workspace'
          }
        })
      }

      // Remove workspace
      mockWorkspaces.splice(workspaceIndex, 1)

      // Remove associated collaborators
      const collabIndex = mockCollaborators.findIndex(c => c.workspaceId === id)
      if (collabIndex !== -1) {
        mockCollaborators.splice(collabIndex, 1)
      }

      return reply.send({
        success: true,
        data: {
          message: 'Workspace deleted successfully'
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
}