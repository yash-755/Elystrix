"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Award, ClipboardList, CreditCard, Settings, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

const sidebarItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/courses", icon: BookOpen, label: "My Courses" },
  { href: "/dashboard/paths", icon: LayoutGrid, label: "Learning Paths" },
  { href: "/dashboard/certificates", icon: Award, label: "Certificates" },
  { href: "/dashboard/quizzes", icon: ClipboardList, label: "Quiz Attempts" },
  { href: "/dashboard/subscription", icon: CreditCard, label: "Subscription" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar h-screen sticky top-0">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary gold-glow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
