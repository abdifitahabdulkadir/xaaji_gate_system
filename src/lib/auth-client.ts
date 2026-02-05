import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { auth } from './auth'
import { accessControl, adminRole, userRole } from './permissions'

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac: accessControl,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
    inferAdditionalFields<typeof auth>(),
  ],
})
