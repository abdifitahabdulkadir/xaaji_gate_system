import { createStart } from '@tanstack/react-start'
import { globalAuthMiddleware } from './data/user.function'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [globalAuthMiddleware],
  }
})
