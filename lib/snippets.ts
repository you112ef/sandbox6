export interface CodeSnippet {
  id: string
  name: string
  description: string
  language: string
  code: string
  tags: string[]
  category: string
  author: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  usageCount: number
}

export interface SnippetCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export const snippetCategories: SnippetCategory[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'JavaScript code snippets',
    icon: '🟨',
    color: '#f7df1e'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'TypeScript code snippets',
    icon: '🔷',
    color: '#3178c6'
  },
  {
    id: 'react',
    name: 'React',
    description: 'React components and hooks',
    icon: '⚛️',
    color: '#61dafb'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Node.js server code',
    icon: '🟢',
    color: '#68a063'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Python scripts and functions',
    icon: '🐍',
    color: '#3776ab'
  },
  {
    id: 'css',
    name: 'CSS',
    description: 'CSS styles and animations',
    icon: '🎨',
    color: '#1572b6'
  },
  {
    id: 'sql',
    name: 'SQL',
    description: 'Database queries and schemas',
    icon: '🗄️',
    color: '#336791'
  },
  {
    id: 'utils',
    name: 'Utilities',
    description: 'Helper functions and utilities',
    icon: '🔧',
    color: '#6c757d'
  }
]

export const defaultSnippets: CodeSnippet[] = [
  // JavaScript Snippets
  {
    id: 'js-fetch-api',
    name: 'Fetch API with Error Handling',
    description: 'Modern fetch API with proper error handling',
    language: 'javascript',
    code: `async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}`,
    tags: ['fetch', 'api', 'async', 'error-handling'],
    category: 'javascript',
    author: 'VibeCode',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 0
  },
  {
    id: 'js-debounce',
    name: 'Debounce Function',
    description: 'Utility function to debounce function calls',
    language: 'javascript',
    code: `function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}`,
    tags: ['debounce', 'utility', 'performance'],
    category: 'javascript',
    author: 'VibeCode',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 0
  },

  // React Snippets
  {
    id: 'react-custom-hook',
    name: 'Custom Hook Template',
    description: 'Template for creating custom React hooks',
    language: 'typescript',
    code: `import { useState, useEffect } from 'react';

interface UseCustomHookOptions {
  initialValue?: any;
  dependencies?: any[];
}

export function useCustomHook(options: UseCustomHookOptions = {}) {
  const [value, setValue] = useState(options.initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Your hook logic here
    const fetchData = async () => {
      setLoading(true);
      try {
        // Your async operation
        setValue(/* result */);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, options.dependencies);

  return { value, loading, error, setValue };
}`,
    tags: ['react', 'hook', 'typescript', 'template'],
    category: 'react',
    author: 'VibeCode',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 0
  },
  {
    id: 'react-context-provider',
    name: 'Context Provider Template',
    description: 'Template for React Context Provider',
    language: 'typescript',
    code: `import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface State {
  // Define your state shape
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {
  // Initial state
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ACTION_TYPE':
      return {
        ...state,
        // Update state
      };
    default:
      return state;
  }
}

const Context = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
}

export function useContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContext must be used within ContextProvider');
  }
  return context;
}`,
    tags: ['react', 'context', 'provider', 'typescript'],
    category: 'react',
    author: 'VibeCode',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 0
  },

  // Node.js Snippets
  {
    id: 'node-express-server',
    name: 'Express Server Setup',
    description: 'Basic Express.js server with middleware',
    language: 'javascript',
    code: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    tags: ['express', 'nodejs', 'server', 'middleware'],
    category: 'nodejs',
    author: 'VibeCode',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 0
  },

  // Python Snippets
  {
    id: 'python-fastapi',
    name: 'FastAPI Basic Setup',
    description: 'Basic FastAPI application setup',
    language: 'python',
    code: `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="My API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Item(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float

class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

# Routes
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/items/", response_model=List[Item])
async def read_items():
    return [{"id": 1, "name": "Item 1", "price": 10.0}]

@app.post("/items/", response_model=Item)
async def create_item(item: ItemCreate):
    return {"id": 1, **item.dict()}

@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: int):
    if item_id == 1:
        return {"id": 1, "name": "Item 1", "price": 10.0}
    raise HTTPException(status_code=404, detail="Item not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`,
    tags: ['fastapi', 'python', 'api', 'rest'],
    category: 'python',
    author: 'VibeCode',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 0
  },

  // CSS Snippets
  {
    id: 'css-flexbox-center',
    name: 'Flexbox Centering',
    description: 'CSS flexbox centering utilities',
    language: 'css',
    code: `/* Flexbox centering utilities */
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-horizontal {
  display: flex;
  justify-content: center;
}

.center-vertical {
  display: flex;
  align-items: center;
}

.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Grid centering */
.center-grid {
  display: grid;
  place-items: center;
}

/* Text centering */
.text-center {
  text-align: center;
}

/* Full height centering */
.full-height-center {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
    tags: ['css', 'flexbox', 'centering', 'layout'],
    category: 'css',
    author: 'VibeCode',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 0
  },

  // SQL Snippets
  {
    id: 'sql-user-management',
    name: 'User Management Schema',
    description: 'Complete user management database schema',
    language: 'sql',
    code: `-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User role assignments
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrator with full access'),
('user', 'Regular user'),
('moderator', 'Moderator with limited admin access');`,
    tags: ['sql', 'database', 'users', 'schema'],
    category: 'sql',
    author: 'VibeCode',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: true,
    usageCount: 0
  }
]

export class SnippetManager {
  private snippets: Map<string, CodeSnippet> = new Map()
  private categories: Map<string, SnippetCategory> = new Map()

  constructor() {
    // Initialize with default snippets
    defaultSnippets.forEach(snippet => {
      this.snippets.set(snippet.id, snippet)
    })

    // Initialize categories
    snippetCategories.forEach(category => {
      this.categories.set(category.id, category)
    })
  }

  // Snippet CRUD operations
  createSnippet(snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): CodeSnippet {
    const newSnippet: CodeSnippet = {
      ...snippet,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    }
    this.snippets.set(newSnippet.id, newSnippet)
    return newSnippet
  }

  getSnippet(id: string): CodeSnippet | undefined {
    return this.snippets.get(id)
  }

  getAllSnippets(): CodeSnippet[] {
    return Array.from(this.snippets.values())
  }

  getSnippetsByCategory(category: string): CodeSnippet[] {
    return Array.from(this.snippets.values()).filter(snippet => snippet.category === category)
  }

  getSnippetsByLanguage(language: string): CodeSnippet[] {
    return Array.from(this.snippets.values()).filter(snippet => snippet.language === language)
  }

  searchSnippets(query: string): CodeSnippet[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.snippets.values()).filter(snippet =>
      snippet.name.toLowerCase().includes(lowercaseQuery) ||
      snippet.description.toLowerCase().includes(lowercaseQuery) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      snippet.code.toLowerCase().includes(lowercaseQuery)
    )
  }

  updateSnippet(id: string, updates: Partial<CodeSnippet>): CodeSnippet | null {
    const snippet = this.snippets.get(id)
    if (!snippet) return null

    const updatedSnippet = {
      ...snippet,
      ...updates,
      updatedAt: new Date()
    }
    this.snippets.set(id, updatedSnippet)
    return updatedSnippet
  }

  deleteSnippet(id: string): boolean {
    return this.snippets.delete(id)
  }

  incrementUsage(id: string): void {
    const snippet = this.snippets.get(id)
    if (snippet) {
      snippet.usageCount++
      this.snippets.set(id, snippet)
    }
  }

  // Category operations
  getCategories(): SnippetCategory[] {
    return Array.from(this.categories.values())
  }

  getCategory(id: string): SnippetCategory | undefined {
    return this.categories.get(id)
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  exportSnippets(): string {
    const snippets = Array.from(this.snippets.values())
    return JSON.stringify(snippets, null, 2)
  }

  importSnippets(jsonData: string): boolean {
    try {
      const snippets = JSON.parse(jsonData)
      if (Array.isArray(snippets)) {
        snippets.forEach(snippet => {
          if (snippet.id && snippet.name && snippet.code) {
            this.snippets.set(snippet.id, snippet)
          }
        })
        return true
      }
      return false
    } catch {
      return false
    }
  }
}

// Singleton instance
export const snippetManager = new SnippetManager()