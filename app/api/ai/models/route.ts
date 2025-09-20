import { NextResponse } from 'next/server'
import { getAllModels } from '@/lib/ai-models'

export async function GET() {
  try {
    const models = getAllModels()
    
    return NextResponse.json(models)
  } catch (error) {
    console.error('Failed to get AI models:', error)
    return NextResponse.json(
      { error: 'Failed to get AI models' },
      { status: 500 }
    )
  }
}