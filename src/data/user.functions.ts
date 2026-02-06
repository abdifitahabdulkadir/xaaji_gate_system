import { auth } from '@/lib/auth'
import { LoginSchema, RegisterSchema } from '@/lib/validations'
import { redirect } from '@tanstack/react-router'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { prisma } from 'prisma/prisma'
import { getHeaders } from './utils.functins'

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(RegisterSchema)
  .handler(async function ({ data }): Promise<ActionResponse> {
    try {
      const createdUser = await auth.api.signUpEmail({
        headers: await getHeaders(),
        body: {
          email: data.email,
          name: data.name,
          password: data.password,
        },
      })
      await prisma.user.update({
        where: {
          id: createdUser.user.id,
        },
        data: {
          gender: data.gender,
        },
      })

      return { success: true }
    } catch (error) {
      console.log(error)
      return {
        success: false,
        Errors: {
          statusCode: 400,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to Register. please try again',
        },
      }
    }
  })

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(LoginSchema)
  .handler(async function ({ data }): Promise<ActionResponse> {
    try {
      await auth.api.signInEmail({
        headers: await getHeaders(),
        body: {
          email: data.email,
          password: data.password,
        },
      })

      return { success: true }
    } catch (error) {
      console.log(error)
      return {
        success: false,
        Errors: {
          statusCode: 400,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to Login. please try again',
        },
      }
    }
  })

export const getUserSessionFn = createServerFn().handler(async () => {
  const session = await auth.api.getSession({
    headers: await getHeaders(),
  })
  if (!session) {
    redirect({ to: '/login' })
  }
  return {
    session: session?.session,
    user: session?.user,
  }
})

export const globalAuthMiddlewareFn = createMiddleware({
  type: 'request',
}).server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await getHeaders(),
  })

  if (!session) {
    redirect({ to: '/login' })
  }

  return next({
    context: session,
  })
})
