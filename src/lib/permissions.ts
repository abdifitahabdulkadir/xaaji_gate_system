import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access'
const statement = {
  ...defaultStatements,
  mas_tasks: ['create', 'update', 'delete'],
} as const

export const accessControl = createAccessControl(statement)

export const userRole = accessControl.newRole({
  mas_tasks: ['update'],
})

export const adminRole = accessControl.newRole({
  mas_tasks: ['create', 'update', 'delete'],
  ...adminAc.statements,
})
