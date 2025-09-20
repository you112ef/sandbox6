import { NextRequest, NextResponse } from 'next/server'

// Mock AI responses for development
const mockAIResponses = {
  'claude-3-sonnet': (message: string) => {
    if (message.toLowerCase().includes('hello')) {
      return 'Hello! I\'m Claude, your AI coding assistant. How can I help you today?'
    }
    if (message.toLowerCase().includes('react')) {
      return `Here's a React component example:

\`\`\`tsx
import React, { useState } from 'react'

const MyComponent = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

export default MyComponent
\`\`\``
    }
    return `I understand you're asking about "${message}". I'm here to help with your coding needs!`
  },
  'gpt-4': (message: string) => {
    if (message.toLowerCase().includes('hello')) {
      return 'Hello! I\'m GPT-4, ready to assist with your development tasks.'
    }
    return `GPT-4 response to: "${message}"`
  },
  'gemini-pro': (message: string) => {
    if (message.toLowerCase().includes('hello')) {
      return 'Hello! I\'m Gemini Pro, your AI assistant for coding and development.'
    }
    return `Gemini Pro response to: "${message}"`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'claude-3-sonnet', temperature = 0.7, maxTokens = 4000 } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Get mock response based on model
    const getResponse = mockAIResponses[model as keyof typeof mockAIResponses]
    if (!getResponse) {
      return NextResponse.json({ error: 'Invalid model specified' }, { status: 400 })
    }

    const response = getResponse(message)

    return NextResponse.json({ 
      response,
      model,
      usage: {
        promptTokens: Math.floor(message.length / 4),
        completionTokens: Math.floor(response.length / 4),
        totalTokens: Math.floor((message.length + response.length) / 4)
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}