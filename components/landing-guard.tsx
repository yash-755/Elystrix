"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function LandingGuard({ children }: { children: React.ReactNode }) {
    const { user, loading, role } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user) {
            // User is authenticated - redirect to appropriate dashboard
            if (role === "admin") {
                router.push("/admin")
            } else {
                router.push("/dashboard")
            }
        }
    }, [user, loading, role, router])

    // While loading or if user is authenticated, don't show landing page
    if (loading || user) {
        return null
    }

    // Show landing page only to unauthenticated users
    return <>{children}</>
}
