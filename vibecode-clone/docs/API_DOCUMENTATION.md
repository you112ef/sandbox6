# Vibecode Clone - API Documentation

## Overview

The Vibecode Clone platform provides comprehensive REST APIs for all core functionality. This document outlines the available endpoints, request/response formats, and authentication requirements.

## Base URLs

- **Development**: `http://localhost:8000/api`
- **Staging**: `https://staging-api.vibecode.dev/api`
- **Production**: `https://api.vibecode.dev/api`

## Authentication

### JWT Token Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### OAuth Providers

The platform supports OAuth authentication with:
- GitHub (`/api/auth/github`)
- Google (`/api/auth/google`)

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "username": "johndoe",
      "role": "USER",
      "subscription": "FREE",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "subscription": "FREE"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### POST /api/auth/refresh
Refresh JWT token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### POST /api/auth/logout
Invalidate user session.

**Headers:** `Authorization: Bearer <token>`

#### GET /api/auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "avatar": "https://example.com/avatar.jpg",
    "role": "USER",
    "subscription": "FREE",
    "twoFactorEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### User Management Endpoints

#### GET /api/users/profile
Get user profile information.

**Headers:** `Authorization: Bearer <token>`

#### PUT /api/users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "username": "johnsmith",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

#### POST /api/users/change-password
Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

#### POST /api/users/setup-2fa
Set up two-factor authentication.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "backupCodes": ["123456", "789012", "345678"]
  }
}
```

### Workspace Endpoints

#### GET /api/workspaces
List user workspaces.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term
- `type` (optional): Workspace type filter
- `status` (optional): Workspace status filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "workspace_123",
      "name": "My React App",
      "description": "A modern React application",
      "type": "TERMINAL",
      "status": "ACTIVE",
      "visibility": "PRIVATE",
      "aiAgent": "claude-code",
      "lastActivity": "2024-01-15T14:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "owner": {
        "id": "user_123",
        "name": "John Doe",
        "username": "johndoe"
      },
      "collaborators": [
        {
          "id": "collab_123",
          "role": "EDITOR",
          "user": {
            "id": "user_456",
            "name": "Jane Smith",
            "username": "janesmith"
          }
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

#### POST /api/workspaces
Create a new workspace.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My New Project",
  "description": "A new exciting project",
  "type": "TERMINAL",
  "visibility": "PRIVATE",
  "aiAgent": "claude-code",
  "settings": {
    "theme": "dark",
    "fontSize": 14,
    "tabSize": 2
  },
  "environment": {
    "NODE_ENV": "development",
    "PORT": "3000"
  },
  "templateId": "template_123"
}
```

#### GET /api/workspaces/:id
Get workspace details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "workspace_123",
    "name": "My React App",
    "description": "A modern React application",
    "type": "TERMINAL",
    "status": "ACTIVE",
    "visibility": "PRIVATE",
    "settings": {
      "theme": "dark",
      "fontSize": 14,
      "tabSize": 2,
      "wordWrap": true
    },
    "environment": {
      "NODE_ENV": "development",
      "PORT": "3000"
    },
    "aiAgent": "claude-code",
    "aiConfig": {
      "model": "claude-3-sonnet",
      "temperature": 0.1
    },
    "owner": {
      "id": "user_123",
      "name": "John Doe",
      "username": "johndoe"
    },
    "files": [
      {
        "id": "file_123",
        "name": "App.js",
        "path": "/src/App.js",
        "language": "javascript",
        "size": 1024,
        "isDirectory": false,
        "updatedAt": "2024-01-15T14:30:00Z"
      }
    ],
    "collaborators": [],
    "lastActivity": "2024-01-15T14:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /api/workspaces/:id
Update workspace settings.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "settings": {
    "theme": "light",
    "fontSize": 16
  },
  "environment": {
    "NODE_ENV": "production"
  }
}
```

#### DELETE /api/workspaces/:id
Delete a workspace.

**Headers:** `Authorization: Bearer <token>`

#### POST /api/workspaces/:id/collaborators
Invite collaborators to workspace.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "collaborator@example.com",
  "role": "EDITOR",
  "permissions": ["read", "write", "deploy"]
}
```

