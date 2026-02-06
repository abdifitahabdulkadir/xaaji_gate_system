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
