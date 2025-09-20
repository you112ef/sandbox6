// User types
export interface User {
  id: string
  email: string
  username?: string
  name?: string
  avatar?: string
  role: UserRole
  subscription: SubscriptionTier
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  TEAM = 'TEAM',
  ENTERPRISE = 'ENTERPRISE',
}

// Workspace types
export interface Workspace {
  id: string
  name: string
  description?: string
  type: WorkspaceType
  status: WorkspaceStatus
  visibility: WorkspaceVisibility
  settings: WorkspaceSettings
  environment: Record<string, string>
  aiAgent?: string
  aiConfig: Record<string, any>
  ownerId: string
  owner: User
  collaborators: WorkspaceCollaborator[]
  files: File[]
  lastActivity: Date
  createdAt: Date
  updatedAt: Date
}

export enum WorkspaceType {
  TERMINAL = 'TERMINAL',
  NOTEBOOK = 'NOTEBOOK',
  SANDBOX = 'SANDBOX',
}

export enum WorkspaceStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum WorkspaceVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  TEAM = 'TEAM',
}

export interface WorkspaceSettings {
  theme?: 'light' | 'dark' | 'auto'
  fontSize?: number
  tabSize?: number
  wordWrap?: boolean
  minimap?: boolean
  lineNumbers?: boolean
  autoSave?: boolean
  autoSaveDelay?: number
}

export interface WorkspaceCollaborator {
  id: string
  workspaceId: string
  userId: string
  role: CollaboratorRole
  permissions: string[]
  user: User
  invitedAt: Date
  joinedAt?: Date
}

export enum CollaboratorRole {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

// File types
export interface File {
  id: string
  name: string
  path: string
  content: string
  language?: string
  size: number
  mimeType?: string
  isDirectory: boolean
  parentId?: string
  parent?: File
  children?: File[]
  workspaceId: string
  workspace: Workspace
  authorId: string
  author: User
  version: number
  status: FileStatus
  createdAt: Date
  updatedAt: Date
}

export enum FileStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED',
}

// AI Agent types
export interface AIAgent {
  id: string
  name: string
  displayName: string
  description?: string
  provider: AIProvider
  model: string
  config: Record<string, any>
  capabilities: AgentCapability[]
  status: AgentStatus
  isCustom: boolean
  requestCount: number
  lastUsed?: Date
  createdAt: Date
  updatedAt: Date
}

export enum AIProvider {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  GOOGLE = 'GOOGLE',
  CUSTOM = 'CUSTOM',
}

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED',
}

export type AgentCapability = 
  | 'code-generation'
  | 'debugging'
  | 'refactoring'
  | 'documentation'
  | 'code-review'
  | 'completion'
  | 'explanation'
  | 'translation'
  | 'optimization'
  | 'cli-commands'
  | 'system-admin'
  | 'devops'
  | 'scripting'

// Agent Request/Response types
export interface AgentMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  name?: string
}

export interface AgentRequest {
  provider: string
  model?: string
  messages: AgentMessage[]
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  stream?: boolean
  capabilities?: AgentCapability[]
  timeout?: number
  retries?: number
  context?: {
    workspaceId?: string
    files?: string[]
    language?: string
  }
}

export interface AgentResponse {
  id: string
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  finishReason?: 'stop' | 'length' | 'content_filter' | 'tool_calls'
  metadata?: Record<string, any>
}

// Deployment types
export interface Deployment {
  id: string
  name?: string
  url?: string
  status: DeploymentStatus
  provider: DeploymentProvider
  config: Record<string, any>
  environment: Record<string, string>
  buildLogs?: string
  workspaceId: string
  workspace: Workspace
  deployerId: string
  deployer: User
  commitHash?: string
  branch?: string
  createdAt: Date
  updatedAt: Date
  deployedAt?: Date
}

export enum DeploymentStatus {
  PENDING = 'PENDING',
  BUILDING = 'BUILDING',
  DEPLOYED = 'DEPLOYED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum DeploymentProvider {
  VERCEL = 'VERCEL',
  NETLIFY = 'NETLIFY',
  FLY_IO = 'FLY_IO',
  DOCKER = 'DOCKER',
  CUSTOM = 'CUSTOM',
}

// Template types
export interface Template {
  id: string
  name: string
  description?: string
  category: TemplateCategory
  tags: string[]
  files: Record<string, TemplateFile>
  config: TemplateConfig
  authorId: string
  author: User
  visibility: TemplateVisibility
  featured: boolean
  downloads: number
  stars: number
  version: string
  createdAt: Date
  updatedAt: Date
}

export interface TemplateFile {
  content: string
  encoding?: 'utf8' | 'base64'
}

export interface TemplateConfig {
  buildCommand?: string
  devCommand?: string
  outputDirectory?: string
  installCommand?: string
  framework?: string
  language?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export enum TemplateCategory {
  WEB = 'WEB',
  API = 'API',
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  AI_ML = 'AI_ML',
  BLOCKCHAIN = 'BLOCKCHAIN',
  GAME = 'GAME',
  OTHER = 'OTHER',
}

export enum TemplateVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  TEAM = 'TEAM',
}

// Collaboration types
export interface CollaborationEvent {
  id: string
  type: CollaborationEventType
  data: Record<string, any>
  userId: string
  user: User
  workspaceId: string
  timestamp: Date
}

export enum CollaborationEventType {
  FILE_CHANGED = 'FILE_CHANGED',
  CURSOR_MOVED = 'CURSOR_MOVED',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  SELECTION_CHANGED = 'SELECTION_CHANGED',
}

// Monitoring types
export interface SystemMetric {
  id: string
  name: string
  value: number
  unit?: string
  tags: Record<string, any>
  timestamp: Date
}

export interface AuditLog {
  id: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  userId?: string
  user?: User
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, any>
}

// WebSocket types
export interface WebSocketMessage {
  type: string
  data: any
  timestamp: Date
  userId?: string
  workspaceId?: string
}

// Sandbox types
export interface SandboxExecution {
  id: string
  command: string
  workingDirectory: string
  environment: Record<string, string>
  timeout: number
  status: SandboxExecutionStatus
  output: string
  error?: string
  exitCode?: number
  startTime: Date
  endTime?: Date
}

export enum SandboxExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',
}

// Error types
export class VibecodeError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'VibecodeError'
  }
}

export class ValidationError extends VibecodeError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends VibecodeError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends VibecodeError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends VibecodeError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`
    super(message, 'NOT_FOUND_ERROR', 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends VibecodeError {
  constructor(message: string, details?: any) {
    super(message, 'CONFLICT_ERROR', 409, details)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends VibecodeError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}