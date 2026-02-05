import { Gender, UserRoles } from '@/generated/prisma/enums'
import z from 'zod'

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, 'User Name is required')
    .max(60, 'User name must be less than 60 characters')
    .regex(/^[0-9A-Za-z ]+$/, 'User name must not contain symbols'),
  email: z.email(),
  password: z
    .string()
    .min(1, 'Password  is required')
    .max(60, 'Password  must be less than 60 characters'),
  role: z.enum(UserRoles),
  gender: z.enum(Gender),
})

export const LoginSchema = RegisterSchema.pick({
  email: true,
  password: true,
})

// export types for easier use in the frontned
export type RegisterSchemaType = z.infer<typeof RegisterSchema>
export type LoginSchemaType = z.infer<typeof LoginSchema>
