"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface EnrollButtonProps {
    pathId: string
    isEnrolled: boolean
    isLoggedIn: boolean
}

export function EnrollButton({ pathId, isEnrolled, isLoggedIn }: EnrollButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (!isLoggedIn) {
            router.push("/login")
            return
        }

        if (isEnrolled) {
            router.push(`/dashboard/paths/${pathId}`)
            return
        }

        // Enroll - call server action
        setLoading(true)
        try {
            const response = await fetch("/api/paths/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pathId }),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Enrolled successfully!")
                router.push(`/dashboard/paths/${pathId}`)
                router.refresh()
            } else {
                toast.error(result.error || "Failed to enroll")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button size="lg" className="gold-glow" onClick={handleClick} disabled={loading}>
            {isEnrolled ? (
                <>
                    Continue Path <Check className="ml-2 h-4 w-4" />
                </>
            ) : (
                <>
                    {isLoggedIn ? "Enroll Now" : "Login to Enroll"} <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    )
}
