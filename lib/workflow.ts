export interface WorkflowNode {
  id: string
  type: 'llm' | 'tool' | 'condition' | 'input' | 'output'
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    config: any
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type?: string
  data?: any
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: Date
  updatedAt: Date
  published: boolean
  author: string
  tags: string[]
  version: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed' | 'paused'
  currentStep: string
  results: Record<string, any>
  logs: string[]
  startedAt: Date
  completedAt?: Date
  error?: string
}

export interface WorkflowStep {
  id: string
  nodeId: string
  type: string
  input: any
  output?: any
  status: 'pending' | 'running' | 'completed' | 'failed'
  error?: string
  startedAt?: Date
  completedAt?: Date
}

export class WorkflowManager {
  private workflows: Map<string, Workflow> = new Map()
  private executions: Map<string, WorkflowExecution> = new Map()

  // Workflow CRUD operations
  createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Workflow {
    const newWorkflow: Workflow = {
      ...workflow,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.workflows.set(newWorkflow.id, newWorkflow)
    return newWorkflow
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id)
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values())
  }

  updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | null {
    const workflow = this.workflows.get(id)
    if (!workflow) return null

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date()
    }
    this.workflows.set(id, updatedWorkflow)
    return updatedWorkflow
  }

  deleteWorkflow(id: string): boolean {
    return this.workflows.delete(id)
  }

  // Workflow execution
  async executeWorkflow(workflowId: string, inputs: Record<string, any> = {}): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }

    const execution: WorkflowExecution = {
      id: this.generateId(),
      workflowId,
      status: 'running',
      currentStep: '',
      results: {},
      logs: [],
      startedAt: new Date()
    }

    this.executions.set(execution.id, execution)

    try {
      // Find start nodes (nodes with no incoming edges)
      const startNodes = workflow.nodes.filter(node => 
        !workflow.edges.some(edge => edge.target === node.id)
      )

      if (startNodes.length === 0) {
        throw new Error('No start nodes found in workflow')
      }

      // Execute workflow steps
      await this.executeNode(execution, workflow, startNodes[0], inputs)

      execution.status = 'completed'
      execution.completedAt = new Date()
    } catch (error) {
      execution.status = 'failed'
      execution.error = error instanceof Error ? error.message : 'Unknown error'
      execution.completedAt = new Date()
    }

    return execution
  }

  private async executeNode(
    execution: WorkflowExecution, 
    workflow: Workflow, 
    node: WorkflowNode, 
    inputs: Record<string, any>
  ): Promise<any> {
    execution.currentStep = node.id
    execution.logs.push(`Executing node: ${node.data.label}`)

    try {
      let result: any

      switch (node.type) {
        case 'input':
          result = inputs[node.id] || node.data.config.defaultValue
          break

        case 'llm':
          result = await this.executeLLMNode(node, inputs)
          break

        case 'tool':
          result = await this.executeToolNode(node, inputs)
          break

        case 'condition':
          result = await this.executeConditionNode(node, inputs)
          break

        case 'output':
          result = inputs[node.id] || node.data.config.value
          break

        default:
          throw new Error(`Unknown node type: ${node.type}`)
      }

      execution.results[node.id] = result

      // Find next nodes to execute
      const nextEdges = workflow.edges.filter(edge => edge.source === node.id)
      
      for (const edge of nextEdges) {
        const nextNode = workflow.nodes.find(n => n.id === edge.target)
        if (nextNode) {
          const nextInputs = { ...inputs, [node.id]: result }
          await this.executeNode(execution, workflow, nextNode, nextInputs)
        }
      }

      return result
    } catch (error) {
      execution.logs.push(`Error in node ${node.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    }
  }

  private async executeLLMNode(node: WorkflowNode, inputs: Record<string, any>): Promise<any> {
    const config = node.data.config
    const prompt = this.interpolateTemplate(config.prompt, inputs)
    
    // This would integrate with your AI client
    // For now, return a mock response
    return {
      content: `LLM response for: ${prompt}`,
      model: config.model || 'gpt-4',
      usage: { tokens: 100 }
    }
  }

  private async executeToolNode(node: WorkflowNode, inputs: Record<string, any>): Promise<any> {
    const config = node.data.config
    const toolName = config.toolName
    const toolArgs = this.interpolateTemplate(config.arguments, inputs)
    
    // This would integrate with your MCP manager
    // For now, return a mock response
    return {
      tool: toolName,
      arguments: toolArgs,
      result: `Tool ${toolName} executed with args: ${JSON.stringify(toolArgs)}`
    }
  }

  private async executeConditionNode(node: WorkflowNode, inputs: Record<string, any>): Promise<any> {
    const config = node.data.config
    const condition = config.condition
    const value = this.interpolateTemplate(condition, inputs)
    
    // Simple condition evaluation
    try {
      const result = eval(value)
      return { condition: value, result: !!result }
    } catch (error) {
      throw new Error(`Invalid condition: ${condition}`)
    }
  }

  private interpolateTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match
    })
  }

  // Execution management
  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id)
  }

  getAllExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values())
  }

  pauseExecution(id: string): boolean {
    const execution = this.executions.get(id)
    if (execution && execution.status === 'running') {
      execution.status = 'paused'
      return true
    }
    return false
  }

  resumeExecution(id: string): boolean {
    const execution = this.executions.get(id)
    if (execution && execution.status === 'paused') {
      execution.status = 'running'
      return true
    }
    return false
  }

  cancelExecution(id: string): boolean {
    const execution = this.executions.get(id)
    if (execution && (execution.status === 'running' || execution.status === 'paused')) {
      execution.status = 'failed'
      execution.error = 'Cancelled by user'
      execution.completedAt = new Date()
      return true
    }
    return false
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // Workflow templates
  getWorkflowTemplates(): Workflow[] {
    return [
      {
        id: 'template-1',
        name: 'Code Review Workflow',
        description: 'Automated code review with AI analysis',
        nodes: [
          {
            id: 'input-1',
            type: 'input',
            position: { x: 100, y: 100 },
            data: {
              label: 'Code Input',
              config: { defaultValue: '' }
            }
          },
          {
            id: 'llm-1',
            type: 'llm',
            position: { x: 300, y: 100 },
            data: {
              label: 'Code Analysis',
              config: {
                model: 'gpt-4',
                prompt: 'Analyze this code for bugs, performance issues, and best practices: {{input-1}}'
              }
            }
          },
          {
            id: 'output-1',
            type: 'output',
            position: { x: 500, y: 100 },
            data: {
              label: 'Review Report',
              config: { value: '{{llm-1}}' }
            }
          }
        ],
        edges: [
          { id: 'e1', source: 'input-1', target: 'llm-1' },
          { id: 'e2', source: 'llm-1', target: 'output-1' }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true,
        author: 'System',
        tags: ['code-review', 'ai'],
        version: '1.0.0'
      },
      {
        id: 'template-2',
        name: 'Data Processing Pipeline',
        description: 'Process and analyze data with multiple steps',
        nodes: [
          {
            id: 'input-2',
            type: 'input',
            position: { x: 100, y: 100 },
            data: {
              label: 'Data Input',
              config: { defaultValue: '' }
            }
          },
          {
            id: 'tool-1',
            type: 'tool',
            position: { x: 300, y: 100 },
            data: {
              label: 'Data Cleaner',
              config: {
                toolName: 'data-cleaner',
                arguments: '{{input-2}}'
              }
            }
          },
          {
            id: 'llm-2',
            type: 'llm',
            position: { x: 500, y: 100 },
            data: {
              label: 'Data Analysis',
              config: {
                model: 'gpt-4',
                prompt: 'Analyze this cleaned data: {{tool-1}}'
              }
            }
          },
          {
            id: 'output-2',
            type: 'output',
            position: { x: 700, y: 100 },
            data: {
              label: 'Analysis Report',
              config: { value: '{{llm-2}}' }
            }
          }
        ],
        edges: [
          { id: 'e3', source: 'input-2', target: 'tool-1' },
          { id: 'e4', source: 'tool-1', target: 'llm-2' },
          { id: 'e5', source: 'llm-2', target: 'output-2' }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true,
        author: 'System',
        tags: ['data-processing', 'pipeline'],
        version: '1.0.0'
      }
    ]
  }
}

// Singleton instance
export const workflowManager = new WorkflowManager()