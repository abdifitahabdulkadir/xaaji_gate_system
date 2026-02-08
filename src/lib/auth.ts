import { generateCustomIdFn } from '@/data/utils.functins'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins/admin'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prisma } from '../../prisma/prisma'
import { adminRole, userRole } from './permissions'
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          const { data } = await generateCustomIdFn({
            data: {
              entity: 'user',
              prisma,
            },
          })
          return {
            data: {
              ...user,
              id: data?.customId,
            },
          }
        },
      },
    },
  },
  user: {
    additionalFields: {
      banned: {
        type: 'boolean',
        input: false,
      },
      role: {
        type: ['admin', 'user'],
        input: false,
      },
      banReason: {
        type: 'string',
        input: false,
      },
      banExpires: {
        type: 'date',
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days in seconds
  },
  plugins: [
    tanstackStartCookies(),
    admin({
      bannedUserMessage:
        'You have been banned to log in please contact to admin',
      // 7 days for expiration in seconds,
      defaultBanExpiresIn: 60 * 60 * 24 * 7,
      roles: {
        admin: adminRole,
        user: userRole,
      },
      adminRoles: ['admin'],
      defaultRole: 'admin',
    }),
  ],
})
