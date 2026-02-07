import UserTableRenderer from '@/components/users/UserTableRenderer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full space-y-2.5">
      <UserTableRenderer />
    </div>
  )
}
