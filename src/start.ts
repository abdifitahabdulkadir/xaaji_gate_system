import { createStart } from '@tanstack/react-start'
import { globalAuthMiddleware } from './data/user.functions'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [globalAuthMiddleware],
  }
})
