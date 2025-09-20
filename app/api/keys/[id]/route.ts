import { NextRequest, NextResponse } from 'next/server'
import { databaseManager } from '@/lib/database'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isActive } = await request.json()
    
    await databaseManager.updateAPIKey(params.id, { isActive })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update API key:', error)
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await databaseManager.deleteAPIKey(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete API key:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}