export interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  main: string
  dependencies?: Record<string, string>
  permissions?: string[]
  settings?: PluginSetting[]
  hooks?: string[]
  commands?: PluginCommand[]
  themes?: PluginTheme[]
  languages?: PluginLanguage[]
}

export interface PluginSetting {
  key: string
  name: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect'
  default: any
  options?: { value: any; label: string }[]
  required?: boolean
}

export interface PluginCommand {
  id: string
  name: string
  description: string
  shortcut?: string
  category: string
  handler: (args: any) => Promise<any>
}

export interface PluginTheme {
  id: string
  name: string
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    accent: string
    error: string
    warning: string
    success: string
  }
}

export interface PluginLanguage {
  id: string
  name: string
  extensions: string[]
  grammar: any
  snippets: any[]
}

export interface PluginContext {
  terminal: {
    write: (text: string) => void
    writeln: (text: string) => void
    clear: () => void
  }
  editor: {
    getValue: () => string
    setValue: (value: string) => void
    insertText: (text: string) => void
    getSelection: () => string
    replaceSelection: (text: string) => void
  }
  files: {
    read: (path: string) => Promise<string>
    write: (path: string, content: string) => Promise<void>
    exists: (path: string) => Promise<boolean>
    list: (path: string) => Promise<string[]>
  }
  ai: {
    chat: (message: string, model?: string) => Promise<string>
    generateCode: (prompt: string, language: string) => Promise<string>
    explainCode: (code: string) => Promise<string>
  }
  sandbox: {
    execute: (code: string, language: string) => Promise<any>
    install: (packages: string[]) => Promise<any>
  }
  git: {
    status: () => Promise<any>
    commit: (message: string) => Promise<any>
    push: () => Promise<any>
    pull: () => Promise<any>
  }
  storage: {
    get: (key: string) => any
    set: (key: string, value: any) => void
    remove: (key: string) => void
  }
  events: {
    on: (event: string, handler: Function) => void
    off: (event: string, handler: Function) => void
    emit: (event: string, data: any) => void
  }
  ui: {
    showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
    showModal: (component: any, props?: any) => void
    closeModal: () => void
  }
}

export interface Plugin {
  manifest: PluginManifest
  context: PluginContext
  enabled: boolean
  loaded: boolean
  instance?: any
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private context: PluginContext
  private eventHandlers: Map<string, Function[]> = new Map()

  constructor(context: PluginContext) {
    this.context = context
  }

  // Plugin lifecycle
  async loadPlugin(manifest: PluginManifest, code: string): Promise<boolean> {
    try {
      // Validate manifest
      if (!this.validateManifest(manifest)) {
        throw new Error('Invalid plugin manifest')
      }

      // Check dependencies
      if (manifest.dependencies) {
        for (const [dep, version] of Object.entries(manifest.dependencies)) {
          if (!this.checkDependency(dep, version)) {
            throw new Error(`Missing dependency: ${dep}@${version}`)
          }
        }
      }

      // Create plugin instance
      const plugin: Plugin = {
        manifest,
        context: this.context,
        enabled: true,
        loaded: false,
        instance: null
      }

      // Execute plugin code
      const pluginExports = await this.executePluginCode(code, plugin)
      plugin.instance = pluginExports
      plugin.loaded = true

      // Register commands
      if (manifest.commands) {
        manifest.commands.forEach(command => {
          this.registerCommand(command)
        })
      }

      // Register hooks
      if (manifest.hooks) {
        manifest.hooks.forEach(hook => {
          this.registerHook(hook, plugin)
        })
      }

      this.plugins.set(manifest.id, plugin)
      this.emit('plugin:loaded', { plugin: manifest })
      
      return true
    } catch (error) {
      console.error(`Failed to load plugin ${manifest.id}:`, error)
      return false
    }
  }

  async unloadPlugin(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return false

    try {
      // Call plugin cleanup if available
      if (plugin.instance && typeof plugin.instance.cleanup === 'function') {
        await plugin.instance.cleanup()
      }

      // Unregister commands
      if (plugin.manifest.commands) {
        plugin.manifest.commands.forEach(command => {
          this.unregisterCommand(command.id)
        })
      }

      // Unregister hooks
      if (plugin.manifest.hooks) {
        plugin.manifest.hooks.forEach(hook => {
          this.unregisterHook(hook, plugin)
        })
      }

      this.plugins.delete(pluginId)
      this.emit('plugin:unloaded', { pluginId })
      
      return true
    } catch (error) {
      console.error(`Failed to unload plugin ${pluginId}:`, error)
      return false
    }
  }

  async enablePlugin(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return false

    plugin.enabled = true
    this.emit('plugin:enabled', { pluginId })
    return true
  }

  async disablePlugin(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return false

    plugin.enabled = false
    this.emit('plugin:disabled', { pluginId })
    return true
  }

  // Plugin execution
  private async executePluginCode(code: string, plugin: Plugin): Promise<any> {
    // Create a safe execution environment
    const sandbox = {
      console,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      Promise,
      Date,
      Math,
      JSON,
      // Plugin API
      context: plugin.context,
      manifest: plugin.manifest,
      // Plugin lifecycle hooks
      onLoad: () => {},
      onUnload: () => {},
      onEnable: () => {},
      onDisable: () => {},
      // Utility functions
      require: (module: string) => {
        // Allow only safe modules
        const allowedModules = ['path', 'url', 'crypto']
        if (allowedModules.includes(module)) {
          return require(module)
        }
        throw new Error(`Module ${module} is not allowed`)
      }
    }

    // Execute plugin code in sandbox
    const func = new Function('sandbox', `
      with (sandbox) {
        ${code}
      }
    `)
    
    func(sandbox)
    
    return sandbox
  }

