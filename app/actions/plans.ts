"use server"

import { prisma } from "@/lib/prisma"
import { Plan } from "@prisma/client"
import { revalidatePath } from "next/cache"

const defaultPlans = [
    {
        key: "free",
        name: "Free",
        price: "₹0",
        sellingPrice: 0,
        originalPriceNum: 0,
        originalPrice: null,
        period: "forever",
        description: "Get started with basic courses",
        features: [
            "Access to free courses",
            "Basic progress tracking",
            "Community forum access",
            "Basic level certificates",
            "Limited quiz attempts",
        ],
        popular: false,
        users: 5234,
        percentage: 42,
        color: "bg-gray-500"
    },
    {
        key: "pro",
        name: "Pro",
        price: "₹199",
        sellingPrice: 199,
        originalPriceNum: 499,
        originalPrice: "₹499",
        period: "per month",
        description: "For serious learners",
        features: [
            "All Free features",
            "Unlimited premium courses",
            "Career level certificates",
            "Unlimited quiz attempts",
            "Downloadable resources",
            "Priority support",
            "Learning paths access",
            "Progress analytics",
        ],
        popular: true,
        users: 3124,
        percentage: 25,
        color: "bg-primary"
    },
    {
        key: "elite",
        name: "Elite",
        price: "₹499",
        sellingPrice: 499,
        originalPriceNum: 1999,
        originalPrice: "₹1,999",
        period: "per month",
        description: "For professionals & teams",
        features: [
            "All Pro features",
            "Premium level certificates",
            "1-on-1 mentorship sessions",
            "Career coaching",
            "Resume review",
            "Interview preparation",
            "Exclusive masterclasses",
            "Early access to new courses",
            "Dedicated account manager",
        ],
        popular: false,
        users: 1224,
        percentage: 10,
        color: "bg-primary"
    }
]

export async function getPlans() {
    try {
        const plans = await prisma.plan.findMany({
            orderBy: { sellingPrice: 'asc' }
        })

        if (plans.length === 0) {
            console.log("Seeding default plans to MongoDB...")
            await prisma.plan.createMany({
                data: defaultPlans
            })
            return await prisma.plan.findMany({
                orderBy: { sellingPrice: 'asc' }
            })
        }

        return plans
    } catch (error) {
        console.error("Failed to fetch plans:", error)
        return []
    }
}

export async function updatePlan(id: string, data: Partial<Plan>) {
    try {
        await prisma.plan.update({
            where: { id },
            data
        })
        revalidatePath('/admin/subscriptions')
        revalidatePath('/pricing')
        return true
    } catch (error) {
        console.error("Failed to update plan:", error)
        return false
    }
}
