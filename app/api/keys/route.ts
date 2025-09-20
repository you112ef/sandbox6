import { NextRequest, NextResponse } from 'next/server'
import { databaseManager } from '@/lib/database'
import { headers } from 'next/headers'

export async function GET() {
  try {
    // In a real app, you'd get the user ID from the session
    const userId = 'user-123' // This would come from authentication
    
    const keys = await databaseManager.getAPIKeysByUser(userId)
    
    // Don't return the actual key values for security
    const safeKeys = keys.map(key => ({
      id: key.id,
      provider: key.provider,
      keyName: key.keyName,
      isActive: key.isActive,
      createdAt: key.createdAt
    }))
    
    return NextResponse.json(safeKeys)
  } catch (error) {
    console.error('Failed to get API keys:', error)
    return NextResponse.json(
      { error: 'Failed to get API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { provider, keyName, keyValue } = await request.json()
    
    if (!provider || !keyName || !keyValue) {
      return NextResponse.json(
        { error: 'Provider, key name, and key value are required' },
        { status: 400 }
      )
    }
    
    // In a real app, you'd get the user ID from the session
    const userId = 'user-123' // This would come from authentication
    
    // Encrypt the API key before storing
    const encryptedKey = await encryptAPIKey(keyValue)
    
    const key = await databaseManager.createAPIKey({
      userId,
      provider,
      keyName,
      encryptedKey,
      isActive: true
    })
    
    return NextResponse.json({
      id: key.id,
      provider: key.provider,
      keyName: key.keyName,
      isActive: key.isActive,
      createdAt: key.createdAt
    })
  } catch (error) {
    console.error('Failed to create API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

async function encryptAPIKey(key: string): Promise<string> {
  // In a real app, you'd use proper encryption
  // For now, we'll just base64 encode it (NOT secure for production)
  return Buffer.from(key).toString('base64')
}

async function decryptAPIKey(encryptedKey: string): Promise<string> {
  // In a real app, you'd use proper decryption
  return Buffer.from(encryptedKey, 'base64').toString()
}