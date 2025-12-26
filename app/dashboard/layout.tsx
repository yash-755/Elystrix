import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardGuard } from "@/components/dashboard-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardGuard>
      <div className="min-h-screen flex bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-8">{children}</main>
        </div>
        <MobileNav />
      </div>
    </DashboardGuard>
  )
}
