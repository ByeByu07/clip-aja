"use client"

import * as React from "react"
import {
  IconInnerShadowTop,
  IconAward
} from "@tabler/icons-react"
import { authClient } from "@/lib/auth-client"
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
import Link from "next/link"

type Session = typeof authClient.$Infer.Session;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [session, setSession] = React.useState<Session | null>(null)

  const loadSession = async () => {
    const session = await authClient.getSession()
    setSession(session.data)
  }

  React.useEffect(() => {
    loadSession()
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <span className="text-xl font-semibold uppercase text-[Rubik] text-[#fb8500]">Clip Aja</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[{
          title: "Contest",
          url: "/dashboard",
          icon: IconAward,
        }]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{email: session?.user.email || "", name: session?.user.name || "", avatar: session?.user.image || ""}} />
      </SidebarFooter>
    </Sidebar>
  )
}
