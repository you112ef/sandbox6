'use client'

import { useRef, useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { 
  Play, 
  Save, 
  Copy, 
  Settings, 
  Maximize2, 
  Minimize2,
  FileText,
  Terminal,
  Bug
} from 'lucide-react'

interface CodeEditorProps {
  className?: string
}

export default function CodeEditor({ className = '' }: CodeEditorProps) {
  const [code, setCode] = useState(`// Welcome to VibeCode Terminal
// AI-Powered Development Environment

import React from 'react'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="app">
      <h1>Hello VibeCode!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

export default App`)
  
  const [language, setLanguage] = useState('typescript')
  const [theme, setTheme] = useState('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')

  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'line',
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      cursorBlinking: 'blink',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun()
    })

    // Configure TypeScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    })

    // Add custom themes
    monaco.editor.defineTheme('vibecode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'regexp', foreground: 'D16969' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
        { token: 'interface', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'constant', foreground: '4FC1FF' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'delimiter', foreground: 'D4D4D4' },
        { token: 'tag', foreground: '569CD6' },
        { token: 'attribute.name', foreground: '92C5F' },
        { token: 'attribute.value', foreground: 'CE9178' }
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editorLineNumber.foreground': '#6e7681',
        'editorLineNumber.activeForeground': '#c9d1d9',
        'editor.selectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f78',
        'editorCursor.foreground': '#58a6ff',
        'editorWhitespace.foreground': '#484f58',
        'editorIndentGuide.background': '#21262d',
        'editorIndentGuide.activeBackground': '#30363d',
        'editorBracketMatch.background': '#0e639c',
        'editorBracketMatch.border': '#888888',
        'editor.findMatchBackground': '#515c6a',
        'editor.findMatchHighlightBackground': '#ea5c0055',
        'editor.hoverHighlightBackground': '#264f78',
        'editor.lineHighlightBackground': '#161b22',
        'editor.rangeHighlightBackground': '#264f78',
        'editor.wordHighlightBackground': '#575757b8',
        'editor.wordHighlightStrongBackground': '#004972b8',
        'editor.wordHighlightBorder': '#007acc00',
        'editor.wordHighlightStrongBorder': '#007acc00',
        'editorBracketHighlight.foreground1': '#FFD700',
        'editorBracketHighlight.foreground2': '#DA70D6',
        'editorBracketHighlight.foreground3': '#87CEEB',
        'editorBracketHighlight.foreground4': '#FFD700',
        'editorBracketHighlight.foreground5': '#DA70D6',
        'editorBracketHighlight.foreground6': '#87CEEB',
        'editorBracketHighlight.unexpectedBracket.foreground': '#ff1212cc',
        'editorBracketPairGuide.activeBackground1': '#FFD700',
        'editorBracketPairGuide.activeBackground2': '#DA70D6',
        'editorBracketPairGuide.activeBackground3': '#87CEEB',
        'editorBracketPairGuide.activeBackground4': '#FFD700',
        'editorBracketPairGuide.activeBackground5': '#DA70D6',
        'editorBracketPairGuide.activeBackground6': '#87CEEB',
        'editorBracketPairGuide.background1': '#FFD700',
        'editorBracketPairGuide.background2': '#DA70D6',
        'editorBracketPairGuide.background3': '#87CEEB',
        'editorBracketPairGuide.background4': '#FFD700',
        'editorBracketPairGuide.background5': '#DA70D6',
        'editorBracketPairGuide.background6': '#87CEEB',
        'editorBracketPairGuide.horizontalActiveBackground1': '#FFD700',
        'editorBracketPairGuide.horizontalActiveBackground2': '#DA70D6',
        'editorBracketPairGuide.horizontalActiveBackground3': '#87CEEB',
        'editorBracketPairGuide.horizontalActiveBackground4': '#FFD700',
        'editorBracketPairGuide.horizontalActiveBackground5': '#DA70D6',
        'editorBracketPairGuide.horizontalActiveBackground6': '#87CEEB',
        'editorBracketPairGuide.horizontalBackground1': '#FFD700',
        'editorBracketPairGuide.horizontalBackground2': '#DA70D6',
        'editorBracketPairGuide.horizontalBackground3': '#87CEEB',
        'editorBracketPairGuide.horizontalBackground4': '#FFD700',
        'editorBracketPairGuide.horizontalBackground5': '#DA70D6',
        'editorBracketPairGuide.horizontalBackground6': '#87CEEB'
      }
    })

    monaco.editor.setTheme('vibecode-dark')
  }

  const handleSave = () => {
    console.log('Saving file...')
    // Implement save functionality
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('')
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOutput('✓ Code executed successfully in Vercel Sandbox\n✓ Output: Hello VibeCode!\n✓ Count: 0')
    } catch (error) {
      setOutput(`✗ Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  const getLanguageFromFileName = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'py':
        return 'python'
      case 'java':
        return 'java'
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp'
      case 'c':
        return 'c'
      case 'cs':
        return 'csharp'
      case 'go':
        return 'go'
      case 'rs':
        return 'rust'
      case 'php':
        return 'php'
      case 'rb':
        return 'ruby'
      case 'swift':
        return 'swift'
      case 'kt':
        return 'kotlin'
      case 'scala':
        return 'scala'
      case 'html':
        return 'html'
      case 'css':
        return 'css'
      case 'scss':
      case 'sass':
        return 'scss'
      case 'less':
        return 'less'
      case 'json':
        return 'json'
      case 'xml':
        return 'xml'
      case 'yaml':
      case 'yml':
        return 'yaml'
      case 'md':
        return 'markdown'
      case 'sql':
        return 'sql'
      case 'sh':
        return 'shell'
      case 'dockerfile':
        return 'dockerfile'
      default:
        return 'plaintext'
    }
  }

  return (
    <div className={`code-editor h-full flex flex-col bg-editor-bg ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">App.tsx</span>
            <span className="text-xs text-gray-400">• TypeScript</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="p-2 hover:bg-gray-700 rounded flex items-center space-x-1"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-700 rounded flex items-center space-x-1"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="p-2 hover:bg-gray-700 rounded flex items-center space-x-1 disabled:opacity-50"
            title="Run (Ctrl+Enter)"
          >
            <Play className="w-4 h-4" />
          </button>
          
          <button
            className="p-2 hover:bg-gray-700 rounded flex items-center space-x-1"
            title="Debug"
          >
            <Bug className="w-4 h-4" />
          </button>
          
          <button
            className="p-2 hover:bg-gray-700 rounded flex items-center space-x-1"
            title="Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-700 rounded flex items-center space-x-1"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            theme="vibecode-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
              fontSize,
              fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
              lineHeight: 1.5,
              wordWrap: 'on',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              detectIndentation: true,
              renderWhitespace: 'selection',
              renderControlCharacters: true,
              renderIndentGuides: true,
              highlightActiveIndentGuide: true,
              bracketPairColorization: {
                enabled: true
              },
              guides: {
                bracketPairs: true,
                indentation: true
              }
            }}
          />
        </div>

        {/* Output Panel */}
        {output && (
          <div className="w-80 border-l border-gray-700 bg-gray-900">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold">Output</h3>
            </div>
            <div className="p-3">
              <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-gray-800 border-t border-gray-700 text-xs">
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>TypeScript</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Spaces: 2</span>
          <span>Font: 14px</span>
          {isRunning && <span className="text-yellow-400">Running...</span>}
        </div>
      </div>
    </div>
  )
}