#### PUT /api/workspaces/:id/collaborators/:collaboratorId
Update collaborator permissions.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role": "ADMIN",
  "permissions": ["read", "write", "deploy", "manage"]
}
```

#### DELETE /api/workspaces/:id/collaborators/:collaboratorId
Remove collaborator from workspace.

**Headers:** `Authorization: Bearer <token>`

### File Management Endpoints

#### GET /api/workspaces/:workspaceId/files
List files in workspace.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `path` (optional): Directory path to list
- `recursive` (optional): Include subdirectories

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "file_123",
      "name": "App.js",
      "path": "/src/App.js",
      "content": "import React from 'react';\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;",
      "language": "javascript",
      "size": 156,
      "mimeType": "application/javascript",
      "isDirectory": false,
      "version": 1,
      "status": "ACTIVE",
      "author": {
        "id": "user_123",
        "name": "John Doe"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T14:30:00Z"
    }
  ]
}
```

#### POST /api/workspaces/:workspaceId/files
Create a new file.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "NewComponent.jsx",
  "path": "/src/components/NewComponent.jsx",
  "content": "import React from 'react';\n\nconst NewComponent = () => {\n  return <div>New Component</div>;\n};\n\nexport default NewComponent;",
  "language": "javascript"
}
```

#### GET /api/files/:id
Get file content.

**Headers:** `Authorization: Bearer <token>`

#### PUT /api/files/:id
Update file content.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "updated file content",
  "version": 2
}
```

#### DELETE /api/files/:id
Delete a file.

**Headers:** `Authorization: Bearer <token>`

#### POST /api/files/:id/rename
Rename a file.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "newName": "RenamedComponent.jsx",
  "newPath": "/src/components/RenamedComponent.jsx"
}
```

### AI Agent Endpoints

#### GET /api/agents
List available AI agents.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "agent_123",
      "name": "claude-code",
      "displayName": "Claude Code",
      "description": "Advanced AI assistant for code generation",
      "provider": "ANTHROPIC",
      "model": "claude-3-sonnet-20240229",
      "capabilities": [
        "code-generation",
        "debugging",
        "refactoring",
        "documentation"
      ],
      "status": "ACTIVE",
      "isCustom": false
    }
  ]
}
```

#### POST /api/agents/execute
Execute AI agent request.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "agentId": "agent_123",
  "workspaceId": "workspace_123",
  "messages": [
    {
      "role": "user",
      "content": "Create a React component for a todo list"
    }
  ],
  "context": {
    "files": ["file_123", "file_456"],
    "language": "javascript"
  },
  "stream": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "execution_123",
    "content": "Here's a React component for a todo list:\n\n```jsx\nimport React, { useState } from 'react';\n\nconst TodoList = () => {\n  const [todos, setTodos] = useState([]);\n  const [inputValue, setInputValue] = useState('');\n\n  const addTodo = () => {\n    if (inputValue.trim()) {\n      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);\n      setInputValue('');\n    }\n  };\n\n  return (\n    <div>\n      <input\n        value={inputValue}\n        onChange={(e) => setInputValue(e.target.value)}\n        placeholder=\"Add a todo\"\n      />\n      <button onClick={addTodo}>Add</button>\n      <ul>\n        {todos.map(todo => (\n          <li key={todo.id}>{todo.text}</li>\n        ))}\n      </ul>\n    </div>\n  );\n};\n\nexport default TodoList;\n```",
    "usage": {
      "promptTokens": 45,
      "completionTokens": 234,
      "totalTokens": 279
    },
    "model": "claude-3-sonnet-20240229",
    "finishReason": "stop"
  }
}
```

#### POST /api/agents/stream
Execute streaming AI agent request.

**Headers:** 
- `Authorization: Bearer <token>`
- `Accept: text/event-stream`

**Request Body:** Same as `/api/agents/execute` with `"stream": true`

**Response:** Server-sent events stream

### Deployment Endpoints

#### GET /api/workspaces/:workspaceId/deployments
List workspace deployments.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "deployment_123",
      "name": "Production Deploy",
      "url": "https://my-app-123.vercel.app",
      "status": "DEPLOYED",
      "provider": "VERCEL",
      "branch": "main",
      "commitHash": "abc123def456",
      "createdAt": "2024-01-15T10:30:00Z",
      "deployedAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

#### POST /api/workspaces/:workspaceId/deployments
Create new deployment.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "provider": "VERCEL",
  "name": "Production Deploy",
  "branch": "main",
  "environment": {
    "NODE_ENV": "production",
    "API_URL": "https://api.myapp.com"
  },
  "config": {
    "buildCommand": "npm run build",
    "outputDirectory": "dist"
  }
}
```

#### GET /api/deployments/:id
Get deployment details.

**Headers:** `Authorization: Bearer <token>`

#### PUT /api/deployments/:id
Update deployment configuration.

**Headers:** `Authorization: Bearer <token>`

#### DELETE /api/deployments/:id
Cancel or delete deployment.

**Headers:** `Authorization: Bearer <token>`

#### POST /api/deployments/:id/rollback
Rollback to previous deployment.

