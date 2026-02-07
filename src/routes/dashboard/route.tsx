import Header from '@/components/Header'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getUserSessionFn } from '@/data/user.functions'
import { createFileRoute } from '@tanstack/react-router'

import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  loader: async () => {
    return await getUserSessionFn()
  },
})
function RouteComponent() {
  const { user } = Route.useLoaderData()
  return (
    <SidebarProvider>
      <AppSidebar user={user!} />
      <SidebarInset>
        <Header user={user ?? undefined} />
        <div className="min-h-full py-10  px-6 w-full ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
