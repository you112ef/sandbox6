'use client'

import { useState, useEffect } from 'react'
import { GitStatus, GitCommit, GitBranch, GitDiff, gitManager } from '@/lib/git'
import { 
  GitBranch as GitBranchIcon, 
  GitCommit, 
  GitPullRequest, 
  GitMerge, 
  Plus, 
  Minus, 
  RefreshCw, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  History,
  Diff
} from 'lucide-react'

interface GitPanelProps {
  className?: string
}

export default function GitPanel({ className = '' }: GitPanelProps) {
  const [status, setStatus] = useState<GitStatus | null>(null)
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [branches, setBranches] = useState<GitBranch[]>([])
  const [selectedDiff, setSelectedDiff] = useState<GitDiff | null>(null)
  const [commitMessage, setCommitMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isRepository, setIsRepository] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'status' | 'history' | 'branches' | 'diff'>('status')

  useEffect(() => {
    checkRepository()
  }, [])

  useEffect(() => {
    if (isRepository) {
      loadGitData()
    }
  }, [isRepository])

  const checkRepository = async () => {
    const isRepo = await gitManager.isRepository()
    setIsRepository(isRepo)
  }

  const loadGitData = async () => {
    setLoading(true)
    try {
      const [statusData, commitsData, branchesData] = await Promise.all([
        gitManager.getStatus(),
        gitManager.getCommits(10),
        gitManager.getBranches()
      ])
      
      setStatus(statusData)
      setCommits(commitsData)
      setBranches(branchesData)
    } catch (error) {
      console.error('Failed to load git data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFiles = async (files: string[]) => {
    setLoading(true)
    try {
      const success = await gitManager.addFiles(files)
      if (success) {
        await loadGitData()
      }
    } catch (error) {
      console.error('Failed to add files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommit = async () => {
    if (!commitMessage.trim()) return

    setLoading(true)
    try {
      const success = await gitManager.commit(commitMessage, selectedFiles)
      if (success) {
        setCommitMessage('')
        setSelectedFiles([])
        await loadGitData()
      }
    } catch (error) {
      console.error('Failed to commit:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePush = async () => {
    setLoading(true)
    try {
      const success = await gitManager.push()
      if (success) {
        await loadGitData()
      }
    } catch (error) {
      console.error('Failed to push:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePull = async () => {
    setLoading(true)
    try {
      const success = await gitManager.pull()
      if (success) {
        await loadGitData()
      }
    } catch (error) {
      console.error('Failed to pull:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBranch = async (name: string) => {
    setLoading(true)
    try {
      const success = await gitManager.createBranch(name)
      if (success) {
        await loadGitData()
      }
    } catch (error) {
      console.error('Failed to create branch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchBranch = async (name: string) => {
    setLoading(true)
    try {
      const success = await gitManager.switchBranch(name)
      if (success) {
        await loadGitData()
      }
    } catch (error) {
      console.error('Failed to switch branch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDiff = async (type: 'staged' | 'commit' | 'file', target?: string) => {
    setLoading(true)
    try {
      let diff: GitDiff | null = null

      switch (type) {
        case 'staged':
          diff = await gitManager.getStagedDiff()
          break
        case 'commit':
          if (target) {
            diff = await gitManager.getCommitDiff(target!)
          }
          break
        case 'file':
          if (target) {
            diff = await gitManager.getFileDiff(target)
          }
          break
      }

      if (diff) {
        setSelectedDiff(diff)
        setActiveTab('diff')
      }
    } catch (error) {
      console.error('Failed to get diff:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFileSelection = (file: string) => {
    setSelectedFiles(prev => 
      prev.includes(file) 
        ? prev.filter(f => f !== file)
        : [...prev, file]
    )
  }

  if (!isRepository) {
    return (
      <div className={`bg-gray-800 border-l border-gray-700 p-4 ${className}`}>
        <div className="text-center text-gray-400">
          <GitBranchIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Not a Git repository</p>
          <button
            onClick={async () => {
              const success = await gitManager.initRepository()
              if (success) {
                setIsRepository(true)
              }
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Initialize Repository
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <GitBranchIcon className="w-5 h-5" />
            Git
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={loadGitData}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'status', label: 'Status', icon: CheckCircle },
            { id: 'history', label: 'History', icon: History },
            { id: 'branches', label: 'Branches', icon: GitBranchIcon },
            { id: 'diff', label: 'Diff', icon: Diff }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Tab */}
      {activeTab === 'status' && status && (
        <div className="p-4">
          {/* Branch Info */}
          <div className="mb-4 p-3 bg-gray-700 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">{status.current}</h4>
                {status.tracking && (
                  <p className="text-sm text-gray-400">
                    tracking {status.tracking}
                    {status.ahead > 0 && <span className="text-green-400"> (+{status.ahead})</span>}
                    {status.behind > 0 && <span className="text-red-400"> (-{status.behind})</span>}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePull}
                  disabled={loading}
                  className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                  title="Pull"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePush}
                  disabled={loading}
                  className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                  title="Push"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Files */}
          <div className="space-y-4">
            {/* Staged Files */}
            {status.files.staged.length > 0 && (
              <div>
                <h5 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Staged Changes ({status.files.staged.length})
                </h5>
                <div className="space-y-1">
                  {status.files.staged.map(file => (
                    <div key={file} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="text-sm text-white">{file}</span>
                      <button
                        onClick={() => handleViewDiff('file', file)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="View diff"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modified Files */}
            {status.files.modified.length > 0 && (
              <div>
                <h5 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Modified Files ({status.files.modified.length})
                </h5>
                <div className="space-y-1">
                  {status.files.modified.map(file => (
                    <div key={file} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <label className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file)}
                          onChange={() => toggleFileSelection(file)}
                          className="rounded"
                        />
                        <span className="text-sm text-white">{file}</span>
                      </label>
                      <button
                        onClick={() => handleViewDiff('file', file)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="View diff"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Untracked Files */}
            {status.files.untracked.length > 0 && (
              <div>
                <h5 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Untracked Files ({status.files.untracked.length})
                </h5>
                <div className="space-y-1">
                  {status.files.untracked.map(file => (
                    <div key={file} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <label className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file)}
                          onChange={() => toggleFileSelection(file)}
                          className="rounded"
                        />
                        <span className="text-sm text-white">{file}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conflicts */}
            {status.conflicts.length > 0 && (
              <div>
                <h5 className="font-medium text-red-400 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Conflicts ({status.conflicts.length})
                </h5>
                <div className="space-y-1">
                  {status.conflicts.map(file => (
                    <div key={file} className="p-2 bg-red-900/20 border border-red-500/50 rounded">
                      <span className="text-sm text-red-400">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Commit Section */}
          <div className="mt-6 p-4 bg-gray-700 rounded-md">
            <h5 className="font-medium text-white mb-3">Commit Changes</h5>
            <div className="space-y-3">
              <textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Commit message..."
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddFiles(selectedFiles)}
                  disabled={selectedFiles.length === 0 || loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Selected ({selectedFiles.length})
                </button>
                <button
                  onClick={handleCommit}
                  disabled={!commitMessage.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Commit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="p-4">
          <h5 className="font-medium text-white mb-3">Recent Commits</h5>
          <div className="space-y-2">
            {commits.map(commit => (
              <div key={commit.hash} className="p-3 bg-gray-700 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{commit.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {commit.author.name} • {new Date(commit.date).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-1">{commit.hash.substring(0, 8)}</p>
                  </div>
                  <button
                    onClick={() => handleViewDiff('commit', commit.hash)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="View diff"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-white">Branches</h5>
            <button
              onClick={() => {
                const name = prompt('Branch name:')
                if (name) handleCreateBranch(name)
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              New Branch
            </button>
          </div>
          <div className="space-y-2">
            {branches.map(branch => (
              <div key={branch.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                <div className="flex items-center gap-2">
                  {branch.current && <CheckCircle className="w-4 h-4 text-green-400" />}
                  <span className="text-sm text-white">{branch.name}</span>
                  {branch.ahead > 0 && <span className="text-xs text-green-400">+{branch.ahead}</span>}
                  {branch.behind > 0 && <span className="text-xs text-red-400">-{branch.behind}</span>}
                </div>
                <div className="flex gap-1">
                  {!branch.current && (
                    <button
                      onClick={() => handleSwitchBranch(branch.name)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Switch to branch"
                    >
                      <GitBranchIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diff Tab */}
      {activeTab === 'diff' && selectedDiff && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-white">Diff: {selectedDiff.file}</h5>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Plus className="w-3 h-3 text-green-400" />
                {selectedDiff.stats.insertions}
              </span>
              <span className="flex items-center gap-1">
                <Minus className="w-3 h-3 text-red-400" />
                {selectedDiff.stats.deletions}
              </span>
              <span>{selectedDiff.stats.files} files</span>
            </div>
          </div>
          <div 
            className="bg-gray-900 rounded-md p-4 overflow-auto max-h-96"
            dangerouslySetInnerHTML={{ __html: selectedDiff.html }}
          />
        </div>
      )}
    </div>
  )
}