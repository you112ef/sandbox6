'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { SearchAddon } from 'xterm-addon-search'
import { TerminalManager } from '@/lib/terminal'
import 'xterm/css/xterm.css'

interface TerminalProps {
  className?: string
}

export default function Terminal({ className = '' }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const terminalManagerRef = useRef<TerminalManager | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize terminal
    const terminal = new XTerm({
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        // selection: '#264f78', // Not a valid theme property
        black: '#484f58',
        red: '#f85149',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#b1bac4',
        brightBlack: '#6e7681',
        brightRed: '#ff7b72',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#56d4dd',
        brightWhite: '#f0f6fc',
      },
      fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 4,
    })

    // Add addons
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    const searchAddon = new SearchAddon()

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)
    terminal.loadAddon(searchAddon)

    // Open terminal
    terminal.open(terminalRef.current)
    fitAddon.fit()

    // Store references
    xtermRef.current = terminal
    fitAddonRef.current = fitAddon
    terminalManagerRef.current = new TerminalManager()

    // Initialize shell
    initializeShell(terminal)

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [])

  const initializeShell = (terminal: XTerm) => {
    // Welcome message
    terminal.writeln('\x1b[1;32mVibeCode Terminal\x1b[0m - AI-Powered Development Environment')
    terminal.writeln('Type \x1b[1;36mhelp\x1b[0m for available commands')
    terminal.writeln('')

    let currentLine = ''
    let history: string[] = []
    let historyIndex = -1

    const prompt = () => {
      const cwd = terminalManagerRef.current?.getCurrentDirectory() || '/workspace'
      const shortCwd = cwd === '/workspace' ? '~' : cwd.split('/').pop() || '~'
      terminal.write(`\x1b[1;32mvibecode-user@vibecode\x1b[0m:\x1b[1;34m${shortCwd}\x1b[0m$ `)
    }

    const processCommand = async (command: string) => {
      const trimmed = command.trim()
      if (!trimmed) {
        prompt()
        return
      }

      // Add to history
      history.push(trimmed)
      historyIndex = history.length

      try {
        const outputs = await terminalManagerRef.current?.executeCommand(trimmed) || []
        
        for (const output of outputs) {
          if (output.type === 'stdout') {
            terminal.writeln(output.content)
          } else if (output.type === 'stderr') {
            terminal.writeln(`\x1b[1;31m${output.content}\x1b[0m`)
          }
        }
      } catch (error) {
        terminal.writeln(`\x1b[1;31mError: ${error}\x1b[0m`)
      }

      prompt()
    }

    // Handle input
    terminal.onData((data) => {
      const code = data.charCodeAt(0)

      if (code === 13) { // Enter
        terminal.writeln('')
        processCommand(currentLine)
        currentLine = ''
      } else if (code === 127) { // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1)
          terminal.write('\b \b')
        }
      } else if (code === 27) { // Escape sequences (arrow keys)
        // Handle arrow keys for history navigation
        if (data === '\x1b[A') { // Up arrow
          if (historyIndex > 0) {
            historyIndex--
            // Clear current line and show history
            terminal.write('\x1b[2K\r')
            currentLine = history[historyIndex] || ''
            terminal.write(currentLine)
          }
        } else if (data === '\x1b[B') { // Down arrow
          if (historyIndex < history.length - 1) {
            historyIndex++
            terminal.write('\x1b[2K\r')
            currentLine = history[historyIndex] || ''
            terminal.write(currentLine)
          } else if (historyIndex === history.length - 1) {
            historyIndex = history.length
            terminal.write('\x1b[2K\r')
            currentLine = ''
          }
        }
      } else if (code >= 32 && code <= 126) { // Printable characters
        currentLine += data
        terminal.write(data)
      }
    })

    // Initial prompt
    prompt()
    setIsConnected(true)
  }

  return (
    <div className={`terminal-container h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <span className="text-xs text-gray-400">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>
      <div ref={terminalRef} className="flex-1 p-4" />
    </div>
  )
}