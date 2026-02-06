'use client'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { Link } from '@tanstack/react-router'

export function SidebarLinks({ items }: PrimaryNavProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu className="space-y-3.5">
        {items.map((option, index) => (
          <SidebarMenuItem key={index}>
            <Link
              {...option}
              activeProps={{
                className: 'font-bold rounded-4xl bg-primary  text-white ',
              }}
              to={option.to}
              className="flex pr-2 pl-4  focus:bg-primary focus:text-white items-center  gap-2.5 py-1  "
            >
              <option.label className="w-4 h-4" />
              <span className="text-lg font-normal">{option.title}</span>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
