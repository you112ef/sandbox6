import { NextRequest, NextResponse } from 'next/server'
import { aiClient } from '@/lib/ai'
import { getModel, getFallbackModel } from '@/lib/ai-models'

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'gpt-4o', provider = 'openai', temperature = 0.7, maxTokens = 4000 } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get the AI model
    const aiModel = getModel(provider, model) || getFallbackModel()
    
    if (!aiModel) {
      return NextResponse.json(
        { error: 'Invalid model or provider' },
        { status: 400 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Get AI response using the selected model
    const response = await aiClient.chat(message, {
      model,
      temperature,
      maxTokens,
      systemPrompt: 'You are a helpful AI coding assistant. Provide clear, concise, and accurate responses.'
    })

    return NextResponse.json({ 
      response: response.content,
      model: response.model,
      provider,
      usage: response.usage,
      timestamp: response.timestamp
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}