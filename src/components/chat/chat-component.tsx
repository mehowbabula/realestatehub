'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/hooks/use-socket'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Users, MessageCircle, Loader2 } from 'lucide-react'

interface Conversation {
  id: string
  title?: string
  isGroup: boolean
  participants?: Array<{
    id: string
    name: string
    role: string
  }>
  messages?: Array<{
    id: string
    content: string
    createdAt: string
    sender: {
      id: string
      name: string
    }
  }>
}

export default function ChatComponent() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { 
    connected, 
    messages, 
    typingUsers, 
    error: socketError, 
    sendMessage, 
    startTyping, 
    stopTyping 
  } = useSocket({ conversationId: selectedConversation || undefined })

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/conversations')
        if (!response.ok) throw new Error('Failed to load conversations')
        
        const data = await response.json()
        setConversations(data.conversations || [])
        
        // Auto-select first conversation if available
        if (data.conversations?.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0].id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      loadConversations()
    }
  }, [session?.user, selectedConversation])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || !connected) return

    sendMessage(newMessage.trim())
    setNewMessage('')
    stopTyping()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (e.target.value.length > 0) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.title) return conversation.title
    if (conversation.participants?.length) {
      const otherParticipants = conversation.participants.filter(
        p => p.id !== (session?.user as any)?.id
      )
      return otherParticipants.map(p => p.name).join(', ') || 'Conversation'
    }
    return 'Conversation'
  }

  if (!session?.user) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <CardContent>
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Please log in to use messaging</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <CardContent>
          <div className="text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || socketError) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-destructive mb-4">{error || socketError}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-background">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-muted/20">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Conversations
          </h3>
        </div>
        <div className="overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Messages from your property inquiries will appear here</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {conversation.isGroup ? <Users className="h-4 w-4" /> : 
                       getConversationTitle(conversation).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getConversationTitle(conversation)}
                    </p>
                    {conversation.isGroup && (
                      <Badge variant="secondary" className="text-xs">
                        Group
                      </Badge>
                    )}
                  </div>
                </div>
                {conversation.messages && conversation.messages.length > 0 && (
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.messages[0].content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {getConversationTitle(
                      conversations.find(c => c.id === selectedConversation) || 
                      { id: selectedConversation, isGroup: false }
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    {connected ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Send a message to start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === (session.user as any)?.id
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        {!isOwnMessage && (
                          <p className="text-xs text-muted-foreground mb-1">
                            {message.sender.name}
                          </p>
                        )}
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.createdAt)}
                            {message.readAt && isOwnMessage && ' • Read'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}

              {/* Typing Indicators */}
              {typingUsers.filter(user => user.isTyping && user.userId !== (session.user as any)?.id).length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">typing...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-muted/10">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  disabled={!connected}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || !connected}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/5">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Real-Time Messaging</p>
              <p className="text-sm">Select a conversation to start messaging</p>
              <p className="text-xs mt-2">Messages are encrypted and delivered instantly</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
