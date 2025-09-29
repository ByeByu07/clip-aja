"use client"

import * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconUsers,
  IconMoneybag,
} from "@tabler/icons-react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Viral Saiki",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/clipper",
      icon: IconDashboard,
    },
    {
      title: "Posts",
      url: "/dashboard/clipper/posts",
      icon: IconDashboard,
    },
    {
      title: "Social Accounts",
      url: "/dashboard/clipper/social-accounts",
      icon: IconUsers,
    },
    {
      title: "Payout",
      url: "/dashboard/clipper/payouts",
      icon: IconMoneybag,
    },
  ],
}

export function ClipperSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard/clipper">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Viral Saiki</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
