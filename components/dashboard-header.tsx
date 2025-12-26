"use client"

import { Bell, Search, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatWidget } from "@/components/chat/chat-widget"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export function DashboardHeader() {
  const { user } = useAuth()
  const [plan, setPlan] = useState<string>("FREE")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) {
        setPlan("FREE")
        setLoading(false)
        return
      }

      try {
        // Fetch subscription from our database API
        const response = await fetch("/api/subscription")
        if (response.ok) {
          const data = await response.json()
          setPlan(data.plan || "FREE")
        } else {
          setPlan("FREE")
        }
      } catch (error) {
        console.error("Error fetching subscription:", error)
        setPlan("FREE")
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [user])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Mobile Menu */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="hidden md:flex relative max-w-md flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses, paths, certificates..." className="pl-10 bg-transparent w-full" />
          </div>
          <Link href="/courses">
            <Button className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all rounded-lg">
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4">
          <ChatWidget />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-8 text-center text-muted-foreground text-sm">
                <p>No new notifications</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Plan Badge - Shows real subscription from DB */}
          <Link href="/pricing">
            <div
              className={`hidden sm:flex items-center justify-center px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${plan === "PRO" || plan === "ELITE" ? "bg-primary/10 border-primary/20" : "bg-muted border-border"
                }`}
            >
              <span
                className={`text-xs font-bold uppercase ${plan === "PRO" || plan === "ELITE" ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {loading ? "..." : plan}
              </span>
            </div>
          </Link>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={user?.photoURL || "/diverse-avatars.png"} alt={user?.displayName || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">{user?.displayName?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.displayName}</span>
                  <span className="text-sm font-normal text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings?tab=profile" className="cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/certificates">My Certificates</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription">Subscription</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={async () => {
                  const { auth } = await import("@/lib/firebase")
                  const { signOut: firebaseSignOut } = await import("firebase/auth")
                  await firebaseSignOut(auth)
                  window.location.href = "/"
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
