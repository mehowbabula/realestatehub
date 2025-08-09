'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useSocket } from '@/hooks/use-socket'
import { Send, MessageCircle, Users } from 'lucide-react'

interface ChatProps {
  conversationId?: string
  className?: string
}

export default function ChatComponent({ conversationId, className }: ChatProps) {
  const { data: session } = useSession()
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const {
    connected,
    messages,
    typingUsers,
    error,
    sendMessage,
    startTyping,
    stopTyping
  } = useSocket({ conversationId })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !conversationId) return

    sendMessage(messageInput)
    setMessageInput('')
    stopTyping()
    setIsTyping(false)
  }

  const handleInputChange = (value: string) => {
    setMessageInput(value)
    
    if (value.trim() && !isTyping) {
      startTyping()
      setIsTyping(true)
    } else if (!value.trim() && isTyping) {
      stopTyping()
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!session?.user) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please log in to access chat</p>
        </CardContent>
      </Card>
    )
  }

  if (!conversationId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Real-time Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <MessageCircle className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-muted-foreground">No conversation selected</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create or join a conversation to start chatting
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Real-time Chat
          </div>
          <div className="flex items-center gap-2">
            {connected ? (
              <Badge variant="default" className="bg-green-500">
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                Disconnected
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-destructive/15 text-destructive px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="h-64 w-full border rounded-md p-3" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No messages yet</p>
                <p className="text-xs mt-1">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === (session.user as any)?.id
                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwn && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={message.sender.image} />
                        <AvatarFallback className="text-xs">
                          {message.sender.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[70%] ${isOwn ? 'text-right' : 'text-left'}`}>
                      {!isOwn && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {message.sender.name}
                        </p>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                        {message.readAt && isOwn && ' • Read'}
                      </p>
                    </div>
                    
                    {isOwn && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={session.user?.image || ''} />
                        <AvatarFallback className="text-xs">
                          {session.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )
              })
            )}
            
            {/* Typing indicators */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span>
                  {typingUsers.length === 1 ? 'Someone is typing...' : `${typingUsers.length} people are typing...`}
                </span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!connected}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!connected || !messageInput.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Connection Status */}
        <div className="text-xs text-muted-foreground text-center">
          {connected ? (
            <>
              <Users className="h-3 w-3 inline mr-1" />
              Real-time messaging active
            </>
          ) : (
            'Connecting to real-time messaging...'
          )}
        </div>
      </CardContent>
    </Card>
  )
}
