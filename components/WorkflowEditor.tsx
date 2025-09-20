'use client'

import { useState, useEffect, useCallback } from 'react'
import { ReactFlow, Node, Edge, addEdge, Connection, useNodesState, useEdgesState, Controls, Background, MiniMap } from '@xyflow/react'
import { Workflow, WorkflowNode, WorkflowEdge, workflowManager } from '@/lib/workflow'
import { 
  Play, 
  Save, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Settings, 
  Eye,
  EyeOff,
  Download,
  Upload,
  Copy,
  Share2
} from 'lucide-react'
import '@xyflow/react/dist/style.css'

interface WorkflowEditorProps {
  className?: string
}

export default function WorkflowEditor({ className = '' }: WorkflowEditorProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResults, setExecutionResults] = useState<any>(null)

  useEffect(() => {
    loadWorkflows()
  }, [])

  useEffect(() => {
    if (selectedWorkflow) {
      const reactFlowNodes: Node[] = selectedWorkflow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          ...node.data
        }
      }))

      const reactFlowEdges: Edge[] = selectedWorkflow.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))

      setNodes(reactFlowNodes)
      setEdges(reactFlowEdges)
    }
  }, [selectedWorkflow])

  const loadWorkflows = () => {
    const allWorkflows = workflowManager.getAllWorkflows()
    setWorkflows(allWorkflows)
  }

  const handleCreateWorkflow = () => {
    const newWorkflow = workflowManager.createWorkflow({
      name: 'New Workflow',
      description: 'A new workflow',
      nodes: [],
      edges: [],
      published: false,
      author: 'User',
      tags: [],
      version: '1.0.0'
    })
    
    setWorkflows([...workflows, newWorkflow])
    setSelectedWorkflow(newWorkflow)
  }

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
  }

  const handleSaveWorkflow = () => {
    if (!selectedWorkflow) return

    const updatedWorkflow = {
      ...selectedWorkflow,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type as any,
        position: node.position,
        data: {
          label: node.data.label,
          description: node.data.description,
          config: node.data.config || {}
        }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))
    }

    workflowManager.updateWorkflow(selectedWorkflow.id, updatedWorkflow)
    loadWorkflows()
  }

  const handleExecuteWorkflow = async () => {
    if (!selectedWorkflow) return

    setIsExecuting(true)
    try {
      const execution = await workflowManager.executeWorkflow(selectedWorkflow.id, {})
      setExecutionResults(execution)
    } catch (error) {
      console.error('Workflow execution failed:', error)
      alert('Workflow execution failed')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleAddNode = (type: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `New ${type}`,
        config: {}
      }
    }
    setNodes(prev => [...prev, newNode])
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId))
  }

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      id: `edge-${Date.now()}`,
      source: params.source!,
      target: params.target!,
      type: 'default'
    }
    setEdges(prev => addEdge(newEdge, prev))
  }, [])

  const handleLoadTemplate = (template: Workflow) => {
    const newWorkflow = workflowManager.createWorkflow({
      name: `${template.name} (Copy)`,
      description: template.description,
      nodes: template.nodes,
      edges: template.edges,
      published: false,
      author: 'User',
      tags: template.tags,
      version: '1.0.0'
    })
    
    setWorkflows([...workflows, newWorkflow])
    setSelectedWorkflow(newWorkflow)
    setShowTemplates(false)
  }

  const nodeTypes = {
    input: ({ data }: { data: any }) => (
      <div className="px-4 py-2 bg-blue-600 text-white rounded-lg border-2 border-blue-400">
        <div className="font-medium">{data.label}</div>
        <div className="text-xs opacity-75">Input</div>
      </div>
    ),
    output: ({ data }: { data: any }) => (
      <div className="px-4 py-2 bg-green-600 text-white rounded-lg border-2 border-green-400">
        <div className="font-medium">{data.label}</div>
        <div className="text-xs opacity-75">Output</div>
      </div>
    ),
    llm: ({ data }: { data: any }) => (
      <div className="px-4 py-2 bg-purple-600 text-white rounded-lg border-2 border-purple-400">
        <div className="font-medium">{data.label}</div>
        <div className="text-xs opacity-75">LLM</div>
      </div>
    ),
    tool: ({ data }: { data: any }) => (
      <div className="px-4 py-2 bg-orange-600 text-white rounded-lg border-2 border-orange-400">
        <div className="font-medium">{data.label}</div>
        <div className="text-xs opacity-75">Tool</div>
      </div>
    ),
    condition: ({ data }: { data: any }) => (
      <div className="px-4 py-2 bg-yellow-600 text-white rounded-lg border-2 border-yellow-400">
        <div className="font-medium">{data.label}</div>
        <div className="text-xs opacity-75">Condition</div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Workflow Editor
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Templates"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
            <button
              onClick={handleCreateWorkflow}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="New workflow"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workflow Selection */}
        <div className="flex items-center gap-2 mb-4">
          <select
            value={selectedWorkflow?.id || ''}
            onChange={(e) => {
              const workflow = workflows.find(w => w.id === e.target.value)
              setSelectedWorkflow(workflow || null)
            }}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a workflow</option>
            {workflows.map(workflow => (
              <option key={workflow.id} value={workflow.id}>
                {workflow.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSaveWorkflow}
            disabled={!selectedWorkflow}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExecuteWorkflow}
            disabled={!selectedWorkflow || isExecuting}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? 'Executing...' : 'Execute'}
          </button>
          
          <div className="flex gap-1">
            <button
              onClick={() => handleAddNode('input')}
              className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Input
            </button>
            <button
              onClick={() => handleAddNode('llm')}
              className="px-2 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
            >
              LLM
            </button>
            <button
              onClick={() => handleAddNode('tool')}
              className="px-2 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
            >
              Tool
            </button>
            <button
              onClick={() => handleAddNode('condition')}
              className="px-2 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              Condition
            </button>
            <button
              onClick={() => handleAddNode('output')}
              className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              Output
            </button>
          </div>
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <h4 className="text-white font-medium mb-3">Workflow Templates</h4>
          <div className="grid grid-cols-1 gap-2">
            {workflowManager.getWorkflowTemplates().map(template => (
              <div
                key={template.id}
                className="p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleLoadTemplate(template)}
              >
                <h5 className="font-medium text-white">{template.name}</h5>
                <p className="text-sm text-gray-400">{template.description}</p>
                <div className="flex gap-1 mt-2">
                  {template.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Canvas */}
      <div className="flex-1 h-96">
        {selectedWorkflow ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-900"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select or create a workflow to start editing</p>
            </div>
          </div>
        )}
      </div>

      {/* Execution Results */}
      {executionResults && (
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <h4 className="text-white font-medium mb-3">Execution Results</h4>
          <div className="bg-gray-800 rounded-md p-3 max-h-48 overflow-y-auto">
            <pre className="text-sm text-gray-300">
              {JSON.stringify(executionResults, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}