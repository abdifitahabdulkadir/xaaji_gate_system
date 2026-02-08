import { Salary, SalaryPayment } from '@/generated/prisma/client'

type ActionResponse<T = null> = {
  data?: T
  success: boolean
  Errors?: {
    message?: string
    statusCode: number
  }
}

interface PrimaryNavProps {
  items: {
    title: string
    label: LucideIcon
    to: string
    activeOptions: {
      exact: boolean
    }
  }[]
}

type SessionUser = {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null | undefined | undefined
  banned: boolean | null
  role: 'user' | 'admin'
  banReason: string | null
  banExpires: Date | null
  gender?: string | null
}

type UserTable = {
  id: stirng
  name: string
  email: string
  gender: string | null
  role: string
  createdAt: string
  banned: boolean | null
  banReason: string | null
  banExpires: Date | null
  branchId: string | null
}

type SalaryDetials = {
  salary: Salary
  details: SalaryPayment[]
}

type CustomPrisma = Omit<
  PrismaClient<never, undefined, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>
