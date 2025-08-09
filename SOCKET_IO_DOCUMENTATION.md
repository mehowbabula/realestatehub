# Socket.IO Real-Time Messaging Implementation

## Overview
This document describes the Socket.IO real-time messaging implementation for the Global Real Estate Platform. The implementation provides authenticated, real-time communication between users with full message persistence and multi-user conversation support.

## Architecture

### Database Schema
The conversation system supports both direct (1-on-1) and group conversations:

```prisma
model Conversation {
  id           String                     @id @default(cuid())
  title        String?                    // Optional title for group conversations
  isGroup      Boolean                    @default(false)
  createdAt    DateTime                   @default(now())
  updatedAt    DateTime                   @updatedAt

  participants ConversationParticipant[]
  messages     Message[]
}

model ConversationParticipant {
  id             String       @id @default(cuid())
  conversationId String
  userId         String
  joinedAt       DateTime     @default(now())
  leftAt         DateTime?
  role           String       @default("member") // member, admin
  lastReadAt     DateTime?

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([conversationId, userId])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  createdAt      DateTime     @default(now())
  readAt         DateTime?

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User         @relation(fields: [senderId], references: [id], onDelete: Cascade)
}
```

### Authentication
Socket.IO connections are authenticated using JWT tokens:

1. Client requests a JWT token from `/api/auth/socket-token`
2. Server validates the NextAuth session and issues a JWT
3. Client connects to Socket.IO with the JWT token
4. Server validates the JWT and attaches user info to the socket

### Server Implementation
- **File**: `/src/lib/socket.ts`
- **Port**: 5544 (development)
- **Path**: `/api/socketio`
- **CORS**: Configured for development and production environments

### Client Implementation
- **Hook**: `/src/hooks/use-socket.ts`
- **Component**: `/src/components/chat/chat-component.tsx`

## Features

### ✅ Implemented
- [x] JWT-based authentication for Socket.IO connections
- [x] Multi-user conversation support (direct and group chats)
- [x] Real-time message sending and receiving
- [x] Message persistence to database
- [x] Conversation participant verification
- [x] Typing indicators
- [x] Read receipts
- [x] Message history loading
- [x] Proper error handling
- [x] CORS security configuration
- [x] Production-ready architecture

### Events Supported

#### Client → Server Events
- `conversation:join` - Join a conversation room
- `conversation:leave` - Leave a conversation room
- `message:send` - Send a message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `message:read` - Mark message as read

#### Server → Client Events
- `connection:success` - Authentication successful
- `conversation:messages` - Initial message history
- `message:received` - New message broadcast
- `typing:update` - Typing status update
- `message:read_update` - Read receipt update
- `error` - Error notifications

## API Endpoints

### Socket Token Generation
```
POST /api/auth/socket-token
Authorization: NextAuth session required
Response: { token: "jwt_token" }
```

### Conversations
```
GET /api/conversations
Authorization: NextAuth session required
Response: { conversations: [...] }

POST /api/conversations
Body: { otherUserId: string } | { title: string, isGroup: true, participantIds: string[] }
Response: { conversation: {...} }
```

### Messages
```
POST /api/messages
Body: { conversationId: string, content: string }
Response: { message: {...} }
```

## Testing

### Seed Data
Run the conversation seed script to create test data:
```bash
npx tsx scripts/seed-conversations.ts
```

### Manual Testing
1. Start the server: `npm run dev`
2. Open the dashboard in browser: `http://localhost:5544/dashboard`
3. Navigate to the "Messages" tab
4. Test real-time messaging with the demo conversation

### Production Considerations
- Set proper CORS origins in production
- Use environment variables for allowed origins
- Implement rate limiting for Socket.IO events
- Consider horizontal scaling with Redis adapter
- Monitor Socket.IO connection metrics

## Security
- JWT token expiration: 24 hours
- Participant verification for all conversation access
- Message sender validation
- CORS restrictions based on environment
- No anonymous connections allowed

## Performance
- Message history limited to 50 recent messages per conversation
- Typing timeouts to prevent spam
- Database queries optimized with proper indexes
- Socket rooms for efficient message broadcasting

## Error Handling
- Authentication failures return proper error messages
- Database errors are caught and logged
- Client-side error display for user feedback
- Graceful fallbacks for connection issues
