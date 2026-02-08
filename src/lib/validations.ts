import { Gender, UserRoles } from '@/generated/prisma/enums'
import z from 'zod'

export const RegisterSchema = z.object({
  salary: z
    .string()
    .regex(/^\d+$/, 'Please provide value only numbers not characters'),
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

export const EditBasicDataSchema = RegisterSchema.omit({
  password: true,
})

export const BanUserSchema = z.object({
  banned: z.boolean(),
  banExpires: z.union([
    z.undefined(),
    z.date().refine((selectedDate) => {
      const today = new Date()
      const selected = new Date(selectedDate)
      const isValid = selected.getTime() >= today.getTime()
      if (!isValid) {
        throw new Error('Ban expiration date must not be in the past')
      }
      return isValid
    }),
  ]),
  bannedReason: z.union([
    z.undefined(),
    z
      .string()
      .min(1, 'Banning reason is required')
      .max(40, 'Banning reason must be less than 40 characters'),
  ]),
})

export const ChangeUserBranchSchema = z.object({
  branchId: z.string().min(1, 'Branch Is required'),
})

export const CreateUserSchema = RegisterSchema.extend({})

// export types for easier use in the fronend.
export type RegisterSchemaType = z.infer<typeof RegisterSchema>
export type LoginSchemaType = z.infer<typeof LoginSchema>
export type EditBasicDataSchemaType = z.infer<typeof EditBasicDataSchema>
export type BanUserSchemaType = z.infer<typeof BanUserSchema>
export type ChangeUserBranchSchemaType = z.infer<typeof ChangeUserBranchSchema>
