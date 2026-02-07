import BackButton from '@/components/shared/BackButton'
import EditBasicDataForm from '@/components/users/EditBasicDataForm'
import { getUserByIdFn } from '@/data/user.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users/$userId/edit')({
  component: RouteComponent,
  async loader({ params }) {
    return await getUserByIdFn({
      data: {
        userId: params.userId,
      },
    })
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()
  return (
    <div className="w-full h-full space-y-3.5">
      <BackButton to="/dashboard/users" />
      <div className="h-full w-full ">
        <EditBasicDataForm user={data.data} />
      </div>
    </div>
  )
}
