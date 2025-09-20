import "server-only"

import { createOllama } from "ollama-ai-provider-v2"
import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { anthropic } from "@ai-sdk/anthropic"
import { xai } from "@ai-sdk/xai"
import { openrouter } from "@openrouter/ai-sdk-provider"
import { createGroq } from "@ai-sdk/groq"
import { mistral } from "@ai-sdk/mistral"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { LanguageModel } from "ai"

// Initialize AI providers
const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/api",
})

const groq = createGroq({
  baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

// All available AI models from better-chatbot4
export const aiModels = {
  // OpenAI Models
  openai: {
    "gpt-4o": openai("gpt-4o"),
    "gpt-4o-mini": openai("gpt-4o-mini"),
    "gpt-4-turbo": openai("gpt-4-turbo"),
    "gpt-4": openai("gpt-4"),
    "gpt-3.5-turbo": openai("gpt-3.5-turbo"),
    "gpt-4.1": openai("gpt-4.1"),
    "gpt-4.1-mini": openai("gpt-4.1-mini"),
    "o4-mini": openai("o4-mini"),
    "o3": openai("o3"),
    "gpt-5": openai("gpt-5"),
    "gpt-5-mini": openai("gpt-5-mini"),
    "gpt-5-nano": openai("gpt-5-nano"),
  },

  // Google Models
  google: {
    "gemini-2.0-flash-exp": google("gemini-2.0-flash-exp"),
    "gemini-2.5-flash-lite": google("gemini-2.5-flash-lite"),
    "gemini-2.5-flash": google("gemini-2.5-flash"),
    "gemini-2.5-pro": google("gemini-2.5-pro"),
    "gemini-1.5-pro": google("gemini-1.5-pro"),
    "gemini-1.5-flash": google("gemini-1.5-flash"),
    "gemini-pro": google("gemini-pro"),
  },

  // Anthropic Models
  anthropic: {
    "claude-4-sonnet": anthropic("claude-4-sonnet-20250514"),
    "claude-4-opus": anthropic("claude-4-opus-20250514"),
    "claude-3.5-sonnet": anthropic("claude-3-5-sonnet-20241022"),
    "claude-3-opus": anthropic("claude-3-opus-20240229"),
    "claude-3-sonnet": anthropic("claude-3-sonnet-20240229"),
    "claude-3-haiku": anthropic("claude-3-haiku-20240307"),
    "claude-3-7-sonnet": anthropic("claude-3-7-sonnet-20250219"),
  },

  // xAI Models (Grok)
  xai: {
    "grok-4": xai("grok-4"),
    "grok-3": xai("grok-3"),
    "grok-3-mini": xai("grok-3-mini"),
    "grok-2": xai("grok-2"),
    "grok-1": xai("grok-1"),
  },

  // Groq Models
  groq: {
    "llama-3.3-70b": groq("llama-3.3-70b-versatile"),
    "llama-3.3-8b": groq("llama-3.3-8b-instant"),
    "llama-3.1-70b": groq("llama-3.1-70b-versatile"),
    "llama-3.1-8b": groq("llama-3.1-8b-instant"),
    "mixtral-8x7b": groq("mixtral-8x7b-32768"),
    "gemma-2-9b": groq("gemma-2-9b-it"),
    "gemma-2-27b": groq("gemma-2-27b-it"),
    "kimi-k2-instruct": groq("moonshotai/kimi-k2-instruct"),
    "llama-4-scout-17b": groq("meta-llama/llama-4-scout-17b-16e-instruct"),
    "gpt-oss-20b": groq("openai/gpt-oss-20b"),
    "gpt-oss-120b": groq("openai/gpt-oss-120b"),
    "qwen3-32b": groq("qwen/qwen3-32b"),
  },

  // Mistral Models
  mistral: {
    "mistral-large": mistral("mistral-large-latest"),
    "mistral-medium": mistral("mistral-medium-latest"),
    "mistral-small": mistral("mistral-small-latest"),
    "mistral-nemo": mistral("mistral-nemo"),
    "mistral-7b": mistral("mistral-7b-instruct"),
    "mixtral-8x7b": mistral("mixtral-8x7b-instruct"),
    "mixtral-8x22b": mistral("mixtral-8x22b-instruct"),
  },

  // Ollama Models (Local)
  ollama: {
    "llama3.2": ollama("llama3.2"),
    "llama3.2:3b": ollama("llama3.2:3b"),
    "llama3.2:1b": ollama("llama3.2:1b"),
    "llama3.1": ollama("llama3.1"),
    "llama3.1:8b": ollama("llama3.1:8b"),
    "llama3.1:70b": ollama("llama3.1:70b"),
    "gemma3:1b": ollama("gemma3:1b"),
    "gemma3:4b": ollama("gemma3:4b"),
    "gemma3:12b": ollama("gemma3:12b"),
    "qwen2.5": ollama("qwen2.5"),
    "qwen2.5:7b": ollama("qwen2.5:7b"),
    "qwen2.5:14b": ollama("qwen2.5:14b"),
    "qwen2.5:32b": ollama("qwen2.5:32b"),
    "codellama": ollama("codellama"),
    "codellama:7b": ollama("codellama:7b"),
    "codellama:13b": ollama("codellama:13b"),
    "codellama:34b": ollama("codellama:34b"),
    "phi3": ollama("phi3"),
    "phi3:mini": ollama("phi3:mini"),
    "phi3:medium": ollama("phi3:medium"),
    "deepseek-coder": ollama("deepseek-coder"),
    "deepseek-coder:6.7b": ollama("deepseek-coder:6.7b"),
    "deepseek-coder:33b": ollama("deepseek-coder:33b"),
  },

  // OpenRouter Models (Free and Paid)
  openRouter: {
    // Free Models
    "gpt-oss-20b:free": openrouter("openai/gpt-oss-20b:free"),
    "qwen3-8b:free": openrouter("qwen/qwen3-8b:free"),
    "qwen3-14b:free": openrouter("qwen/qwen3-14b:free"),
    "qwen3-coder:free": openrouter("qwen/qwen3-coder:free"),
    "deepseek-r1:free": openrouter("deepseek/deepseek-r1-0528:free"),
    "deepseek-v3:free": openrouter("deepseek/deepseek-chat-v3-0324:free"),
    "gemini-2.0-flash-exp:free": openrouter("google/gemini-2.0-flash-exp:free"),
    
    // Paid Models
    "gpt-4o": openrouter("openai/gpt-4o"),
    "gpt-4o-mini": openrouter("openai/gpt-4o-mini"),
    "claude-3.5-sonnet": openrouter("anthropic/claude-3-5-sonnet"),
    "claude-3-opus": openrouter("anthropic/claude-3-opus"),
    "gemini-2.0-flash": openrouter("google/gemini-2.0-flash"),
    "llama-3.1-70b": openrouter("meta-llama/llama-3-1-70b-instruct"),
    "mixtral-8x7b": openrouter("mistralai/mixtral-8x7b-instruct"),
  },
}

// Models that don't support tool calling
export const unsupportedToolCallModels = new Set([
  aiModels.openai["o4-mini"],
  aiModels.ollama["gemma3:1b"],
  aiModels.ollama["gemma3:4b"],
  aiModels.ollama["gemma3:12b"],
  aiModels.openRouter["gpt-oss-20b:free"],
  aiModels.openRouter["qwen3-8b:free"],
  aiModels.openRouter["qwen3-14b:free"],
  aiModels.openRouter["deepseek-r1:free"],
  aiModels.openRouter["gemini-2.0-flash-exp:free"],
])

// Check if a model supports tool calling
export const isToolCallSupported = (model: any): boolean => {
  return !unsupportedToolCallModels.has(model)
}

// Get all available models with metadata
export const getAllModels = () => {
  return Object.entries(aiModels).map(([provider, models]) => ({
    provider,
    models: Object.entries(models).map(([name, model]) => ({
      name,
      model,
      supportsToolCall: isToolCallSupported(model),
    })),
    hasAPIKey: checkProviderAPIKey(provider as keyof typeof aiModels),
  }))
}

// Check if provider has API key configured
function checkProviderAPIKey(provider: keyof typeof aiModels): boolean {
  let key: string | undefined
  
  switch (provider) {
    case "openai":
      key = process.env.OPENAI_API_KEY
      break
    case "google":
      key = process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
      break
    case "anthropic":
      key = process.env.ANTHROPIC_API_KEY
      break
    case "xai":
      key = process.env.XAI_API_KEY
      break
    case "ollama":
      key = process.env.OLLAMA_API_KEY || "local" // Ollama can run locally
      break
    case "groq":
      key = process.env.GROQ_API_KEY
      break
    case "mistral":
      key = process.env.MISTRAL_API_KEY
      break
    case "openRouter":
      key = process.env.OPENROUTER_API_KEY
      break
    default:
      return true // Assume provider has API key
  }
  
  return !!key && key !== "****"
}

// Get model by provider and name
export const getModel = (provider: string, modelName: string): LanguageModel | null => {
  const providerModels = aiModels[provider as keyof typeof aiModels]
  if (!providerModels) return null
  
  return providerModels[modelName as keyof typeof providerModels] || null
}

// Get fallback model
export const getFallbackModel = (): LanguageModel => {
  return aiModels.openai["gpt-4o"] || aiModels.openai["gpt-3.5-turbo"]
}

// Model categories for UI organization
export const modelCategories = {
  "OpenAI": ["openai"],
  "Google": ["google"],
  "Anthropic": ["anthropic"],
  "xAI (Grok)": ["xai"],
  "Groq": ["groq"],
  "Mistral": ["mistral"],
  "Local (Ollama)": ["ollama"],
  "OpenRouter": ["openRouter"],
}

// Model capabilities
export const modelCapabilities = {
  "gpt-4o": { maxTokens: 128000, supportsVision: true, supportsTools: true },
  "gpt-4o-mini": { maxTokens: 128000, supportsVision: true, supportsTools: true },
  "claude-3.5-sonnet": { maxTokens: 200000, supportsVision: true, supportsTools: true },
  "claude-3-opus": { maxTokens: 200000, supportsVision: true, supportsTools: true },
  "gemini-2.0-flash-exp": { maxTokens: 1000000, supportsVision: true, supportsTools: true },
  "grok-4": { maxTokens: 128000, supportsVision: false, supportsTools: true },
  "llama-3.3-70b": { maxTokens: 128000, supportsVision: false, supportsTools: true },
  "mistral-large": { maxTokens: 128000, supportsVision: false, supportsTools: true },
}

export default aiModels