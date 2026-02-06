import { authClient } from '@/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function useSignout() {
  const [pending, startTransition] = useTransition()
  const navigate = useNavigate()

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess() {
            toast.success('Sucessfully Logged Out')
            navigate({ to: '/login' })
          },
          onError({ error }) {
            toast.error(error.message)
          },
        },
      })
    })
  }
  return {
    pending,
    handleSignOut,
  }
}
