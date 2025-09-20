import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

export interface MCPTool {
  name: string
  description: string
  inputSchema: any
  server: string
}

export interface MCPServer {
  id: string
  name: string
  description: string
  command: string
  args: string[]
  env?: Record<string, string>
  tools: MCPTool[]
  enabled: boolean
  status: 'connected' | 'disconnected' | 'error'
  lastConnected?: Date
}

export class MCPManager {
  private servers: Map<string, MCPServer> = new Map()
  private clients: Map<string, Client> = new Map()
  private config: MCPConfig

  constructor(config: MCPConfig) {
    this.config = config
  }

  async addServer(server: Omit<MCPServer, 'id' | 'tools' | 'status'>): Promise<string> {
    const id = this.generateId()
    const mcpServer: MCPServer = {
      ...server,
      id,
      tools: [],
      status: 'disconnected',
      enabled: true
    }

    this.servers.set(id, mcpServer)
    await this.connectServer(id)
    return id
  }

  async removeServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false

    await this.disconnectServer(serverId)
    this.servers.delete(serverId)
    return true
  }

  async connectServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false

    try {
      const transport = new StdioClientTransport({
        command: server.command,
        args: server.args,
        env: server.env
      })

      const client = new Client({
        name: 'vibecode-terminal',
        version: '1.0.0'
      }, {
        capabilities: {
          tools: {}
        }
      })

      await client.connect(transport)

      // List available tools
      const toolsResponse = await client.request({
        method: ListToolsRequestSchema.method,
        params: {}
      })

      server.tools = toolsResponse.tools.map(tool => ({
        name: tool.name,
        description: tool.description || '',
        inputSchema: tool.inputSchema,
        server: serverId
      }))

      server.status = 'connected'
      server.lastConnected = new Date()
      this.clients.set(serverId, client)

      return true
    } catch (error) {
      console.error(`Failed to connect to MCP server ${serverId}:`, error)
      server.status = 'error'
      return false
    }
  }

  async disconnectServer(serverId: string): Promise<boolean> {
    const client = this.clients.get(serverId)
    if (client) {
      try {
        await client.close()
        this.clients.delete(serverId)
      } catch (error) {
        console.error(`Failed to disconnect MCP server ${serverId}:`, error)
      }
    }

    const server = this.servers.get(serverId)
    if (server) {
      server.status = 'disconnected'
    }

    return true
  }

  async callTool(serverId: string, toolName: string, arguments_: any): Promise<any> {
    const client = this.clients.get(serverId)
    if (!client) {
      throw new Error(`MCP server ${serverId} is not connected`)
    }

    try {
      const response = await client.request({
        method: CallToolRequestSchema.method,
        params: {
          name: toolName,
          arguments: arguments_
        }
      })

      return response
    } catch (error) {
      console.error(`Failed to call tool ${toolName} on server ${serverId}:`, error)
      throw error
    }
  }

  async callToolByName(toolName: string, arguments_: any): Promise<any> {
    // Find the first server that has this tool
    for (const [serverId, server] of this.servers) {
      if (server.enabled && server.status === 'connected') {
        const tool = server.tools.find(t => t.name === toolName)
        if (tool) {
          return this.callTool(serverId, toolName, arguments_)
        }
      }
    }

    throw new Error(`Tool ${toolName} not found in any connected server`)
  }

  getAllTools(): MCPTool[] {
    const allTools: MCPTool[] = []
    for (const server of this.servers.values()) {
      if (server.enabled && server.status === 'connected') {
        allTools.push(...server.tools)
      }
    }
    return allTools
  }

  getServer(serverId: string): MCPServer | undefined {
    return this.servers.get(serverId)
  }

  getAllServers(): MCPServer[] {
    return Array.from(this.servers.values())
  }

  async enableServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false

    server.enabled = true
    if (server.status === 'disconnected') {
      return this.connectServer(serverId)
    }
    return true
  }

  async disableServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false

    server.enabled = false
    return this.disconnectServer(serverId)
  }

  async reconnectAll(): Promise<void> {
    for (const serverId of this.servers.keys()) {
      await this.disconnectServer(serverId)
      await this.connectServer(serverId)
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

export interface MCPConfig {
  autoConnect: boolean
  reconnectInterval: number
  maxRetries: number
}

// Default MCP servers configuration
export const defaultMCPServers: Omit<MCPServer, 'id' | 'tools' | 'status'>[] = [
  {
    name: 'Filesystem',
    description: 'File system operations',
    command: 'npx',
    args: ['@modelcontextprotocol/server-filesystem', '/workspace'],
    env: {},
    enabled: true
  },
  {
    name: 'Git',
    description: 'Git operations',
    command: 'npx',
    args: ['@modelcontextprotocol/server-git', '--repository', '/workspace'],
    env: {},
    enabled: true
  },
  {
    name: 'Web Search',
    description: 'Web search capabilities',
    command: 'npx',
    args: ['@modelcontextprotocol/server-brave-search'],
    env: {
      BRAVE_API_KEY: process.env.BRAVE_API_KEY || ''
    },
    enabled: true
  }
]

// Singleton instance
export const mcpManager = new MCPManager({
  autoConnect: true,
  reconnectInterval: 30000,
  maxRetries: 3
})

// Initialize default servers
export async function initializeMCPServers(): Promise<void> {
  for (const serverConfig of defaultMCPServers) {
    try {
      await mcpManager.addServer(serverConfig)
    } catch (error) {
      console.error('Failed to initialize MCP server:', error)
    }
  }
}