import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({
                totalUsers: 0,
                activeSubscriptions: 0,
                paidUsers: 0,
                mrr: 0,
                planBreakdown: [],
            });
        }

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
        ]);

        const paidUsers = activeSubscriptions.filter((sub) => sub.plan !== "FREE").length;

        const pricingMap: Record<string, number> = {
            FREE: 0,
            PRO: 1999,
            ELITE: 4999,
        };

        const mrr = activeSubscriptions.reduce(
            (acc, sub) => acc + (pricingMap[sub.plan] || 0),
            0
        );

        const formattedBreakdown = ["FREE", "PRO", "ELITE"].map((plan) => {
            const found = planBreakdown.find((p) => p.plan === plan);
            return { plan, count: found?._count.plan || 0 };
        });

        return NextResponse.json({
            totalUsers,
            activeSubscriptions: activeSubscriptions.length,
            paidUsers,
            mrr,
            planBreakdown: formattedBreakdown,
        });
    } catch (error) {
        console.error("Error fetching subscription stats:", error);
        return NextResponse.json(
            {
                totalUsers: 0,
                activeSubscriptions: 0,
                paidUsers: 0,
                mrr: 0,
                planBreakdown: [],
            },
            { status: 200 }
        );
    }
}