  // Command system
  private registerCommand(command: PluginCommand): void {
    // Register command with the command system
    this.emit('command:register', { command })
  }

  private unregisterCommand(commandId: string): void {
    this.emit('command:unregister', { commandId })
  }

  // Hook system
  private registerHook(hook: string, plugin: Plugin): void {
    if (!this.eventHandlers.has(hook)) {
      this.eventHandlers.set(hook, [])
    }
    
    const handlers = this.eventHandlers.get(hook)!
    handlers.push((data: any) => {
      if (plugin.enabled && plugin.instance && typeof plugin.instance[hook] === 'function') {
        plugin.instance[hook](data)
      }
    })
  }

  private unregisterHook(hook: string, plugin: Plugin): void {
    const handlers = this.eventHandlers.get(hook)
    if (handlers) {
      const index = handlers.findIndex(handler => handler === plugin.instance?.[hook])
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // Event system
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }

  emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error)
        }
      })
    }
  }

  // Plugin management
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  getEnabledPlugins(): Plugin[] {
    return Array.from(this.plugins.values()).filter(plugin => plugin.enabled)
  }

  // Validation
  private validateManifest(manifest: PluginManifest): boolean {
    const required = ['id', 'name', 'version', 'description', 'author', 'main']
    return required.every(field => manifest[field as keyof PluginManifest])
  }

  private checkDependency(dependency: string, version: string): boolean {
    // Check if dependency is available
    // This would integrate with the actual dependency system
    return true
  }

  // Plugin discovery
  async discoverPlugins(): Promise<PluginManifest[]> {
    // This would scan for plugin manifests in the plugins directory
    return []
  }

  // Settings management
  getPluginSettings(pluginId: string): Record<string, any> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return {}

    const settings: Record<string, any> = {}
    if (plugin.manifest.settings) {
      plugin.manifest.settings.forEach(setting => {
        settings[setting.key] = this.context.storage.get(`plugin.${pluginId}.${setting.key}`) ?? setting.default
      })
    }
    return settings
  }

  setPluginSetting(pluginId: string, key: string, value: any): void {
    this.context.storage.set(`plugin.${pluginId}.${key}`, value)
  }

  // Plugin communication
  async callPluginMethod(pluginId: string, method: string, ...args: any[]): Promise<any> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin || !plugin.enabled || !plugin.instance) {
      throw new Error(`Plugin ${pluginId} is not available`)
    }

    if (typeof plugin.instance[method] !== 'function') {
      throw new Error(`Method ${method} not found in plugin ${pluginId}`)
    }

    return await plugin.instance[method](...args)
  }
}

// Built-in plugins
export const builtInPlugins: PluginManifest[] = [
  {
    id: 'code-formatter',
    name: 'Code Formatter',
    version: '1.0.0',
    description: 'Format code using Prettier',
    author: 'VibeCode',
    main: 'formatter.js',
    commands: [
      {
        id: 'format-code',
        name: 'Format Code',
        description: 'Format the current file',
        shortcut: 'Ctrl+Shift+F',
        category: 'editor',
        handler: async (args: any) => {
          // Format code logic
        }
      }
    ]
  },
  {
    id: 'code-linter',
    name: 'Code Linter',
    version: '1.0.0',
    description: 'Lint code for errors and warnings',
    author: 'VibeCode',
    main: 'linter.js',
    commands: [
      {
        id: 'lint-code',
        name: 'Lint Code',
        description: 'Lint the current file',
        shortcut: 'Ctrl+Shift+L',
        category: 'editor',
        handler: async (args: any) => {
          // Lint code logic
        }
      }
    ]
  },
  {
    id: 'git-integration',
    name: 'Git Integration',
    version: '1.0.0',
    description: 'Enhanced Git operations',
    author: 'VibeCode',
    main: 'git.js',
    commands: [
      {
        id: 'git-status',
        name: 'Git Status',
        description: 'Show Git status',
        shortcut: 'Ctrl+Shift+G',
        category: 'git',
        handler: async (args: any) => {
          // Git status logic
        }
      }
    ]
  }
]

// Singleton instance
export const pluginManager = new PluginManager({
  terminal: {
    write: (text: string) => console.log(text),
    writeln: (text: string) => console.log(text),
    clear: () => console.clear()
  },
  editor: {
    getValue: () => '',
    setValue: (value: string) => {},
    insertText: (text: string) => {},
    getSelection: () => '',
    replaceSelection: (text: string) => {}
  },
  files: {
    read: async (path: string) => '',
    write: async (path: string, content: string) => {},
    exists: async (path: string) => false,
    list: async (path: string) => []
  },
  ai: {
    chat: async (message: string, model?: string) => '',
    generateCode: async (prompt: string, language: string) => '',
    explainCode: async (code: string) => ''
  },
  sandbox: {
    execute: async (code: string, language: string) => ({}),
    install: async (packages: string[]) => ({})
  },
  git: {
    status: async () => ({}),
    commit: async (message: string) => ({}),
    push: async () => ({}),
    pull: async () => ({})
  },
  storage: {
    get: (key: string) => null,
    set: (key: string, value: any) => {},
    remove: (key: string) => {}
  },
  events: {
    on: (event: string, handler: Function) => {},
    off: (event: string, handler: Function) => {},
    emit: (event: string, data: any) => {}
  },
  ui: {
    showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => {},
    showModal: (component: any, props?: any) => {},
    closeModal: () => {}
  }
})