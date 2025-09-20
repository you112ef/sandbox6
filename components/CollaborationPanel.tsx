'use client'

import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { CollaborationUser, CollaborationRoom } from '@/lib/collaboration'
import { Users, Plus, Settings, Share2, Copy, Eye, EyeOff } from 'lucide-react'

interface CollaborationPanelProps {
  className?: string
  onCodeChange?: (code: string, language: string) => void
  onCursorChange?: (cursor: { line: number; column: number }) => void
}

export default function CollaborationPanel({ 
  className = '', 
  onCodeChange,
  onCursorChange 
}: CollaborationPanelProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<CollaborationRoom | null>(null)
  const [users, setUsers] = useState<Map<string, CollaborationUser>>(new Map())
  const [showUsers, setShowUsers] = useState(true)
  const [roomName, setRoomName] = useState('')
  const [userName, setUserName] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [showJoinForm, setShowJoinForm] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    setSocket(newSocket)

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to collaboration server')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from collaboration server')
    })

    // Room events
    newSocket.on('room_created', (data: { roomId: string; room: CollaborationRoom }) => {
      setCurrentRoom(data.room)
      setRoomId(data.roomId)
      setUsers(data.room.users)
      setIsCreatingRoom(false)
    })

    newSocket.on('room_joined', (data: { roomId: string }) => {
      setRoomId(data.roomId)
      setShowJoinForm(false)
    })

    newSocket.on('join_error', (data: { message: string }) => {
      alert(`Failed to join room: ${data.message}`)
      setShowJoinForm(false)
    })

    // User events
    newSocket.on('user_joined', (data: { userId: string; userName: string; color: string }) => {
      const newUser: CollaborationUser = {
        id: data.userId,
        name: data.userName,
        color: data.color,
        cursor: { line: 0, column: 0 }
      }
      setUsers(prev => new Map(prev).set(data.userId, newUser))
    })

    newSocket.on('user_left', (data: { userId: string }) => {
      setUsers(prev => {
        const newUsers = new Map(prev)
        newUsers.delete(data.userId)
        return newUsers
      })
    })

    newSocket.on('user_cursor_update', (data: { userId: string; cursor: { line: number; column: number } }) => {
      setUsers(prev => {
        const newUsers = new Map(prev)
        const user = newUsers.get(data.userId)
        if (user) {
          user.cursor = data.cursor
          newUsers.set(data.userId, user)
        }
        return newUsers
      })
    })

    newSocket.on('user_selection_update', (data: { userId: string; selection: any }) => {
      setUsers(prev => {
        const newUsers = new Map(prev)
        const user = newUsers.get(data.userId)
        if (user) {
          user.selection = data.selection
          newUsers.set(data.userId, user)
        }
        return newUsers
      })
    })

    newSocket.on('code_changed', (data: { code: string; language: string; userId: string }) => {
      if (onCodeChange) {
        onCodeChange(data.code, data.language)
      }
    })

    return () => {
      newSocket.close()
    }
  }, [onCodeChange])

  const createRoom = () => {
    if (!socket || !roomName.trim() || !userName.trim()) return

    setIsCreatingRoom(true)
    socket.emit('create_room', { roomName: roomName.trim(), userName: userName.trim() })
  }

  const joinRoom = () => {
    if (!socket || !roomId.trim() || !userName.trim()) return

    socket.emit('join_room', { roomId: roomId.trim(), userName: userName.trim() })
  }

  const shareRoom = () => {
    if (roomId) {
      const url = `${window.location.origin}?room=${roomId}`
      navigator.clipboard.writeText(url)
      alert('Room link copied to clipboard!')
    }
  }

  const leaveRoom = () => {
    if (socket) {
      socket.disconnect()
      setCurrentRoom(null)
      setUsers(new Map())
      setRoomId('')
    }
  }

  return (
    <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Collaboration
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              {showUsers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowJoinForm(!showJoinForm)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Join/Create Room Form */}
      {showJoinForm && (
        <div className="p-4 border-b border-gray-700">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Room ID (to join existing room)
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Room Name (for new room)
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room name"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={joinRoom}
                disabled={!roomId.trim() || !userName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Join Room
              </button>
              <button
                onClick={createRoom}
                disabled={!roomName.trim() || !userName.trim() || isCreatingRoom}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreatingRoom ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Room Info */}
      {currentRoom && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">{currentRoom.name}</h4>
              <p className="text-sm text-gray-400">Room ID: {currentRoom.id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shareRoom}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Share room"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={leaveRoom}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Leave room"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      {showUsers && (
        <div className="p-4">
          <h4 className="font-medium text-white mb-3">
            Online Users ({users.size})
          </h4>
          <div className="space-y-2">
            {Array.from(users.values()).map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 bg-gray-700 rounded-md"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <span className="text-sm text-white">{user.name}</span>
                {user.cursor && (
                  <span className="text-xs text-gray-400 ml-auto">
                    Line {user.cursor.line + 1}, Col {user.cursor.column + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}