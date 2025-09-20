// Mock MCP implementation for client-side compatibility

export interface MCPTool {
  name: string
  description: string
  inputSchema: any
  server: string
}

export interface MCPServer {
  id: string
  name: string
  command: string
  args: string[]
  env: Record<string, string>
  enabled: boolean
  status: 'connected' | 'disconnected' | 'error'
  tools: MCPTool[]
  lastConnected?: Date
}

export interface MCPConfig {
  servers: MCPServer[]
}

export class MCPManager {
  private servers: Map<string, MCPServer> = new Map()
  private clients: Map<string, any> = new Map()
  private config: MCPConfig

  constructor(config: MCPConfig) {
    this.config = config
    config.servers.forEach(server => {
      this.servers.set(server.id, server)
    })
  }

  async addServer(server: Omit<MCPServer, 'id'>): Promise<string> {
    const id = `server-${Date.now()}`
    const newServer: MCPServer = {
      id,
      ...server,
      status: 'disconnected',
      tools: []
    }
    this.servers.set(id, newServer)
    return id
  }

  async removeServer(serverId: string): Promise<boolean> {
    await this.disconnectServer(serverId)
    this.servers.delete(serverId)
    return true
  }

  async connectServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false

    try {
      // Mock implementation
      server.status = 'connected'
      server.lastConnected = new Date()
      this.clients.set(serverId, null)
      
      // Mock tools
      server.tools = [
        {
          name: 'mock-tool',
          description: 'Mock tool for testing',
          inputSchema: {},
          server: serverId
        }
      ]
      
      return true
    } catch (error) {
      console.error(`Failed to connect to MCP server ${serverId}:`, error)
      server.status = 'error'
      return false
    }
  }

  async disconnectServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false

    server.status = 'disconnected'
    this.clients.delete(serverId)
    return true
  }

  async callTool(serverId: string, toolName: string, arguments_: any): Promise<any> {
    const client = this.clients.get(serverId)
    if (!client) {
      throw new Error(`MCP server ${serverId} is not connected`)
    }

    try {
      // Mock tool execution
      return {
        content: [
          {
            type: 'text',
            text: `Mock execution of ${toolName} with args: ${JSON.stringify(arguments_)}`
          }
        ]
      }
    } catch (error) {
      console.error(`Failed to call tool ${toolName} on server ${serverId}:`, error)
      throw error
    }
  }

  async callToolByName(toolName: string, arguments_: any): Promise<any> {
    // Find the first server that has this tool
    for (const [serverId, server] of Array.from(this.servers.entries())) {
      if (server.enabled && server.status === 'connected') {
        const tool = server.tools.find((t: any) => t.name === toolName)
        if (tool) {
          return this.callTool(serverId, toolName, arguments_)
        }
      }
    }
    throw new Error(`Tool ${toolName} not found in any connected server`)
  }

  getAllTools(): MCPTool[] {
    const allTools: MCPTool[] = []
    for (const server of Array.from(this.servers.values())) {
      if (server.enabled && server.status === 'connected') {
        allTools.push(...server.tools)
      }
    }
    return allTools
  }

  getServers(): MCPServer[] {
    return Array.from(this.servers.values())
  }

  getServer(serverId: string): MCPServer | undefined {
    return this.servers.get(serverId)
  }

  async enableServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false
    
    server.enabled = true
    return this.connectServer(serverId)
  }

  async disableServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false
    
    server.enabled = false
    return this.disconnectServer(serverId)
  }

  async reconnectAll(): Promise<void> {
    for (const serverId of Array.from(this.servers.keys())) {
      await this.disconnectServer(serverId)
      await this.connectServer(serverId)
    }
  }
}

// Mock configuration
const mockConfig: MCPConfig = {
  servers: [
    {
      id: 'mock-server-1',
      name: 'Mock Server 1',
      command: 'mock-server',
      args: [],
      env: {},
      enabled: true,
      status: 'disconnected',
      tools: []
    }
  ]
}

export const mcpManager = new MCPManager(mockConfig)