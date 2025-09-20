'use client'

import { useState, useEffect } from 'react'
import { CodeSnippet, SnippetCategory, snippetManager } from '@/lib/snippets'
import { Search, Plus, Copy, Star, Tag, Filter, Download, Upload, Trash2, Edit } from 'lucide-react'

interface SnippetLibraryProps {
  className?: string
  onSnippetSelect?: (snippet: CodeSnippet) => void
  onSnippetInsert?: (code: string) => void
}

export default function SnippetLibrary({ 
  className = '', 
  onSnippetSelect,
  onSnippetInsert 
}: SnippetLibraryProps) {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [categories, setCategories] = useState<SnippetCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [newSnippet, setNewSnippet] = useState({
    name: '',
    description: '',
    language: 'javascript',
    code: '',
    tags: '',
    category: 'javascript',
    isPublic: true
  })

  useEffect(() => {
    loadSnippets()
    loadCategories()
  }, [])

  const loadSnippets = () => {
    const allSnippets = snippetManager.getAllSnippets()
    setSnippets(allSnippets)
  }

  const loadCategories = () => {
    const allCategories = snippetManager.getCategories()
    setCategories(allCategories)
  }

  const filteredSnippets = snippets.filter(snippet => {
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const handleSnippetClick = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet)
    snippetManager.incrementUsage(snippet.id)
    if (onSnippetSelect) {
      onSnippetSelect(snippet)
    }
  }

  const handleInsertSnippet = (snippet: CodeSnippet) => {
    if (onSnippetInsert) {
      onSnippetInsert(snippet.code)
    }
  }

  const handleCreateSnippet = () => {
    const tags = newSnippet.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    
    const snippet = snippetManager.createSnippet({
      name: newSnippet.name,
      description: newSnippet.description,
      language: newSnippet.language,
      code: newSnippet.code,
      tags,
      category: newSnippet.category,
      author: 'User',
      isPublic: newSnippet.isPublic
    })

    if (snippet) {
      loadSnippets()
      setShowCreateForm(false)
      setNewSnippet({
        name: '',
        description: '',
        language: 'javascript',
        code: '',
        tags: '',
        category: 'javascript',
        isPublic: true
      })
    }
  }

  const handleDeleteSnippet = (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      snippetManager.deleteSnippet(id)
      loadSnippets()
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(null)
      }
    }
  }

  const handleExport = () => {
    const data = snippetManager.exportSnippets()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'snippets.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (snippetManager.importSnippets(content)) {
          loadSnippets()
          alert('Snippets imported successfully!')
        } else {
          alert('Failed to import snippets. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Code Snippets</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportExport(!showImportExport)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Import/Export"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Create snippet"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search snippets..."
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Import/Export Panel */}
      {showImportExport && (
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export Snippets
              </button>
              <label className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 inline mr-2" />
                Import Snippets
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Create Snippet Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <h4 className="text-white font-medium mb-3">Create New Snippet</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={newSnippet.name}
              onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Snippet name"
            />
            <input
              type="text"
              value={newSnippet.description}
              onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
            <div className="flex gap-2">
              <select
                value={newSnippet.language}
                onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="sql">SQL</option>
              </select>
              <select
                value={newSnippet.category}
                onChange={(e) => setNewSnippet({ ...newSnippet, category: e.target.value })}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={newSnippet.tags}
              onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tags (comma separated)"
            />
            <textarea
              value={newSnippet.code}
              onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Code snippet"
              rows={6}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateSnippet}
                disabled={!newSnippet.name || !newSnippet.code}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Snippet
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snippets List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSnippets.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No snippets found</p>
            {searchQuery && <p className="text-sm">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="p-2">
            {filteredSnippets.map(snippet => (
              <div
                key={snippet.id}
                className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                  selectedSnippet?.id === snippet.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => handleSnippetClick(snippet)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{snippet.name}</h4>
                    <p className="text-xs opacity-75 mt-1">{snippet.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-600 rounded">
                        {snippet.language}
                      </span>
                      {snippet.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleInsertSnippet(snippet)
                      }}
                      className="p-1 hover:bg-gray-500 rounded"
                      title="Insert snippet"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSnippet(snippet.id)
                      }}
                      className="p-1 hover:bg-gray-500 rounded"
                      title="Delete snippet"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                  <span>Used {snippet.usageCount} times</span>
                  <span>{snippet.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Snippet Preview */}
      {selectedSnippet && (
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-white">{selectedSnippet.name}</h4>
            <button
              onClick={() => handleInsertSnippet(selectedSnippet)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Insert
            </button>
          </div>
          <pre className="text-xs text-gray-300 bg-gray-800 p-3 rounded-md overflow-x-auto">
            {selectedSnippet.code}
          </pre>
        </div>
      )}
    </div>
  )
}