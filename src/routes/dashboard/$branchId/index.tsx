import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$branchId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>I am brnach</div>
}
