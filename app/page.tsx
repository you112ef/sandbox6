'use client'

import { useState, useEffect } from 'react'
import Terminal from '@/components/Terminal'
import FileExplorer from '@/components/FileExplorer'
import CodeEditor from '@/components/CodeEditor'
import AIChat from '@/components/AIChat'
import Toolbar from '@/components/Toolbar'
import CollaborationPanel from '@/components/CollaborationPanel'
import SnippetLibrary from '@/components/SnippetLibrary'
import GitPanel from '@/components/GitPanel'
import PluginManager from '@/components/PluginManager'
import MCPDashboard from '@/components/MCPDashboard'
import VoiceAssistant from '@/components/VoiceAssistant'
import WorkflowEditor from '@/components/WorkflowEditor'
import APIKeyManager from '@/components/APIKeyManager'
import { WorkspaceProvider } from '@/contexts/WorkspaceContext'
import { AIProvider } from '@/contexts/AIContext'

export default function Home() {
  const [activePanel, setActivePanel] = useState<'terminal' | 'editor' | 'chat'>('terminal')
  const [rightPanel, setRightPanel] = useState<'collaboration' | 'snippets' | 'git' | 'plugins' | 'mcp' | 'voice' | 'workflow' | 'apikeys' | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(300)
  const [panelHeight, setPanelHeight] = useState(300)

  return (
    <WorkspaceProvider>
      <AIProvider>
        <div className="h-screen flex flex-col bg-terminal-bg text-terminal-fg">
          {/* Top Toolbar */}
          <Toolbar 
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            rightPanel={rightPanel}
            setRightPanel={setRightPanel}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - File Explorer */}
            <div 
              className="file-explorer flex-shrink-0"
              style={{ width: `${sidebarWidth}px` }}
            >
              <FileExplorer />
            </div>
            
            {/* Resize Handle */}
            <div 
              className="resize-handle vertical"
              onMouseDown={(e) => {
                const startX = e.clientX
                const startWidth = sidebarWidth
                
                const handleMouseMove = (e: MouseEvent) => {
                  const newWidth = startWidth + (e.clientX - startX)
                  setSidebarWidth(Math.max(200, Math.min(600, newWidth)))
                }
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }
                
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Code Editor */}
              <div 
                className="flex-1"
                style={{ height: `calc(100% - ${panelHeight}px)` }}
              >
                <CodeEditor />
              </div>
              
              {/* Resize Handle */}
              <div 
                className="resize-handle horizontal"
                onMouseDown={(e) => {
                  const startY = e.clientY
                  const startHeight = panelHeight
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const newHeight = startHeight - (e.clientY - startY)
                    setPanelHeight(Math.max(200, Math.min(600, newHeight)))
                  }
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }
                  
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
              />
              
              {/* Bottom Panel */}
              <div 
                className="flex-shrink-0"
                style={{ height: `${panelHeight}px` }}
              >
                {activePanel === 'terminal' && <Terminal />}
                {activePanel === 'chat' && <AIChat />}
              </div>
            </div>

            {/* Right Sidebar */}
            {rightPanel && (
              <>
                {/* Resize Handle */}
                <div 
                  className="resize-handle vertical"
                  onMouseDown={(e) => {
                    const startX = e.clientX
                    const startWidth = rightSidebarWidth
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const newWidth = startWidth - (e.clientX - startX)
                      setRightSidebarWidth(Math.max(200, Math.min(600, newWidth)))
                    }
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove)
                      document.removeEventListener('mouseup', handleMouseUp)
                    }
                    
                    document.addEventListener('mousemove', handleMouseMove)
                    document.addEventListener('mouseup', handleMouseUp)
                  }}
                />
                
                {/* Right Panel Content */}
                <div 
                  className="right-sidebar flex-shrink-0"
                  style={{ width: `${rightSidebarWidth}px` }}
                >
                  {rightPanel === 'collaboration' && <CollaborationPanel />}
                  {rightPanel === 'snippets' && <SnippetLibrary />}
                  {rightPanel === 'git' && <GitPanel />}
                  {rightPanel === 'plugins' && <PluginManager />}
                  {rightPanel === 'mcp' && <MCPDashboard />}
                  {rightPanel === 'voice' && <VoiceAssistant />}
                  {rightPanel === 'workflow' && <WorkflowEditor />}
                  {rightPanel === 'apikeys' && <APIKeyManager />}
                </div>
              </>
            )}
          </div>
        </div>
      </AIProvider>
    </WorkspaceProvider>
  )
}