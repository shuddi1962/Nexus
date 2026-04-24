import { insforge, collections } from '../src/lib/insforge'
import { AuthService } from '../src/services/auth'
import { logger } from '../src/lib/logger'

const DEMO_ACCOUNTS = [
  {
    email: "admin@nexus.demo",
    password: "NexusAdmin2025!",
    name: "Platform Admin",
    role: "admin" as const,
    plan: "agency" as const,
  },
  {
    email: "owner@nexus.demo",
    password: "NexusOwner2025!",
    name: "Agency Owner",
    role: "owner" as const,
    plan: "agency" as const,
  },
  {
    email: "pro@nexus.demo",
    password: "NexusPro2025!",
    name: "Pro User",
    role: "owner" as const,
    plan: "pro" as const,
  },
  {
    email: "starter@nexus.demo",
    password: "NexusStarter2025!",
    name: "Starter User",
    role: "owner" as const,
    plan: "starter" as const,
  },
  {
    email: "staff@nexus.demo",
    password: "NexusStaff2025!",
    name: "Team Member",
    role: "staff" as const,
    plan: "pro" as const,
  }
]

async function seedDemoAccounts() {
  logger.info('Starting demo accounts seeding...')

  for (const account of DEMO_ACCOUNTS) {
    try {
      // Check if user already exists
      const existingUser = await AuthService.findUserByEmail(account.email)
      if (existingUser) {
        logger.info(`User ${account.email} already exists, skipping...`)
        continue
      }

      // Create user
      const user = await AuthService.createUser({
        email: account.email,
        password: account.password,
        name: account.name,
      })

      // Update role and plan
      await insforge.patch(`/collections/${collections.users}/${user.id}`, {
        role: account.role,
        plan: account.plan,
        email_verified: true,
      })

      logger.info(`Created demo account: ${account.email}`)
    } catch (error) {
      logger.error(`Error creating demo account ${account.email}:`, error)
    }
  }

  logger.info('Demo accounts seeding completed!')
}

// Run if this script is executed directly
if (require.main === module) {
  seedDemoAccounts()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seeding failed:', error)
      process.exit(1)
    })
}