**Headers:** `Authorization: Bearer <token>`

### Template Endpoints

#### GET /api/templates
List available templates.

**Query Parameters:**
- `category` (optional): Filter by category
- `tags` (optional): Filter by tags (comma-separated)
- `featured` (optional): Show only featured templates
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "template_123",
      "name": "React TypeScript App",
      "description": "Modern React application with TypeScript",
      "category": "WEB",
      "tags": ["react", "typescript", "vite"],
      "author": {
        "id": "user_123",
        "name": "John Doe",
        "username": "johndoe"
      },
      "featured": true,
      "downloads": 1250,
      "stars": 89,
      "version": "1.0.0",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /api/templates/:id
Get template details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "template_123",
    "name": "React TypeScript App",
    "description": "Modern React application with TypeScript",
    "category": "WEB",
    "tags": ["react", "typescript", "vite"],
    "files": {
      "package.json": {
        "content": "{\n  \"name\": \"react-typescript-app\",\n  \"version\": \"1.0.0\"\n}"
      },
      "src/App.tsx": {
        "content": "import React from 'react';\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;"
      }
    },
    "config": {
      "buildCommand": "npm run build",
      "devCommand": "npm run dev",
      "outputDirectory": "dist",
      "installCommand": "npm install"
    },
    "author": {
      "id": "user_123",
      "name": "John Doe",
      "username": "johndoe"
    },
    "visibility": "PUBLIC",
    "featured": true,
    "downloads": 1250,
    "stars": 89,
    "version": "1.0.0",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### POST /api/templates
Create new template.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Custom Template",
  "description": "A custom template for my projects",
  "category": "WEB",
  "tags": ["custom", "template"],
  "files": {
    "README.md": {
      "content": "# My Custom Template\n\nThis is a custom template."
    }
  },
  "config": {
    "buildCommand": "npm run build",
    "devCommand": "npm run dev"
  },
  "visibility": "PUBLIC"
}
```

### Monitoring Endpoints

#### GET /api/monitoring/metrics
Get system metrics.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Query Parameters:**
- `timeRange` (optional): Time range (1h, 24h, 7d, 30d)
- `metric` (optional): Specific metric name

**Response:**
```json
{
  "success": true,
  "data": {
    "cpu": {
      "current": 45.2,
      "average": 38.7,
      "max": 78.3,
      "unit": "percent"
    },
    "memory": {
      "current": 2.1,
      "average": 1.8,
      "max": 3.2,
      "unit": "GB"
    },
    "requests": {
      "total": 15420,
      "rate": 12.3,
      "unit": "requests/minute"
    }
  }
}
```

#### GET /api/monitoring/logs
Get system logs.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Query Parameters:**
- `level` (optional): Log level (debug, info, warn, error)
- `service` (optional): Service name
- `limit` (optional): Number of logs to return

### Audit Endpoints

#### GET /api/audit/logs
Get audit logs.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Query Parameters:**
- `userId` (optional): Filter by user
- `action` (optional): Filter by action
- `resource` (optional): Filter by resource
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "email",
      "message": "Email is required"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400): Request validation failed
- `AUTHENTICATION_ERROR` (401): Authentication required
- `AUTHORIZATION_ERROR` (403): Insufficient permissions
- `NOT_FOUND_ERROR` (404): Resource not found
- `CONFLICT_ERROR` (409): Resource conflict
- `RATE_LIMIT_ERROR` (429): Rate limit exceeded
- `INTERNAL_ERROR` (500): Internal server error

## Rate Limiting

API endpoints are rate limited based on user subscription:

- **Free Tier**: 100 requests per 15 minutes
- **Pro Tier**: 1000 requests per 15 minutes  
- **Team Tier**: 5000 requests per 15 minutes
- **Enterprise**: Custom limits

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Pagination

List endpoints support pagination with these parameters:
- `page`: Page number (1-based)
- `limit`: Items per page (max 100)

Pagination metadata is included in the `meta` field of responses.

## WebSocket API

Real-time features use WebSocket connections at `/socket.io`.

### Connection

```javascript
const socket = io('ws://localhost:8000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Join Workspace
```javascript
socket.emit('join-workspace', { workspaceId: 'workspace_123' });
```

#### File Changes
```javascript
socket.emit('file-change', {
  fileId: 'file_123',
  changes: [
    { start: 10, end: 15, text: 'new content' }
  ]
});
```

#### Cursor Position
```javascript
socket.emit('cursor-position', {
  fileId: 'file_123',
  line: 5,
  column: 10
});
```

This API documentation provides comprehensive coverage of all available endpoints and their usage patterns.