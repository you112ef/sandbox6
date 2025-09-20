import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, model, temperature = 0.7, maxTokens = 4000 } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let response: string

    switch (model) {
      case 'gpt-4':
        const gptResponse = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI coding assistant. Help users write, debug, and optimize code. Provide clear, practical solutions with examples.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: maxTokens,
          temperature: temperature,
        })
        response = gptResponse.choices[0]?.message?.content || 'No response generated'
        break

      case 'claude-3-sonnet':
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: maxTokens,
          temperature: temperature,
          messages: [
            {
              role: 'user',
              content: `You are a helpful AI coding assistant. Help users write, debug, and optimize code. Provide clear, practical solutions with examples.\n\nUser message: ${message}`
            }
          ]
        })
        response = claudeResponse.content[0]?.type === 'text' 
          ? claudeResponse.content[0].text 
          : 'No response generated'
        break

      case 'gemini-pro':
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const geminiResponse = await geminiModel.generateContent(
          `You are a helpful AI coding assistant. Help users write, debug, and optimize code. Provide clear, practical solutions with examples.\n\nUser message: ${message}`
        )
        response = geminiResponse.response.text()
        break

      default:
        return NextResponse.json({ error: 'Invalid model specified' }, { status: 400 })
    }

    return NextResponse.json({ 
      response,
      model,
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