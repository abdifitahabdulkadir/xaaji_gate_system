'use client'

import { LayoutDashboard, Users } from 'lucide-react'

import { NavUser } from '@/components/sidebar/nav-user'
import { SidebarLinks } from '@/components/sidebar/sidebar-links'
import { TeamSwitcher } from '@/components/sidebar/team-switcher'

import { linkOptions } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../ui/sidebar'

const navLinks: PrimaryNavProps['items'] = linkOptions([
  {
    to: '/dashboard',
    label: LayoutDashboard,
    activeOptions: { exact: true },
    title: 'Branches',
  },
  {
    to: '/dashboard/users',
    title: 'Users',
    label: Users,
    activeOptions: { exact: false },
  },
])
interface Props {
  user: SessionUser
}
export function AppSidebar({ user }: Props) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher {...user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarLinks items={navLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
