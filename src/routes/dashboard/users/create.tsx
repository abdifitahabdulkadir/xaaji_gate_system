import RegisterForm from '@/components/auth/RegisterForm'
import BackButton from '@/components/shared/BackButton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/users/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full space-y-3">
      <BackButton to="/dashboard/users" />
      <RegisterForm type="create" />
    </div>
  )
}
