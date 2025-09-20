'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  FolderOpen, 
  Clock, 
  Users, 
  Settings,
  LogOut,
  Code2,
  Terminal,
  Globe,
  GitBranch,
  Play,
  Pause,
  Trash2,
  Eye
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Workspace {
  id: string
  name: string
  description: string
  type: 'TERMINAL' | 'NOTEBOOK' | 'SANDBOX'
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  lastActivity: string
  collaborators: number
  aiAgent: string
  isOwner: boolean
}

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading workspaces
    const loadWorkspaces = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockWorkspaces: Workspace[] = [
        {
          id: '1',
          name: 'My React App',
          description: 'A modern React application with TypeScript',
          type: 'TERMINAL',
          status: 'ACTIVE',
          lastActivity: '2 hours ago',
          collaborators: 3,
          aiAgent: 'Claude Code',
          isOwner: true
        },
        {
          id: '2',
          name: 'Next.js Blog',
          description: 'Personal blog built with Next.js and MDX',
          type: 'TERMINAL',
          status: 'ACTIVE',
          lastActivity: '1 day ago',
          collaborators: 1,
          aiAgent: 'GPT-5 Codex',
          isOwner: true
        },
        {
          id: '3',
          name: 'Python API',
          description: 'FastAPI backend with PostgreSQL',
          type: 'TERMINAL',
          status: 'PAUSED',
          lastActivity: '3 days ago',
          collaborators: 2,
          aiAgent: 'Gemini CLI',
          isOwner: false
        },
        {
          id: '4',
          name: 'Data Analysis',
          description: 'Jupyter notebook for data science',
          type: 'NOTEBOOK',
          status: 'ACTIVE',
          lastActivity: '5 hours ago',
          collaborators: 1,
          aiAgent: 'Claude Code',
          isOwner: true
        }
      ]
      
      setWorkspaces(mockWorkspaces)
      setIsLoading(false)
    }

    loadWorkspaces()
  }, [])

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateWorkspace = () => {
    router.push('/workspace/new')
  }

  const handleOpenWorkspace = (workspaceId: string) => {
    toast({
      title: 'Opening Workspace',
      description: 'Loading workspace environment...',
    })
    router.push(`/workspace/${workspaceId}`)
  }

  const handleDeleteWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== workspaceId))
    toast({
      title: 'Workspace Deleted',
      description: 'The workspace has been permanently deleted.',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500'
      case 'PAUSED':
        return 'bg-yellow-500'
      case 'ARCHIVED':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TERMINAL':
        return <Terminal className="w-4 h-4" />
      case 'NOTEBOOK':
        return <Code2 className="w-4 h-4" />
      case 'SANDBOX':
        return <Play className="w-4 h-4" />
      default:
        return <FolderOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Vibecode Clone</span>
              </div>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/')}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Manage your workspaces and collaborate with your team.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={handleCreateWorkspace}>
              <Plus className="w-4 h-4 mr-2" />
              New Workspace
            </Button>
            <Button variant="outline">
              <GitBranch className="w-4 h-4 mr-2" />
              Import from GitHub
            </Button>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Workspaces Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace) => (
              <Card key={workspace.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(workspace.type)}
                      <CardTitle className="text-lg">{workspace.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(workspace.status)}`}></div>
                      <Badge variant="outline" className="text-xs">
                        {workspace.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {workspace.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {workspace.lastActivity}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {workspace.collaborators}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {workspace.aiAgent}
                    </Badge>
                    {workspace.isOwner && (
                      <Badge variant="outline" className="text-xs">
                        Owner
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenWorkspace(workspace.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Open
                    </Button>
                    <Button variant="outline" size="sm">
                      <Globe className="w-3 h-3" />
                    </Button>
                    {workspace.isOwner && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteWorkspace(workspace.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredWorkspaces.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No workspaces found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first workspace to get started.'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateWorkspace}>
                <Plus className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Workspaces</p>
                  <p className="text-2xl font-bold">{workspaces.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Collaborators</p>
                  <p className="text-2xl font-bold">
                    {workspaces.reduce((sum, w) => sum + w.collaborators, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">
                    {workspaces.filter(w => w.status === 'ACTIVE').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">AI Agents</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}