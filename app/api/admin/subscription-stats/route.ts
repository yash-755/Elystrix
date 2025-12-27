import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";


export async function GET() {
    try {
        // Fetch real subscription data from database
        const [totalUsers, activeSubscriptions, planBreakdown] = await Promise.all([
            prisma.user.count(),
            prisma.subscription.findMany({
                where: { status: "ACTIVE" },
            }),
            prisma.subscription.groupBy({
                by: ["plan"],
                where: { status: "ACTIVE" },
                _count: { plan: true },
            }),
        ])

        // Calculate paid users (PRO or ELITE)
        const paidUsers = activeSubscriptions.filter((sub) => sub.plan !== "FREE").length

        // Calculate MRR (Monthly Recurring Revenue)
        const pricingMap: Record<string, number> = {
            FREE: 0,
            PRO: 1999,
            ELITE: 4999,
        }
        const mrr = activeSubscriptions.reduce((acc, sub) => acc + (pricingMap[sub.plan] || 0), 0)

        // Format plan breakdown
        const formattedBreakdown = planBreakdown.map((p) => ({
            plan: p.plan,
            count: p._count.plan,
        }))

        // Ensure all plans are represented
        const allPlans = ["FREE", "PRO", "ELITE"]
        const completePlanBreakdown = allPlans.map((planName) => {
            const existing = formattedBreakdown.find((p) => p.plan === planName)
            return {
                plan: planName,
                count: existing?.count || 0,
            }
        })

        return NextResponse.json({
            totalUsers,
            activeSubscriptions: activeSubscriptions.length,
            paidUsers,
            mrr,
            planBreakdown: completePlanBreakdown,
        })
    } catch (error) {
        console.error("Error fetching subscription stats:", error)
        return NextResponse.json(
            {
                totalUsers: 0,
                activeSubscriptions: 0,
                paidUsers: 0,
                mrr: 0,
                planBreakdown: [],
            },
            { status: 200 }
        )
    }
}
