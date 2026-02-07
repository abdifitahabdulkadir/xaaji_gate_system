import { auth } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import {
  BanUserSchema,
  EditBasicDataSchema,
  LoginSchema,
  RegisterSchema,
} from '@/lib/validations'
import { redirect } from '@tanstack/react-router'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { prisma } from 'prisma/prisma'
import z from 'zod'
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

export const globalAuthMiddleware = createMiddleware({
  type: 'request',
}).server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await getHeaders(),
  })

  if (!session) {
    return redirect({ to: '/login' })
  }
  return next({
    context: {
      session: session.session,
      user: session.user,
    },
  })
})

export const getAllUsers = createServerFn().handler(async function (): Promise<
  ActionResponse<UserTable[]>
> {
  try {
    const users = await prisma.user.findMany({})

    if (!users.length) return { success: true, data: [] }

    const transformed: UserTable[] = users.map((eachUser) => {
      return {
        id: eachUser.id,
        name: eachUser.name,
        email: eachUser.email,
        gender: eachUser.gender,
        role: eachUser.role,
        createdAt: formatDate(eachUser.createdAt),
        banExpires: eachUser.banExpires,
        banned: eachUser.banned ?? false,
        banReason: eachUser.banReason ?? 'Not banned ',
      }
    })
    return { success: true, data: transformed }
  } catch (error) {
    return {
      success: false,
      Errors: {
        statusCode: 400,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch Users. please try again',
      },
    }
  }
})

export const getUserByIdFn = createServerFn()
  .inputValidator(
    z.object({
      userId: z.string().min(1, 'User ID is required'),
    }),
  )
  .handler(async function ({ data }): Promise<ActionResponse<UserTable>> {
    try {
      const foundUser = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      })
      if (!foundUser) return { success: true }
      const transformed: UserTable = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        gender: foundUser.gender,
        role: foundUser.role,
        createdAt: formatDate(foundUser.createdAt),
        banExpires: foundUser.banExpires,
        banned: foundUser.banned ?? false,
        banReason: foundUser.banReason ?? 'Not banned ',
      }

      return { success: true, data: transformed }
    } catch (error) {
      return {
        success: true,
        Errors: {
          message:
            error instanceof Error ? error.message : 'Failed to fetch user',
          statusCode: 400,
        },
      }
    }
  })

export const editUsersBasicDataFn = createServerFn()
  .inputValidator(
    EditBasicDataSchema.extend({
      userId: z.string().min(1, 'User ID is required'),
    }),
  )
  .handler(async function ({ data }): Promise<ActionResponse<UserTable>> {
    try {
      await prisma.user.update({
        where: {
          id: data.userId,
        },
        data: {
          name: data.name,
          gender: data.gender,
          role: data.role,
          email: data.email,
        },
      })

      return { success: true }
    } catch (error) {
      return {
        success: true,
        Errors: {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to save  the changes',
          statusCode: 400,
        },
      }
    }
  })

export const banUnBanUserFn = createServerFn({ method: 'POST' })
  .inputValidator(
    BanUserSchema.extend({
      userId: z.string().min(1, 'User ID is required'),
    }),
  )
  .handler(async function ({ data }): Promise<ActionResponse> {
    try {
      const foundUser = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      })
      if (!foundUser) throw new Error('User with given ID is not found')

      if (foundUser.banned) {
        await auth.api.unbanUser({
          headers: await getHeaders(),
          body: {
            userId: data.userId,
          },
        })
      } else {
        await auth.api.banUser({
          headers: await getHeaders(),
          body: {
            userId: data.userId,
            banReason: data.bannedReason,
            banExpiresIn: data.banExpires
              ? Math.floor(data.banExpires.getTime() / 1000)
              : undefined,
          },
        })
      }
      return { success: true }
    } catch (error) {
      return {
        success: false,
        Errors: {
          statusCode: 400,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to ban or unban user. please try again',
        },
      }
    }
  })
