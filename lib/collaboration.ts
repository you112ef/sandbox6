import { Server as SocketIOServer } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

export interface CollaborationUser {
  id: string
  name: string
  color: string
  cursor: {
    line: number
    column: number
  }
  selection?: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
  }
}

export interface CollaborationEvent {
  type: 'cursor' | 'selection' | 'edit' | 'user_join' | 'user_leave'
  userId: string
  data: any
  timestamp: number
}

export interface CollaborationRoom {
  id: string
  name: string
  users: Map<string, CollaborationUser>
  code: string
  language: string
  createdAt: Date
  lastActivity: Date
}

export class CollaborationManager {
  private rooms: Map<string, CollaborationRoom> = new Map()
  private userRooms: Map<string, string> = new Map()

  createRoom(name: string, userId: string, userName: string): CollaborationRoom {
    const roomId = uuidv4()
    const room: CollaborationRoom = {
      id: roomId,
      name,
      users: new Map(),
      code: '',
      language: 'javascript',
      createdAt: new Date(),
      lastActivity: new Date()
    }

    this.rooms.set(roomId, room)
    this.userRooms.set(userId, roomId)
    this.joinRoom(roomId, userId, userName)

    return room
  }

  joinRoom(roomId: string, userId: string, userName: string): boolean {
    const room = this.rooms.get(roomId)
    if (!room) return false

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
    const color = colors[room.users.size % colors.length]

    const user: CollaborationUser = {
      id: userId,
      name: userName,
      color,
      cursor: { line: 0, column: 0 }
    }

    room.users.set(userId, user)
    this.userRooms.set(userId, roomId)
    room.lastActivity = new Date()

    return true
  }

  leaveRoom(userId: string): boolean {
    const roomId = this.userRooms.get(userId)
    if (!roomId) return false

    const room = this.rooms.get(roomId)
    if (!room) return false

    room.users.delete(userId)
    this.userRooms.delete(userId)
    room.lastActivity = new Date()

    // Clean up empty rooms
    if (room.users.size === 0) {
      this.rooms.delete(roomId)
    }

    return true
  }

  updateCursor(userId: string, cursor: { line: number; column: number }): boolean {
    const roomId = this.userRooms.get(userId)
    if (!roomId) return false

    const room = this.rooms.get(roomId)
    if (!room) return false

    const user = room.users.get(userId)
    if (!user) return false

    user.cursor = cursor
    room.lastActivity = new Date()

    return true
  }

  updateSelection(userId: string, selection: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
  }): boolean {
    const roomId = this.userRooms.get(userId)
    if (!roomId) return false

    const room = this.rooms.get(roomId)
    if (!room) return false

    const user = room.users.get(userId)
    if (!user) return false

    user.selection = selection
    room.lastActivity = new Date()

    return true
  }

  updateCode(roomId: string, code: string, language: string): boolean {
    const room = this.rooms.get(roomId)
    if (!room) return false

    room.code = code
    room.language = language
    room.lastActivity = new Date()

    return true
  }

  getRoom(roomId: string): CollaborationRoom | undefined {
    return this.rooms.get(roomId)
  }

  getUserRoom(userId: string): string | undefined {
    return this.userRooms.get(userId)
  }

  getAllRooms(): CollaborationRoom[] {
    return Array.from(this.rooms.values())
  }

  cleanupInactiveRooms(maxInactiveMinutes: number = 60): void {
    const now = new Date()
    const inactiveRooms: string[] = []

    this.rooms.forEach((room, roomId) => {
      const inactiveMinutes = (now.getTime() - room.lastActivity.getTime()) / (1000 * 60)
      if (inactiveMinutes > maxInactiveMinutes) {
        inactiveRooms.push(roomId)
      }
    })

    inactiveRooms.forEach(roomId => {
      this.rooms.delete(roomId)
    })
  }
}

// Singleton instance
export const collaborationManager = new CollaborationManager()

// WebSocket event handlers
export function setupCollaborationSocket(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Join room
    socket.on('join_room', (data: { roomId: string; userName: string }) => {
      const { roomId, userName } = data
      const success = collaborationManager.joinRoom(roomId, socket.id, userName)
      
      if (success) {
        socket.join(roomId)
        socket.emit('room_joined', { roomId })
        
        // Notify other users
        socket.to(roomId).emit('user_joined', {
          userId: socket.id,
          userName,
          color: collaborationManager.getRoom(roomId)?.users.get(socket.id)?.color
        })
      } else {
        socket.emit('join_error', { message: 'Failed to join room' })
      }
    })

    // Create room
    socket.on('create_room', (data: { roomName: string; userName: string }) => {
      const { roomName, userName } = data
      const room = collaborationManager.createRoom(roomName, socket.id, userName)
      
      socket.join(room.id)
      socket.emit('room_created', { roomId: room.id, room })
    })

    // Cursor updates
    socket.on('cursor_update', (data: { line: number; column: number }) => {
      const roomId = collaborationManager.getUserRoom(socket.id)
      if (roomId) {
        collaborationManager.updateCursor(socket.id, data)
        socket.to(roomId).emit('user_cursor_update', {
          userId: socket.id,
          cursor: data
        })
      }
    })

    // Selection updates
    socket.on('selection_update', (data: {
      startLine: number
      startColumn: number
      endLine: number
      endColumn: number
    }) => {
      const roomId = collaborationManager.getUserRoom(socket.id)
      if (roomId) {
        collaborationManager.updateSelection(socket.id, data)
        socket.to(roomId).emit('user_selection_update', {
          userId: socket.id,
          selection: data
        })
      }
    })

    // Code updates
    socket.on('code_update', (data: { code: string; language: string }) => {
      const roomId = collaborationManager.getUserRoom(socket.id)
      if (roomId) {
        collaborationManager.updateCode(roomId, data.code, data.language)
        socket.to(roomId).emit('code_changed', {
          code: data.code,
          language: data.language,
          userId: socket.id
        })
      }
    })

    // Disconnect
    socket.on('disconnect', () => {
      const roomId = collaborationManager.getUserRoom(socket.id)
      if (roomId) {
        socket.to(roomId).emit('user_left', { userId: socket.id })
        collaborationManager.leaveRoom(socket.id)
      }
      console.log(`User disconnected: ${socket.id}`)
    })
  })

  // Cleanup inactive rooms every hour
  setInterval(() => {
    collaborationManager.cleanupInactiveRooms(60)
  }, 60 * 60 * 1000)
}