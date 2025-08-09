import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@realestate.com'
  const agentEmail = 'test@realestate.com'

  const [adminHash, agentHash] = await Promise.all([
    hash('admin123', 10),
    hash('test123', 10),
  ])

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminHash, role: 'admin', name: 'Admin User' },
    create: {
      email: adminEmail,
      name: 'Admin User',
      role: 'admin',
      passwordHash: adminHash,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
  })

  await prisma.user.upsert({
    where: { email: agentEmail },
    update: { passwordHash: agentHash, role: 'agent', name: 'Test Agent' },
    create: {
      email: agentEmail,
      name: 'Test Agent',
      role: 'agent',
      passwordHash: agentHash,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    },
  })

  console.log('Seeded users:')
  console.log('- admin@realestate.com / admin123 (role: admin)')
  console.log('- test@realestate.com / test123 (role: agent)')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})

