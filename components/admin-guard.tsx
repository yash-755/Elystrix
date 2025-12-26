"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { isAdmin } from "@/app/actions/auth-check"

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        const checkRole = async () => {
            if (user) {
                const admin = await isAdmin(user.uid)
                if (!admin) {
                    router.push("/dashboard") // Redirect students to dashboard
                } else {
                    setIsAuthorized(true)
                }
            } else if (!loading) {
                router.push("/login")
            }
        }

        checkRole()
    }, [user, loading, router])

    if (loading || isAuthorized === null) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthorized) return null

    return <>{children}</>
}
