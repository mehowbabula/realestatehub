import { db } from '../src/lib/db'

async function seedConversations() {
  try {
    console.log('🌱 Seeding conversation data...')

    // Get some existing users
    const users = await db.user.findMany({ take: 3 })
    
    if (users.length < 2) {
      console.log('⚠️  Need at least 2 users to create conversations. Create some users first.')
      return
    }

    // Create a direct conversation between first two users
    const directConversation = await db.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [
            { userId: users[0].id, role: 'member' },
            { userId: users[1].id, role: 'member' }
          ]
        }
      }
    })

    console.log(`✅ Created direct conversation: ${directConversation.id}`)

    // Add some messages to the conversation
    await db.message.createMany({
      data: [
        {
          conversationId: directConversation.id,
          senderId: users[0].id,
          content: 'Hello! I saw your listing and I\'m interested. Could you tell me more about it?'
        },
        {
          conversationId: directConversation.id,
          senderId: users[1].id,
          content: 'Hi! Thanks for your interest. It\'s a great property in a prime location. Would you like to schedule a viewing?'
        },
        {
          conversationId: directConversation.id,
          senderId: users[0].id,
          content: 'That sounds perfect! I\'m available this weekend. What times work for you?'
        }
      ]
    })

    // Create a group conversation if we have at least 3 users
    if (users.length >= 3) {
      const groupConversation = await db.conversation.create({
        data: {
          title: 'Property Investors Group',
          isGroup: true,
          participants: {
            create: [
              { userId: users[0].id, role: 'admin' },
              { userId: users[1].id, role: 'member' },
              { userId: users[2].id, role: 'member' }
            ]
          }
        }
      })

      console.log(`✅ Created group conversation: ${groupConversation.id}`)

      await db.message.createMany({
        data: [
          {
            conversationId: groupConversation.id,
            senderId: users[0].id,
            content: 'Welcome to the Property Investors Group! Feel free to share opportunities here.'
          },
          {
            conversationId: groupConversation.id,
            senderId: users[1].id,
            content: 'Thanks for creating this group! I have some commercial properties that might interest everyone.'
          },
          {
            conversationId: groupConversation.id,
            senderId: users[2].id,
            content: 'Great idea! Looking forward to collaborating on deals.'
          }
        ]
      })
    }

    console.log('🎉 Conversation seeding completed!')

  } catch (error) {
    console.error('❌ Error seeding conversations:', error)
  } finally {
    await db.$disconnect()
  }
}

seedConversations()
