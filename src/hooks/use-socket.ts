'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
  readAt?: string
  sender: {
    id: string
    name: string
    image?: string
  }
}

interface TypingUser {
  userId: string
  isTyping: boolean
}

interface UseSocketOptions {
  conversationId?: string
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { data: session } = useSession()
  const { conversationId } = options
  
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize socket connection
  useEffect(() => {
    if (!session?.user) return

    const initializeSocket = async () => {
      try {
        // Get JWT token for Socket.IO authentication
        const response = await fetch('/api/auth/socket-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        let token = 'mock-token'
        if (response.ok) {
          const data = await response.json()
          token = data.token
        } else {
          console.warn('Failed to get socket token, using mock token')
        }

        const socketInstance = io(process.env.NODE_ENV === 'production' 
          ? process.env.NEXTAUTH_URL || '' 
          : 'http://localhost:5544', {
          auth: { token },
          transports: ['websocket', 'polling']
        })

        socketInstance.on('connect', () => {
          console.log('✅ Connected to Socket.IO server')
          setConnected(true)
          setError(null)
        })

        socketInstance.on('disconnect', () => {
          console.log('🔌 Disconnected from Socket.IO server')
          setConnected(false)
        })

        socketInstance.on('connection:success', (data: any) => {
          console.log('🎉 Socket authentication successful:', data)
        })

        socketInstance.on('error', (errorData: { message: string }) => {
          console.error('❌ Socket error:', errorData.message)
          setError(errorData.message)
        })

        socketInstance.on('conversation:messages', (data: { conversationId: string, messages: Message[], participants?: any[] }) => {
          if (data.conversationId === conversationId) {
            setMessages(data.messages)
          }
        })

        socketInstance.on('message:received', (data: { conversationId: string, message: Message }) => {
          if (data.conversationId === conversationId) {
            setMessages(prev => [...prev, data.message])
          }
        })

        socketInstance.on('typing:update', (data: { conversationId: string, userId: string, isTyping: boolean }) => {
          if (data.conversationId === conversationId) {
            setTypingUsers(prev => {
              const filtered = prev.filter(user => user.userId !== data.userId)
              if (data.isTyping) {
                return [...filtered, { userId: data.userId, isTyping: true }]
              }
              return filtered
            })
          }
        })

        socketInstance.on('message:read_update', (data: { conversationId: string, messageId: string, readBy: string, readAt?: string }) => {
          if (data.conversationId === conversationId) {
            setMessages(prev => prev.map(msg => 
              msg.id === data.messageId 
                ? { ...msg, readAt: data.readAt || new Date().toISOString() }
                : msg
            ))
          }
        })

        setSocket(socketInstance)

        return () => {
          socketInstance.disconnect()
        }

      } catch (error) {
        console.error('Failed to initialize socket:', error)
        setError('Failed to connect to messaging service')
      }
    }

    const cleanup = initializeSocket()
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn())
    }
  }, [session?.user, conversationId])

  // Join conversation room
  useEffect(() => {
    if (socket && connected && conversationId) {
      socket.emit('conversation:join', conversationId)
      
      return () => {
        socket.emit('conversation:leave', conversationId)
      }
    }
  }, [socket, connected, conversationId])

  // Send message
  const sendMessage = (content: string) => {
    if (!socket || !connected || !conversationId || !session?.user) {
      console.error('Cannot send message: socket not connected or missing data')
      return
    }

    socket.emit('message:send', {
      conversationId,
      content,
      senderId: (session.user as any).id
    })
  }

  // Start typing indicator
  const startTyping = () => {
    if (!socket || !connected || !conversationId) return

    socket.emit('typing:start', { conversationId })

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 3000)
  }

  // Stop typing indicator
  const stopTyping = () => {
    if (!socket || !connected || !conversationId) return

    socket.emit('typing:stop', { conversationId })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  // Mark message as read
  const markAsRead = (messageId: string) => {
    if (!socket || !connected || !conversationId) return

    socket.emit('message:read', { conversationId, messageId })
  }

  return {
    socket,
    connected,
    messages,
    typingUsers,
    error,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead
  }
}
