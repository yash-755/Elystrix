"use server"

import { prisma } from "@/lib/prisma"

export interface SubscriptionData {
    plan: string
    status: string
    startDate: Date
    endDate: Date | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
}

/**
 * Get user's active subscription from database
 * Returns null if no subscription exists (treat as FREE)
 */
export async function getUserSubscription(
    userId: string
): Promise<SubscriptionData | null> {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        })

        if (!subscription) {
            return null
        }

        return {
            plan: subscription.plan,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            stripeCustomerId: subscription.stripeCustomerId,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
        }
    } catch (error) {
        console.error("Error fetching subscription:", error)
        return null
    }
}

/**
 * Get user's current plan (checks both User and Subscription)
 * Fallback: User.plan field, then default to FREE
 */
export async function getUserPlan(userId: string): Promise<string> {
    try {
        const subscription = await getUserSubscription(userId)

        if (subscription && subscription.status === "ACTIVE") {
            return subscription.plan
        }

        // Fallback to user.plan field
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { plan: true },
        })

        return user?.plan?.toUpperCase() || "FREE"
    } catch (error) {
        console.error("Error fetching user plan:", error)
        return "FREE"
    }
}
