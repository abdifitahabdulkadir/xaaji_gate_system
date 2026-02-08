import { buttonVariants } from '@/components/ui/button'
import UserTableRenderer from '@/components/users/UserTableRenderer'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full space-y-2.5">
      <div className="w-full flex justify-end">
        <Link to="/dashboard/users/create" className={cn(buttonVariants())}>
          Create User
        </Link>
      </div>
      <UserTableRenderer />
    </div>
  )
}
