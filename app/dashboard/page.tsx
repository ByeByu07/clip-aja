"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { PlusIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { CreateNewContestModal } from "@/components/create-new-contest-modal"
import { ContestDetails } from "@/components/contest-details"
import { authClient } from "@/lib/auth-client"
import { contests } from "@/drizzle/schema"

type Session = typeof authClient.$Infer.Session;
type Contest = typeof contests.$inferSelect;

export default function Page() {

  const { data: session } = authClient.getSession()
  const [isCreateNewContestModalOpen, setIsCreateNewContestModalOpen] = useState(false)
  const [contest, setContest] = useState<Contest[] | null>(null)

  const fetchContests = async () => {
    const response = await fetch('/api/contests');
    const data = await response.json();
    console.log(data);
    setContest(data.data);
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Dashboard" link="/dashboard/clipper" linkText="akun clipper" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-4">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Button className={cn("w-full", isCreateNewContestModalOpen ? "hidden" : "", "hover:-translate-y-1 hover:bg-green-500 transition-all duration-500 ease-in-out")} variant="outline" onClick={() => setIsCreateNewContestModalOpen(true)}><PlusIcon className="mr-2 h-4 w-4" /> Buat Sayembara</Button>
            </div>
            {isCreateNewContestModalOpen && (
              <CreateNewContestModal onClose={() => setIsCreateNewContestModalOpen(false)} />
            )}
            <ContestDetails contest={contest} onClose={() => setContest(null)} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
