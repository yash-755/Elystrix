import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserSubscription } from "@/app/actions/subscription"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ plan: "FREE" }, { status: 200 })
        }

        // Fetch subscription
        const subscription = await getUserSubscription(user.id)

        return NextResponse.json({
            plan: subscription?.plan || "FREE",
            status: subscription?.status || "INACTIVE",
            subscription,
        })
    } catch (error) {
        console.error("Error fetching subscription data:", error)
        return NextResponse.json({ plan: "FREE" }, { status: 200 })
    }
}
