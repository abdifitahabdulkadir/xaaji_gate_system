import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

interface Props {
  user?: SessionUser | null
}
export default function Header({ user }: Props) {
  return (
    <header className="flex h-20 bg-sidebar shrink-0 items-center gap-2 transition-[width,height] ease-linear  ">
      <div className="flex  py-2  items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-black/70 hover:bg-primary hover:text-white scale-[1.4] rounded-4xl!" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </div>
      <div className="w-full flex items-center px-4 gap-4 ">
        <h2 className="text-3xl font-bold">XAAJI GATE SYSTEM</h2>
        {user && (
          <Avatar className="size-15 rounded-full ml-auto">
            <AvatarImage src={user.image ?? ''} alt={user.name} />
            <AvatarFallback className="rounded-4xl bg-primary text-2xl italic ">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  )
}
