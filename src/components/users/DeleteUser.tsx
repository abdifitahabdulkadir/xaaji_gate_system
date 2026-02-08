import { deleteUserByIdFn } from '@/data/user.function'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useTransition } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

interface Props {
  userId: string
}
export default function DeleteUserForm({ userId }: Props) {
  const [isDeleting, startTransition] = useTransition()
  const useDeleteUserbyIdFn = useServerFn(deleteUserByIdFn)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  function handleDeleteUserById() {
    startTransition(async () => {
      const result = await useDeleteUserbyIdFn({
        data: {
          userId,
        },
      })
      if (result.success) {
        toast.success('Successfully deleted a user')
        await queryClient.invalidateQueries({
          queryKey: ['users'],
        })
        navigate({ to: '/dashboard/users' })
        return
      }
      toast.error(result.Errors?.message!)
    })
  }
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="mb-4 text-xl font-semibold">Delete User</h2>
      <Button
        disabled={isDeleting}
        onClick={handleDeleteUserById}
        className="bg-destructive text-white px-4 py-2 rounded hover:bg-destructive/90 transition-colors"
        type="button"
      >
        Delete User
      </Button>
    </div>
  )
}
