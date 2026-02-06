import { createStart } from '@tanstack/react-start'
import { globalAuthMiddlewareFn } from './data/user.functions'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [globalAuthMiddlewareFn],
  }
})
